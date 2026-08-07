"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  { t: "Quantas séries por semana para hipertrofia?", i: "📊" },
  { t: "Qual a frequência ideal por grupo muscular?", i: "🔁" },
  { t: "Vale a pena treinar até a falha?", i: "🔥" },
  { t: "Como progredir carga na prática?", i: "📈" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
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

      let sources: Source[] = [];
      const raw = res.headers.get("X-Sources");
      if (raw) {
        try {
          sources = JSON.parse(atob(raw));
        } catch {}
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
    }
  }

  function updateLast(content: string, sources: Source[]) {
    setMessages((m) => {
      const copy = [...m];
      copy[copy.length - 1] = { role: "assistant", content, sources };
      return copy;
    });
  }

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4">
      {/* Header */}
      <header className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-4 backdrop-blur-xl">
        <Logo />
        <div className="flex-1">
          <h1 className="text-[15px] font-semibold leading-tight tracking-tight">
            Hipertrofia AI
          </h1>
          <p className="text-xs text-foreground/50">
            Respostas baseadas em ciência, com fonte
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground/60 sm:flex">
          <span className="size-1.5 rounded-full bg-accent" /> Gemini · RAG
        </span>
      </header>

      {/* Mensagens */}
      <div ref={scrollRef} className="scroll-slim flex-1 overflow-y-auto py-6">
        {empty ? (
          <EmptyState onPick={ask} />
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <Bubble
                key={i}
                msg={msg}
                typing={loading && i === messages.length - 1 && !msg.content}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pb-5 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition focus-within:border-accent/50 focus-within:shadow-md"
        >
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(input);
              }
            }}
            rows={1}
            placeholder="Pergunte sobre volume, frequência, progressão…"
            className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/35"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-white transition enabled:hover:bg-accent-strong disabled:opacity-30"
          >
            {loading ? <Spinner /> : <SendIcon />}
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-foreground/35">
          Responde apenas com base na base de conhecimento. Não substitui avaliação
          profissional.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center px-2 pt-10 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-white shadow-lg shadow-accent/20">
        <DumbbellIcon className="size-7" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">
        Seu assistente de treino baseado em evidência
      </h2>
      <p className="mt-2 max-w-md text-sm text-foreground/55">
        Pergunte sobre prescrição de hipertrofia. Cada resposta é ancorada na
        literatura científica — e cita a fonte.
      </p>
      <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
        {SUGESTOES.map((s) => (
          <button
            key={s.t}
            onClick={() => onPick(s.t)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition hover:border-accent/40 hover:shadow-sm"
          >
            <span className="text-base">{s.i}</span>
            <span className="flex-1 text-foreground/80 group-hover:text-foreground">
              {s.t}
            </span>
            <ArrowIcon className="size-4 shrink-0 text-foreground/25 transition group-hover:text-accent" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ msg, typing }: { msg: Message; typing: boolean }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex animate-fade-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-up gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-strong text-white shadow-sm">
        <DumbbellIcon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-3 pt-0.5">
        {typing ? (
          <TypingDots />
        ) : (
          <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-[0.95em] prose-p:leading-relaxed prose-li:my-0.5 prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        )}

        {msg.sources && msg.sources.length > 0 && (
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground/45">
              <BookIcon className="size-3.5" /> Fontes consultadas
            </p>
            <div className="space-y-1.5">
              {msg.sources.map((s) => (
                <div key={s.n} className="flex items-start gap-2 text-xs">
                  <span className="mt-px grid size-4 shrink-0 place-items-center rounded bg-accent/10 text-[10px] font-semibold text-accent">
                    {s.n}
                  </span>
                  <span className="text-foreground/70">
                    <span className="font-medium text-foreground/85">
                      {s.docTitle}
                    </span>
                    {s.section ? ` › ${s.section}` : ""}
                    {s.source ? (
                      <span className="text-foreground/40"> — {s.source}</span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot size-2 rounded-full bg-accent"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ---------- Ícones (SVG inline, sem dependência) ---------- */

function Logo() {
  return (
    <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-strong text-white shadow-sm shadow-accent/20">
      <DumbbellIcon className="size-5" />
    </div>
  );
}

function DumbbellIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6.5 6.5v11M4 9v6M17.5 6.5v11M20 9v6M6.5 12h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden>
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5zM18 3v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
