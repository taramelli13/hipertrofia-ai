import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/retrieval";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";

// Transformers.js precisa do runtime Node (não roda no edge).
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

export async function POST(req: Request) {
  let question: string;
  try {
    const body = await req.json();
    question = (body.question ?? "").toString().trim();
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!question) {
    return Response.json({ error: "Pergunta vazia." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY não configurada. Veja o .env.example." },
      { status: 500 },
    );
  }

  // 1. Recupera os trechos relevantes (RAG).
  const chunks = await retrieve(question, { topK: 5, minScore: 0.86 });

  // Metadados das fontes, enviados ao cliente via header.
  const sources = chunks.map((c, i) => ({
    n: i + 1,
    docTitle: c.docTitle,
    section: c.section,
    source: c.source,
    score: Number(c.score.toFixed(3)),
  }));

  // 2. Chama o Claude com streaming, ancorado nos trechos.
  const anthropic = new Anthropic({ apiKey });
  const llmStream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(question, chunks) }],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of llmStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode("\n\n[erro ao gerar resposta: " + (err as Error).message + "]"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Sources": Buffer.from(JSON.stringify(sources)).toString("base64"),
    },
  });
}
