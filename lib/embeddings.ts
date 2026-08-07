import { GoogleGenAI } from "@google/genai";

/**
 * Embeddings via API do Google Gemini (text-embedding-004, 768 dimensões).
 *
 * Escolhido em vez de um modelo local (Transformers.js) porque roda em
 * ambiente serverless sem binários nativos nem download de modelo no cold
 * start — o que quebrava o deploy na Vercel. Usa a mesma chave do LLM.
 *
 * A API distingue pergunta de documento pelo taskType (RETRIEVAL_QUERY vs
 * RETRIEVAL_DOCUMENT), o que melhora a qualidade da busca.
 */
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

export type EmbedKind = "query" | "passage";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada.");
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

function taskTypeFor(kind: EmbedKind): string {
  return kind === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT";
}

/** Gera o embedding de um texto. */
export async function embed(
  text: string,
  kind: EmbedKind = "query",
): Promise<number[]> {
  const ai = getClient();
  const res = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      taskType: taskTypeFor(kind),
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  });
  const values = res.embeddings?.[0]?.values;
  if (!values) throw new Error("Embedding vazio retornado pela API.");
  return values;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Extrai o retryDelay (em ms) de um erro 429 da API, com fallback. */
function retryDelayMs(err: unknown): number {
  const msg = (err as Error)?.message ?? "";
  const match = msg.match(/"retryDelay":"(\d+)s"/);
  return match ? (parseInt(match[1], 10) + 2) * 1000 : 45_000;
}

/**
 * Gera embeddings para vários textos, em lotes, respeitando o rate limit do
 * free tier (100 req/min). Faz retry com backoff em erros 429 e dá uma pausa
 * entre lotes para não estourar a cota.
 */
export async function embedBatch(
  texts: string[],
  kind: EmbedKind = "passage",
  onProgress?: (done: number, total: number) => void,
): Promise<number[][]> {
  const ai = getClient();
  const BATCH = 20;
  const THROTTLE_MS = 14_000; // ~85 req/min, com folga sob o limite de 100
  const vectors: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH) {
    const slice = texts.slice(i, i + BATCH);

    let attempt = 0;
    while (true) {
      try {
        const res = await ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: slice,
          config: {
            taskType: taskTypeFor(kind),
            outputDimensionality: EMBEDDING_DIMENSIONS,
          },
        });
        const batch = res.embeddings ?? [];
        for (const e of batch) {
          if (!e.values) throw new Error("Embedding vazio retornado pela API.");
          vectors.push(e.values);
        }
        break;
      } catch (err) {
        const status = (err as { status?: number })?.status;
        if (status === 429 && attempt < 5) {
          const wait = retryDelayMs(err);
          process.stdout.write(`\r   rate limit — aguardando ${wait / 1000}s...   `);
          await sleep(wait);
          attempt++;
          continue;
        }
        throw err;
      }
    }

    onProgress?.(vectors.length, texts.length);
    if (i + BATCH < texts.length) await sleep(THROTTLE_MS);
  }

  return vectors;
}

/** Similaridade de cosseno entre dois vetores (com normalização por magnitude). */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
