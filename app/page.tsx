"use client";

import { useRef, useState } from "react";

interface Source {
  n: number;
  docTitle: string;
  section: string;
  source: string;
  score: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGESTOES = [
  "Quantas séries por semana para hipertrofia?",
  "Qual a frequência ideal por grupo muscular?",
  "Vale a pena treinar até a falha?",
  "Como progredir carga na prática?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    // placeholder da resposta que vai sendo preenchido pelo streaming
    setMessages((m) => [...m, { role: "assistant", content: "", sources: [] }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Erro." }));
        updateLast(error ?? "Erro ao responder.", []);
        return;
      }

      // fontes vêm no header, codificadas em base64
      let sources: Source[] = [];
      const raw = res.headers.get("X-Sources");
      if (raw) {
        try {
          sources = JSON.parse(atob(raw));
        } catch {
          /* ignora */
        }
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        updateLast(text, sources);
      }
    } catch {
      updateLast("Falha de conexão com o servidor.", []);
    } finally {
      setLoading(false);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }

  function updateLast(content: string, sources: Source[]) {
    setMessages((m) => {
      const copy = [...m];
      copy[copy.length - 1] = { role: "assistant", content, sources };
      return copy;
    });
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4">
      <header className="border-b border-black/10 py-5 dark:border-white/10">
        <h1 className="text-xl font-semibold tracking-tight">Hipertrofia AI</h1>
        <p className="text-sm text-black/60 dark:text-white/50">
          Assistente de treino ancorado em literatura científica · respostas com fonte
        </p>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto py-6">
        {messages.length === 0 && (
          <div className="pt-6">
            <p className="mb-3 text-sm text-black/60 dark:text-white/50">
              Experimente perguntar:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-black/15 px-3 py-1.5 text-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} loading={loading && i === messages.length - 1} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="border-t border-black/10 py-4 dark:border-white/10"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre volume, frequência, progressão..."
            className="flex-1 rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition disabled:opacity-40"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
        <p className="mt-2 text-xs text-black/40 dark:text-white/30">
          Só responde com base na base de conhecimento. Não substitui avaliação profissional.
        </p>
      </form>
    </div>
  );
}

function Bubble({ msg, loading }: { msg: Message; loading: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl bg-foreground px-4 py-2.5 text-sm text-background"
            : "max-w-[90%] space-y-3"
        }
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {msg.content || (loading ? "Consultando a base…" : "")}
        </p>

        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="space-y-1.5 border-t border-black/10 pt-3 dark:border-white/10">
            <p className="text-xs font-medium text-black/50 dark:text-white/40">
              Fontes consultadas
            </p>
            {msg.sources.map((s) => (
              <div key={s.n} className="text-xs text-black/60 dark:text-white/50">
                <span className="font-medium">[{s.n}]</span> {s.docTitle}
                {s.section ? ` › ${s.section}` : ""}
                {s.source ? (
                  <span className="text-black/40 dark:text-white/30"> — {s.source}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
