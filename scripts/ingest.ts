/**
 * Pipeline de ingestão do RAG.
 *
 * Lê todos os .md em data/knowledge-base, quebra em chunks, gera embeddings
 * locais e grava o índice vetorial em data/index.json.
 *
 * Uso: npm run ingest
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chunkMarkdown } from "../lib/chunk";
import {
  embedBatch,
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
} from "../lib/embeddings";
import type { Chunk, IndexedChunk, VectorIndex } from "../lib/types";

const KB_DIR = join(process.cwd(), "data", "knowledge-base");
const OUT_FILE = join(process.cwd(), "data", "index.json");

async function main() {
  console.log("📚 Lendo base de conhecimento em", KB_DIR);
  const files = (await readdir(KB_DIR)).filter((f) => f.endsWith(".md"));
  console.log(`   ${files.length} documentos encontrados.`);

  // 1. Chunking
  const chunks: Chunk[] = [];
  for (const file of files) {
    const raw = await readFile(join(KB_DIR, file), "utf-8");
    chunks.push(...chunkMarkdown(file, raw));
  }
  console.log(`✂️  ${chunks.length} chunks gerados.`);

  // 2. Embeddings
  console.log(`🧠 Gerando embeddings com ${EMBEDDING_MODEL} (local)...`);
  const texts = chunks.map(embeddingInput);
  const vectors = await embedBatch(texts, "passage", (done, total) => {
    if (done % 20 === 0 || done === total) {
      process.stdout.write(`\r   ${done}/${total} chunks embeddados`);
    }
  });
  process.stdout.write("\n");

  // 3. Monta e grava o índice
  const indexed: IndexedChunk[] = chunks.map((c, i) => ({
    ...c,
    embedding: vectors[i],
  }));

  const index: VectorIndex = {
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    createdAt: new Date().toISOString(),
    chunks: indexed,
  };

  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index));
  const kb = Math.round(JSON.stringify(index).length / 1024);
  console.log(`✅ Índice salvo em data/index.json (${indexed.length} chunks, ~${kb} KB).`);
}

/** Texto usado para gerar o embedding: título + seção + conteúdo dão mais contexto. */
function embeddingInput(c: Chunk): string {
  const head = [c.docTitle, c.section].filter(Boolean).join(" — ");
  return head ? `${head}\n${c.text}` : c.text;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
