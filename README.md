# Hipertrofia AI

Assistente de IA que responde dúvidas técnicas de treino de hipertrofia **baseado exclusivamente em literatura científica** — e cita a fonte de cada resposta. Se a informação não está na base de conhecimento, ele diz que não sabe, em vez de inventar.

É uma implementação de **RAG (Retrieval-Augmented Generation)** full-stack: busca vetorial local + LLM, com guardrail anti-alucinação.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google&logoColor=white)
![Embeddings](https://img.shields.io/badge/Embeddings-local%20(Transformers.js)-9cf)

## Por que este projeto

A base de conhecimento tem ~30 documentos sobre prescrição de hipertrofia, sintetizados de literatura científica (Schoenfeld, Helms, Hough) com regras acionáveis e citação de fonte página a página. Um LLM genérico responderia sobre isso "de cabeça", misturando mito e evidência. Aqui, **toda resposta é ancorada em trechos reais dessa base** — e rastreável até a fonte.

## Como funciona (arquitetura RAG)

```
                        INGESTÃO (offline, npm run ingest)
  docs .md  ──►  chunking por seção  ──►  embeddings locais  ──►  data/index.json
                                          (multilingual-e5)        (índice vetorial)

                        CONSULTA (online, por pergunta)
  pergunta  ──►  embedding da pergunta  ──►  similaridade de cosseno (top-k)
                                                      │
                          trechos relevantes + pergunta  ──►  Claude (streaming)
                                                      │
                                          resposta com citações  ──►  UI
```

1. **Ingestão** (`scripts/ingest.ts`): lê os `.md`, quebra em chunks por seção preservando título e fontes, gera embeddings **localmente** (sem API externa) e grava um índice vetorial em JSON.
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
| Embeddings | Transformers.js — `multilingual-e5-small` (384-d) | Roda **local**, sem custo/chave, e é multilíngue (bom em português) |
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
│   ├── embeddings.ts          # embeddings locais (Transformers.js) + cosseno
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

- **Embeddings locais em vez de API**: mantém o custo em zero, roda offline e demonstra o funcionamento por baixo do capô. Para escala, o índice em memória pode migrar para um vector DB (Postgres + pgvector, Pinecone) sem mudar a interface de `retrieval.ts`.
- **`multilingual-e5-small`**: um primeiro protótipo com `all-MiniLM` (inglês) discriminava mal em português — perguntas fora do tema pontuavam quase igual às válidas. O modelo multilíngue (com os prefixos `query:`/`passage:` que a família E5 exige) deu separação real e viabilizou o guardrail.
- **Chunking por seção `##`**: preserva a unidade semântica de cada tópico e mantém a linha de fontes junto, permitindo citação precisa.

## Limitações e próximos passos

- A base cobre um escopo definido de hipertrofia; fora disso o assistente (corretamente) não responde.
- Não substitui avaliação profissional individualizada.
- Próximos passos: reranking dos resultados, histórico de conversa multi-turno, e migração para vector DB persistente.

---

Base de conhecimento sintetizada de literatura científica (Schoenfeld 2ª ed., Helms *Muscle & Strength Pyramid*, Hough/Schoenfeld *Advanced PT*). Os textos-fonte originais não são versionados por direito autoral.
