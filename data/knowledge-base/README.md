# Knowledge Base — Hipertrofia & Prescrição de Treino

Base de conhecimento construída sobre três fontes-âncora, com regras de prescrição acionáveis para hipertrofia em pacientes da consultoria nutri.

## Fontes primárias

| ID | Livro | Edição | Autores principais | PDF |
|---|---|---|---|---|
| **SCH** | Science and Development of Muscle Hypertrophy | 2ª (2021) | Brad Schoenfeld | [schoenfeld-2ed.pdf](../livros/schoenfeld-2ed.pdf) |
| **HOU** | Advanced Personal Training: Science to Practice | 2ª (2022) | Hough, Schoenfeld, Penn (Routledge) — multi-autor | [hough-advanced-pt-2ed.pdf](../livros/hough-advanced-pt-2ed.pdf) |
| **HEL** | The Muscle & Strength Pyramid v2.0 — Training | 2ª (2018) | Helms, Morgan, Valdez | [helms-pyramid-training.pdf](../livros/helms-pyramid-training.pdf) |

Convenção de citação nos `.md`: `[SCH, p.78]`, `[HOU cap.13]`, `[HEL Level 2]`.

**Restrição obrigatória**: nunca usar Israetel/Renaissance Periodization (RP) como fonte ou framework. Para landmarks de volume e periodização, usar Helms, Schoenfeld, ou literatura primária.

## Mapa de navegação

### Fundamento
- [00-glossary.md](00-glossary.md) — termos técnicos (CSA, MPS, RIR, RPE etc.)
- [coverage-matrix.md](coverage-matrix.md) — matriz cruzando os 3 livros por tópico

### Capítulos (em ordem de prioridade de prescrição)
- [chapters/program-design.md](chapters/program-design.md) — síntese mestra de program design
- [chapters/adherence.md](chapters/adherence.md) — pré-requisito de qualquer prescrição
- [chapters/progression.md](chapters/progression.md) — métodos de progressão
- **Variáveis** ([chapters/variables/](chapters/variables/))
  - volume / frequency / load / intensity-of-effort
  - rom / rep-duration / rest-interval
  - exercise-selection / exercise-order / muscle-action
- [chapters/advanced-techniques.md](chapters/advanced-techniques.md) — drop sets, supersets, eccentric overload
- **Fatores individuais** ([chapters/individual-factors/](chapters/individual-factors/))
  - women / older-adults / pregnant / training-status / genetics
- [chapters/mechanisms.md](chapters/mechanisms.md) — tensão mecânica, estresse metabólico, dano
- [chapters/measurement.md](chapters/measurement.md) — como aferir hipertrofia
- [chapters/aerobic-concurrent.md](chapters/aerobic-concurrent.md) — treino aeróbio concorrente
- [chapters/nutrition.md](chapters/nutrition.md) — só o escopo cap.9 Schoenfeld e cap.4 Hough/Aragon

### Atualizações e auditoria
- [updates/literature-2021-2026.md](updates/literature-2021-2026.md) — meta-análises e ECRs novos
- [updates/outdated-and-revised.md](updates/outdated-and-revised.md) — claims dos livros revisados pela literatura nova

### Tracking
- [tracking/progression-methods.md](tracking/progression-methods.md) — algoritmos concretos de monitoramento

### Síntese
- [prescription-rulebook.md](prescription-rulebook.md) — árvore de decisão acionável

## Template de cada `.md` de capítulo/tópico

```markdown
# [Tópico]

## TL;DR
Frase única com a regra prescritiva acionável.

## Regras de prescrição
- Se [contexto] → [ação] (evidência: alta/moderada/baixa)
- ...

## O que cada fonte diz
- **SCH** [p.X]: ...
- **HOU** [cap.X]: ... (ou "não cobre")
- **HEL** [Level X]: ... (ou "não cobre")
- **Convergência / Divergência**: explícito

## Evidência primária
Estudos-chave (3–5): desenho, n, população, achado, DOI.

## Casos limite / variação individual
Quando a regra padrão NÃO se aplica.

## Citações
1. ...
```

## Estado do projeto

Acompanhar via TaskList do Claude Code. Fase 1 concluída quando este README, glossary e coverage-matrix estiverem prontos. Demais fases conforme o plano em `~/.claude/plans/`.
