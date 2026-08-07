# Hipertrofia AI

Assistente de IA que responde dúvidas técnicas de treino de hipertrofia **baseado exclusivamente em literatura científica** — e cita a fonte de cada resposta. Se a informação não está na base de conhecimento, ele diz que não sabe, em vez de inventar.

É uma implementação de **RAG (Retrieval-Augmented Generation)** full-stack: busca vetorial local + LLM, com guardrail anti-alucinação.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google&logoColor=white)
![Embeddings](https://img.shields.io/badge/Embeddings-gemini--embedding--001-9cf)

## Por que este projeto

A base de conhecimento tem ~30 documentos sobre prescrição de hipertrofia, sintetizados de literatura científica (Schoenfeld, Helms, Hough) com regras acionáveis e citação de fonte página a página. Um LLM genérico responderia sobre isso "de cabeça", misturando mito e evidência. Aqui, **toda resposta é ancorada em trechos reais dessa base** — e rastreável até a fonte.

## Como funciona (arquitetura RAG)

```
                        INGESTÃO (offline, npm run ingest)
  docs .md  ──►  chunking por seção  ──►  embeddings (Gemini)  ──►  data/index.json
                                          (gemini-embedding-001)    (índice vetorial)

                        CONSULTA (online, por pergunta)
  pergunta  ──►  embedding da pergunta  ──►  similaridade de cosseno (top-k)
                                                      │
                          trechos relevantes + pergunta  ──►  Claude (streaming)
                                                      │
                                          resposta com citações  ──►  UI
```

1. **Ingestão** (`scripts/ingest.ts`): lê os `.md`, quebra em chunks por seção preservando título e fontes, gera embeddings via API do Gemini (com throttling para o rate limit do free tier) e grava um índice vetorial em JSON.
2. **Recuperação** (`lib/retrieval.ts`): embeda a pergunta e busca os chunks mais similares por cosseno. Um **limiar de score** descarta resultados fracos.
3. **Geração** (`app/api/chat/route.ts`): manda os trechos + a pergunta pro Gemini, com um *system prompt* que o obriga a responder **só** com base neles. A resposta chega via streaming; as fontes vêm num header.

### Guardrail anti-alucinação (duas camadas)

- **Retrieval**: se nenhum chunk passa do limiar de similaridade, o contexto vai vazio.
- **Prompt**: o modelo é instruído a responder *"Não encontrei isso na base de conhecimento"* quando os trechos não cobrem a pergunta.

Resultado: perguntas fora do tema (ex.: "como funciona a bolsa de valores?") não são respondidas com invenção.

## Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Front + Back | Next.js 16 (App Router) + TypeScript | Um só projeto para UI e API |
| Estilo | Tailwind CSS v4 | UI enxuta e responsiva |
| Embeddings | Google `gemini-embedding-001` (768-d) | Sem binário nativo — roda bem em serverless; distingue query/document por taskType |
| Busca vetorial | Índice em memória + cosseno | Zero infraestrutura; deploy simples |
| LLM | Google Gemini (`gemini-2.5-flash`) com streaming | Resposta em tempo real; free tier |

## Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar a chave do Gemini (gratuita: https://aistudio.google.com/apikey)
cp .env.example .env.local
# edite .env.local e cole sua GEMINI_API_KEY

# 3. Gerar o índice vetorial a partir dos documentos
npm run ingest

# 4. Subir o app
npm run dev
# abra http://localhost:3000
```

## Estrutura

```
├── data/
│   ├── knowledge-base/        # ~30 documentos .md (a base de conhecimento)
│   └── index.json             # índice vetorial gerado pela ingestão
├── lib/
│   ├── chunk.ts               # quebra markdown em chunks por seção
│   ├── embeddings.ts          # embeddings via API do Gemini + cosseno
│   ├── retrieval.ts           # busca vetorial + limiar do guardrail
│   ├── prompt.ts              # system prompt (grounding) + montagem de contexto
│   └── types.ts               # tipagem do pipeline
├── scripts/
│   └── ingest.ts              # pipeline de ingestão (chunk → embed → índice)
└── app/
    ├── api/chat/route.ts      # endpoint RAG (recupera + chama o LLM em streaming)
    ├── page.tsx               # UI de chat (client component)
    └── layout.tsx
```

## Decisões técnicas

- **Embeddings via API em vez de modelo local**: o primeiro protótipo rodava os embeddings localmente com Transformers.js — ótimo em dev (custo zero, offline), mas o binário nativo do `onnxruntime` **quebrava a função serverless na Vercel** (a função crashava na inicialização). Migrei para a API de embeddings do Gemini: sem binário nativo, sem download de modelo no cold start, e usando a mesma chave do LLM. Um trade-off real de arquitetura para viabilizar o deploy.
- **Calibração do guardrail**: com os embeddings do Gemini, perguntas dentro do tema pontuam ~0.74–0.80 e fora do tema ~0.53–0.58. O limiar de similaridade (0.68) fica no meio dessa folga, separando os dois casos de forma confiável.
- **Índice importado como módulo**: `retrieval.ts` importa `data/index.json` diretamente (em vez de `fs.readFile` em runtime) para garantir que o índice seja empacotado na função serverless.
- **Chunking por seção `##`**: preserva a unidade semântica de cada tópico e mantém a linha de fontes junto, permitindo citação precisa.

## Limitações e próximos passos

- A base cobre um escopo definido de hipertrofia; fora disso o assistente (corretamente) não responde.
- Não substitui avaliação profissional individualizada.
- Próximos passos: reranking dos resultados, histórico de conversa multi-turno, e migração para vector DB persistente.

---

Base de conhecimento sintetizada de literatura científica (Schoenfeld 2ª ed., Helms *Muscle & Strength Pyramid*, Hough/Schoenfeld *Advanced PT*). Os textos-fonte originais não são versionados por direito autoral.
