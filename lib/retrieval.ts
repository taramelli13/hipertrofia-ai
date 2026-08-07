import { embed, cosineSimilarity } from "./embeddings";
import type { RetrievedChunk, VectorIndex } from "./types";
// Importa o índice como módulo para garantir que ele seja empacotado na
// função serverless (um fs.readFile em runtime pode não ser incluído no deploy).
import indexData from "@/data/index.json";

const index = indexData as unknown as VectorIndex;

/**
 * Busca os `topK` chunks mais relevantes para a pergunta.
 * `minScore` filtra resultados fracos — é o que sustenta o guardrail
 * anti-alucinação: se nada passa do limiar, o assistente não inventa.
 */
export async function retrieve(
  query: string,
  { topK = 5, minScore = 0.68 }: { topK?: number; minScore?: number } = {},
): Promise<RetrievedChunk[]> {
  const queryVec = await embed(query, "query");

  const scored = index.chunks
    .map((c) => ({ ...c, score: cosineSimilarity(queryVec, c.embedding) }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).filter((c) => c.score >= minScore);
}
