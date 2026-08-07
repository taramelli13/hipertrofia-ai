import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { embed, cosineSimilarity } from "./embeddings";
import type { RetrievedChunk, VectorIndex } from "./types";

let indexPromise: Promise<VectorIndex> | null = null;

/** Carrega o índice vetorial do disco (uma vez por processo). */
async function loadIndex(): Promise<VectorIndex> {
  if (!indexPromise) {
    indexPromise = readFile(join(process.cwd(), "data", "index.json"), "utf-8")
      .then((raw) => JSON.parse(raw) as VectorIndex)
      .catch(() => {
        throw new Error(
          "Índice não encontrado. Rode `npm run ingest` para gerar data/index.json.",
        );
      });
  }
  return indexPromise;
}

/**
 * Busca os `topK` chunks mais relevantes para a pergunta.
 * `minScore` filtra resultados fracos — é o que sustenta o guardrail
 * anti-alucinação: se nada passa do limiar, o assistente não inventa.
 */
export async function retrieve(
  query: string,
  { topK = 5, minScore = 0.86 }: { topK?: number; minScore?: number } = {},
): Promise<RetrievedChunk[]> {
  const index = await loadIndex();
  const queryVec = await embed(query);

  const scored = index.chunks
    .map((c) => ({ ...c, score: cosineSimilarity(queryVec, c.embedding) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK).filter((c) => c.score >= minScore);
  return top;
}
