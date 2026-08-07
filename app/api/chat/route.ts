import { GoogleGenAI } from "@google/genai";
import { retrieve } from "@/lib/retrieval";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";

// Transformers.js (embeddings locais) precisa do runtime Node (não roda no edge).
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-2.5-flash";

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY não configurada. Veja o .env.example." },
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

  // 2. Chama o Gemini com streaming, ancorado nos trechos.
  const ai = new GoogleGenAI({ apiKey });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: MODEL,
          contents: buildUserMessage(question, chunks),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 1024,
            temperature: 0.3,
          },
        });
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\n[erro ao gerar resposta: " + (err as Error).message + "]",
          ),
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
