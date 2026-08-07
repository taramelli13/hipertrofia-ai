import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

/**
 * Modelo de embeddings rodando 100% localmente (sem API externa) via
 * Transformers.js. multilingual-e5-small é multilíngue (bom em português),
 * gera vetores de 384 dimensões e distingue bem tema dentro/fora da base.
 *
 * A família E5 exige prefixos: "query: " para perguntas e "passage: " para
 * documentos. Respeitar isso é o que dá a boa separação semântica.
 */
export const EMBEDDING_MODEL = "Xenova/multilingual-e5-small";
export const EMBEDDING_DIMENSIONS = 384;

export type EmbedKind = "query" | "passage";

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

/** Carrega (uma única vez) o pipeline de extração de features. */
async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL);
  }
  return extractorPromise;
}

/** Gera o embedding normalizado (mean pooling) de um texto. */
export async function embed(
  text: string,
  kind: EmbedKind = "query",
): Promise<number[]> {
  const extractor = await getExtractor();
  const input = `${kind}: ${text}`;
  const output = await extractor(input, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

/** Gera embeddings para vários textos em sequência (com log de progresso). */
export async function embedBatch(
  texts: string[],
  kind: EmbedKind = "passage",
  onProgress?: (done: number, total: number) => void,
): Promise<number[][]> {
  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    vectors.push(await embed(texts[i], kind));
    onProgress?.(i + 1, texts.length);
  }
  return vectors;
}

/** Similaridade de cosseno entre dois vetores já normalizados (= produto escalar). */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}
