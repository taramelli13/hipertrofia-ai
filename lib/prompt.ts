import type { RetrievedChunk } from "./types";

/**
 * Instrução do sistema. O ponto central é o *grounding*: o modelo só pode
 * responder com base nos trechos recuperados. Se a informação não estiver lá,
 * ele deve admitir — é isso que impede a alucinação.
 */
export const SYSTEM_PROMPT = `Você é um assistente técnico de treino de hipertrofia. Responde em português do Brasil, de forma objetiva e prática, para nutricionistas e personal trainers.

REGRAS INEGOCIÁVEIS:
1. Responda EXCLUSIVAMENTE com base nos TRECHOS fornecidos abaixo. Não use conhecimento externo.
2. Se os trechos não contêm a resposta, diga claramente: "Não encontrei isso na base de conhecimento." Não invente, não estime, não complete com achismo.
3. Cite as fontes ao longo da resposta usando os marcadores [1], [2], etc., correspondentes aos trechos usados.
4. Seja direto: prefira faixas numéricas, regras acionáveis e recomendações práticas quando os trechos oferecerem.
5. Nunca contradiga os trechos. Se houver nuance ou condição, explicite-a.`;

/** Monta o bloco de contexto numerado que vai junto da pergunta. */
export function buildContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "(nenhum trecho relevante encontrado)";

  return chunks
    .map((c, i) => {
      const loc = [c.docTitle, c.section].filter(Boolean).join(" › ");
      const src = c.source ? `\nFonte citada: ${c.source}` : "";
      return `[${i + 1}] ${loc}${src}\n${c.text}`;
    })
    .join("\n\n---\n\n");
}

/** Mensagem do usuário: contexto recuperado + pergunta. */
export function buildUserMessage(question: string, chunks: RetrievedChunk[]): string {
  return `TRECHOS DA BASE DE CONHECIMENTO:\n\n${buildContext(chunks)}\n\n---\n\nPERGUNTA: ${question}`;
}
