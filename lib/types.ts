// Tipos centrais do pipeline de RAG.

/** Um pedaço (chunk) de um documento da base de conhecimento. */
export interface Chunk {
  id: string;
  /** Nome do arquivo de origem (ex.: "chapters__variables__volume.md"). */
  docId: string;
  /** Título do documento (primeiro `# ` do markdown). */
  docTitle: string;
  /** Seção dentro do documento (o `## ` correspondente), se houver. */
  section: string;
  /** Linha de fontes citada no doc (ex.: "SCH cap.4 p.78; HEL Level 2 p.45"). */
  source: string;
  /** Texto do chunk usado para busca e para alimentar o LLM. */
  text: string;
}

/** Chunk já com seu vetor de embedding, como fica salvo no índice. */
export interface IndexedChunk extends Chunk {
  embedding: number[];
}

/** Estrutura do arquivo de índice gerado pelo script de ingestão. */
export interface VectorIndex {
  model: string;
  dimensions: number;
  createdAt: string;
  chunks: IndexedChunk[];
}

/** Resultado de uma busca: um chunk com seu score de similaridade. */
export interface RetrievedChunk extends IndexedChunk {
  score: number;
}
