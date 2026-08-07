# Prescription Rulebook — Árvore de Decisão Acionável

> **Propósito**: dado o perfil do aluno (status, objetivo, dias/semana, restrições), este documento conduz por decisões sequenciais até gerar uma prescrição-base completa. Síntese das regras espalhadas em [chapters/](chapters/).
>
> **Como usar**: percorrer as 10 etapas em ordem. Cada etapa tem perguntas a fazer ao aluno + regras a aplicar + output a definir. Ao final, prescrição está completa.

---

## Etapa 0 — Pré-condições (antes de qualquer prescrição)

### Liberação médica
- [ ] Aluno tem alguma condição cardiovascular, metabólica ou musculoesquelética que exige avaliação médica? → Solicitar liberação antes de prescrever.
- [ ] Gestante? → Liberação obstétrica obrigatória. Ver [individual-factors/pregnant.md](chapters/individual-factors/pregnant.md).
- [ ] Idoso >65 com comorbidades? → Triagem cardiovascular antes de HIIT ou cargas pesadas. Ver [individual-factors/older-adults.md](chapters/individual-factors/older-adults.md).

### Avaliação inicial (entrevista + medições)
- [ ] Histórico de treino (anos consistentes, métodos usados, lesões prévias)
- [ ] Objetivo principal: hipertrofia geral / ponto fraco específico / força / estética / saúde
- [ ] Dias e tempo disponível por sessão
- [ ] Equipamento acessível (academia completa? casa? só halteres?)
- [ ] Preferências e aversões fortes (não prescrever o que ele odeia se houver alternativa)
- [ ] Estresse de vida + sono + dieta atual (linha de base)
- [ ] Fotos + circunferências + pregas (se viável) — base para tracking

---

## Etapa 1 — Determinar status de treino

> Ref: [individual-factors/training-status.md](chapters/individual-factors/training-status.md)

**Não usar "tempo de academia" automaticamente.** Usar **comportamento de progressão**:

| Comportamento | Status |
|---|---|
| Adiciona carga sessão-a-sessão consistentemente | **Novato** |
| Progride semana-a-semana ou mesocycle-a-mesocycle | **Intermediário** |
| Progride mês-a-mês ou bloco-a-bloco, próximo do platô | **Avançado** |

**Aluno "com muito tempo de academia" mas progressão errática** → tratar como funcionalmente **Novato**.

**Output**: Status definido + expectativa de magnitude de ganho ajustada.

---

## Etapa 2 — Confirmar adesão (priorizar acima de tudo)

> Ref: [adherence.md](chapters/adherence.md)

3 condições da pirâmide Helms:
1. **Realista**: cabe na rotina dele **na pior semana realista**, não na ideal
2. **Prazeroso**: prescrever exercícios que ele goste pelo menos majoritariamente
3. **Flexível**: incluir plano B (sessão reduzida) pra dias difíceis

### Decisões
- [ ] Aluno tem histórico de furar sessões? → **Prescrever menos** do que ideal (-1 dia/sem ou volume na metade inferior da faixa). Voltar à norma quando consolidar hábito.
- [ ] Aluno está sob estresse alto / sono ruim? → Priorizar adesão. Manter o hábito, não maximizar volume.
- [ ] Existe plano B explícito? → Definir sessão "C" (mobility + 1 composto + 1 isolado) para dias ruins. Não pular.

**Output**: ajuste do volume/frequência inicial conforme adesão histórica.

---

## Etapa 3 — Decidir frequência e split

> Ref: [variables/frequency.md](chapters/variables/frequency.md)

### Regra de ouro
**Cada grupamento ≥2× por semana**, distribuído conforme dias disponíveis.

### Tabela de decisão
| Dias/sem disponíveis | Status | Split recomendado |
|---|---|---|
| 2 | Qualquer | Full-body 2× |
| 3 | Novato | Full-body 3× |
| 3 | Intermediário+ | Push/Pull/Legs OU Full-body 3× |
| 4 | Qualquer | Upper/Lower 4× |
| 5 | Intermediário+ | PPL + 1 ênfase OU U/L + 1 ênfase |
| 6 | Intermediário+ | Push/Pull/Legs 6× (2 ciclos) |

**Output**: dias/sem + split definido.

---

## Etapa 4 — Definir volume semanal por grupamento

> Ref: [variables/volume.md](chapters/variables/volume.md)

### Tabela default
| Status | Volume default por grupamento |
|---|---|
| Novato | 6–10 séries/sem |
| Intermediário | 10–16 séries/sem |
| Avançado | 14–20 séries/sem |

### Ajustes
- **Iniciante com adesão duvidosa** → metade inferior (6–8 séries) + foco em consistência
- **Cutting** → cortar 2–4 séries/grupamento da prescrição padrão
- **Ponto fraco prioritário** → +4–6 séries/sem no grupamento atrasado, reduzir 2–3 em outro
- **Aluno em cutting agressivo OU alto estresse de vida OU >60 anos** → metade inferior da faixa

### Distribuir o volume entre as sessões da semana
Regra: ~10 séries diretas/grupamento/sessão é o teto produtivo. Acima, queda de qualidade.
- 12 séries/sem em 2 sessões: 6 + 6 ✅
- 16 séries/sem em 2 sessões: 8 + 8 ✅
- 20 séries/sem em 2 sessões: 10 + 10 (limite); melhor 7 + 7 + 6 em 3 sessões

**Output**: volume semanal por grupamento + distribuição entre sessões.

---

## Etapa 5 — Escolher exercícios

> Ref: [variables/exercise-selection.md](chapters/variables/exercise-selection.md), [variables/rom.md](chapters/variables/rom.md), [updates/outdated-and-revised.md](updates/outdated-and-revised.md)

### Cobertura mínima de padrões (na semana toda)
1. **Empurrar horizontal** (supino, flexão, máquina)
2. **Empurrar vertical** (desenvolvimento)
3. **Puxar horizontal** (remada)
4. **Puxar vertical** (puxada, barra)
5. **Agachamento** (livre, hack, leg press)
6. **Quadril hinge** (stiff, terra, hip thrust)
7. **Acessórios isolados** conforme grupamentos não cobertos
8. **Panturrilha, abdômen** se desejado

### Priorizar exercícios em **posição alongada** (atualização pós-2021):
- Peito: chest fly (alongado) + supino reto
- Quadríceps: leg extension + hack/sissy squat (alongado)
- Posterior: stiff/RDL > leg curl em pé
- Tríceps: overhead triceps extension > push-down
- Lats: pullover > pulldown
- Bíceps: incline curl > spider curl

### Composto vs isolado por sessão
- **Sempre composto antes de isolado** (a menos que priorizando um ponto fraco)
- Compostos: 2–4/sessão. Isolados: 3–6/sessão.

### Variação
- Compostos principais: manter 8–16 semanas para conseguir progredir carga
- Acessórios: rotacionar a cada 6–12 semanas

**Output**: lista de 5–8 exercícios por sessão, com séries por exercício somando o volume da etapa 4.

---

## Etapa 6 — Decidir faixa de reps e intensidade

> Ref: [variables/load.md](chapters/variables/load.md), [variables/intensity-of-effort.md](chapters/variables/intensity-of-effort.md)

### Tabela por tipo de exercício
| Tipo | Reps | %1RM | RIR (default) |
|---|---|---|---|
| Composto pesado (squat, terra, supino livre) | 5–8 | 75–85% | 2–3 |
| Composto moderado (leg press, supino máquina, remada) | 8–12 | 65–75% | 1–3 |
| Isolado | 10–15 | 60–70% | 0–2 |
| Finalização metabólica / pump | 12–25 | 40–60% | 0–1 |

### Distribuição na semana (para um grupamento)
- ~60% das séries em faixa moderada (8–12)
- ~25% em faixa pesada (5–8)
- ~15% em faixa leve / finalização (12–20)

**Output**: faixa de reps + %1RM (ou RM) por exercício + RIR-alvo.

---

## Etapa 7 — Definir descanso e cadência

> Ref: [variables/rest-interval.md](chapters/variables/rest-interval.md), [variables/rep-duration.md](chapters/variables/rep-duration.md)

### Descanso
- Compostos pesados: 3–5 min
- Compostos moderados: 2–3 min
- Isolados: 60–90 s
- APS (alternar antagonistas): 60–90s entre cada grupamento (efetivamente ~2 min entre séries do mesmo grupamento)

### Cadência
- **Default**: excêntrica 2–3s, isométrica 0–1s, concêntrica 1–2s, isométrica 0s
- Notação: `2-0-1-0` ou `3-0-2-0`
- **Excêntrica controlada é o ponto crítico** — não deixar cair
- Não usar tempos lentos (>4s concêntrica) como padrão — inferior

**Output**: descanso e tempo prescritos por sessão.

---

## Etapa 8 — Definir método de progressão

> Ref: [progression.md](chapters/progression.md)

| Status | Método |
|---|---|
| **Novato** | Linear simples: +1 rep ou +2.5–5 kg quando completar a meta |
| **Intermediário em compostos** | Wave loading: 3 sem crescentes + 1 deload, depois reset com carga maior |
| **Intermediário em isolados** | Double progression: reps até teto da faixa, depois +carga |
| **Avançado** | Block periodization OU DUP semanal |

### Deload
- Programado a cada 4–6 sem em intermediário/avançado
- Reativo se 2+ sinais de não-recuperação (Helms checklist)
- 1 semana, volume -50%, intensidade -1 RPE ou -10–20% carga

**Output**: método de progressão + ciclo de deload definido.

---

## Etapa 9 — Definir tracking

> Ref: [tracking/progression-methods.md](tracking/progression-methods.md)

### Métricas a acompanhar semanalmente
- [ ] Adesão (sessões executadas / prescritas)
- [ ] Volume real executado por grupamento
- [ ] Volume load por exercício principal
- [ ] Carga e reps em compostos-chave
- [ ] RPE médio da sessão (sRPE)
- [ ] Observações qualitativas (dor, fadiga, recordes)

### Reavaliação periódica
- **A cada 4 semanas**: revisar prescrição, fazer ajustes minores (carga, séries, exercícios)
- **A cada 12 semanas**: revisar prescrição completa, reavaliar status, possivelmente mudar split

**Output**: protocolo de tracking definido.

---

## Etapa 10 — Nutrição básica (escopo deste rulebook)

> Ref: [nutrition.md](chapters/nutrition.md). Para escopo nutricional aprofundado, projeto separado.

### Mínimo necessário
- [ ] Balanço energético adequado ao objetivo (superávit 200–500 kcal pra hipertrofia; déficit 200–500 pra cutting)
- [ ] Proteína 1.6–2.2 g/kg/dia em 3–5 doses
- [ ] Carboidrato 3–6 g/kg
- [ ] Hidratação 35 ml/kg + 500–1000 ml/h treino
- [ ] Considerar creatina 3–5 g/dia (alta evidência)

**Output**: orientação nutricional alinhada ao objetivo do treino.

---

## Teste end-to-end — Caso 1: Intermediário homem, 28 anos, 4 dias/sem, hipertrofia geral

**Perfil inicial**:
- 2 anos de treino consistente, progredindo semana-a-semana → Intermediário ✅
- Adesão histórica boa (~85% sessões)
- 60 min/sessão, 4 dias/sem, academia completa
- Sem lesões, sem restrições
- Sono 7h, dieta em superávit leve

**Aplicação do rulebook**:
- **Etapa 1** → Status: Intermediário
- **Etapa 2** → Adesão OK; prescrever na faixa-alvo
- **Etapa 3** → 4 dias/sem + intermediário → **Upper/Lower 4×**
- **Etapa 4** → Volume intermediário = 12–16 séries/grupamento/sem. Distribuir em 2 sessões/grupamento → 6–8 séries/sessão
- **Etapa 5** → Cobrir 6 padrões + isolados. Priorizar exercícios em posição alongada.

  Upper A (segunda): supino reto barra (3×6-8) + remada baixa neutra (3×8-10) + desenvolvimento halter (3×8-10) + pulldown (3×10-12) + tríceps overhead (3×10-12) + rosca incline (3×10-12)

  Lower A (terça): squat livre (3×6-8) + leg curl deitado (3×10-12) + cadeira extensora (3×12-15) + panturrilha em pé (4×10-15) + abdominal polia (3×12-15)

  Upper B (quinta): supino inclinado halter (3×8-10) + remada serrote (3×8-10) + supino máquina (3×10-12) + face pull (3×12-15) + rosca direta cabo (3×10-12) + tríceps polia (3×10-12)

  Lower B (sexta): RDL (3×8-10) + hack squat (3×8-10) + leg press 45° (3×12-15) + adutora (3×12-15) + panturrilha sentado (4×12-15) + prancha (3×30-60s)

- **Etapa 6** → Faixas e RIR aplicados acima
- **Etapa 7** → Descanso: 3 min compostos, 90s isolados. Cadência: 2-0-1-0
- **Etapa 8** → Wave loading 4 sem em compostos: sem 1 = 3×8 carga base; sem 2 = 3×7 +2.5kg; sem 3 = 3×6 +5kg; sem 4 deload. Double progression em isolados.
- **Etapa 9** → Tracking semanal: VL nos 4 compostos principais (supino, squat, RDL, remada) + adesão
- **Etapa 10** → Proteína 1.8 g/kg, superávit +300 kcal/dia, creatina 5g

**Prescrição completa gerada sem buraco de decisão** ✅

---

## Teste end-to-end — Caso 2: Iniciante mulher, 42 anos, 3 dias/sem, hipertrofia + estética

**Perfil inicial**:
- Nunca treinou consistente, começou 2 vezes e parou
- Adesão duvidosa
- 45 min/sessão, 3 dias/sem (seg/qua/sex), academia básica
- Sem lesões; ciclo menstrual regular sem queixas significativas

**Aplicação**:
- **Etapa 1** → Status: Novato
- **Etapa 2** → Adesão duvidosa → prescrever no mínimo viável, focar consistência. Plano B explícito: se chegar exausta, fazer só compostos (2 exercícios) e ir embora — não pular.
- **Etapa 3** → 3 dias + novata → **Full-body 3×**
- **Etapa 4** → Volume novato = 6–10 séries/grupamento/sem. Em 3 sessões → ~2–3 séries/grupamento/sessão. Total semanal: 6 séries/grupamento (limite inferior, focar técnica).
- **Etapa 5** → 6 exercícios/sessão cobrindo padrões fundamentais:

  Sessão A/B/C (mesma estrutura, exercícios podem rotacionar):
  - Agachamento livre OU goblet squat OU leg press (1 padrão de joelho) — 3×8-10
  - Stiff com halter OU RDL OU hip thrust (1 padrão de quadril) — 3×8-10
  - Supino máquina OU push-up (1 push) — 3×8-10
  - Remada máquina OU puxada (1 pull) — 3×8-10
  - Desenvolvimento halter sentado (1 push vertical) — 3×8-10
  - Prancha + panturrilha em pé (core + isolado) — 3×30s + 3×12

- **Etapa 6** → 8–12 reps em tudo (default novata). RIR 2–3 (segurança técnica). Aprender execução antes de buscar carga.
- **Etapa 7** → Descanso: 2 min compostos, 90s isolados. Cadência: 2-0-1-0 com foco em controle.
- **Etapa 8** → Linear simples: +1 rep ou +2.5 kg (compostos) / +1 kg (isolados) sessão-a-sessão.
- **Etapa 9** → Tracking simples: fotos a cada 6 sem + circunferências mensais + cargas + adesão. Ciclo menstrual: tracking individual sem prescrição cíclica obrigatória.
- **Etapa 10** → Proteína 1.6 g/kg, dieta em manutenção (se objetivo é definição) ou superávit leve, hidratação adequada.

**Prescrição completa gerada** ✅

---

## Mapa rápido para consulta

```
ESTADO INICIAL → Etapa 0–1 → STATUS + LIBERAÇÃO
PRÉ-PRESCRIÇÃO → Etapa 2 → ADESÃO CALIBRADA
ESQUELETO → Etapa 3 → FREQUÊNCIA + SPLIT
CORPO → Etapa 4–6 → VOLUME + EXERCÍCIOS + REPS/INTENSIDADE
DETALHE → Etapa 7–8 → DESCANSO + TEMPO + PROGRESSÃO
SUSTENTAÇÃO → Etapa 9 → TRACKING
FUNDAMENTO → Etapa 10 → NUTRIÇÃO BÁSICA
```

---

## Quando este rulebook NÃO basta

- **Casos clínicos complexos** (lesão crônica, multimorbidade, condição musculoesquelética significativa): trabalhar com fisio.
- **Atletas competitivos** (powerlifters, bodybuilders em prep, esportistas de alto rendimento): rulebook é base, mas precisa de individualização sob orientação especializada.
- **Pós-cirurgia / pós-lesão recente**: protocolo de reabilitação específico, não hipertrofia genérica.
- **Gestantes**: usar [individual-factors/pregnant.md](chapters/individual-factors/pregnant.md) que sobrepõe restrições adicionais.

---

## Atualização

Quando a 3ª edição do Schoenfeld for incorporada, revisar este rulebook nos pontos identificados em [updates/outdated-and-revised.md](updates/outdated-and-revised.md). O grande tópico de revisão pendente é **expansão da prescrição com posição alongada / lengthened partials** como classe de primeira linha.

---

## Citações

Todas as decisões estão fundamentadas nos `.md` referenciados. Para citações primárias específicas, consultar cada `.md` correspondente em [chapters/](chapters/) e [updates/](updates/).
