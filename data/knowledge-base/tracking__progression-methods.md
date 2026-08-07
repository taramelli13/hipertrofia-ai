# Métodos de Tracking de Progressão — Algoritmos Operacionais

> **Fontes**: HEL Level 3 (framework de progressão); SCH cap.4 + cap.8; HOU cap.7 (RPE/sRPE) + cap.13; literatura primária Helms RPE 2016, Damas 2015.
> **Propósito**: definir métricas, fórmulas, thresholds e algoritmos concretos que possam ser implementados em código (futuro site analisando dados do Treino.io).

---

## 1. Volume semanal por grupamento

### Definição operacional
- **Set volume** = nº de séries diretas + 0.5 × nº de séries indiretas para o grupamento, somado ao longo da semana.
- Séries **diretas**: o grupamento é o motor primário do exercício (ex.: rosca direta → bíceps).
- Séries **indiretas**: o grupamento é sinergista significativo em composto (ex.: supino → tríceps, deltóide anterior).
- **Aquecimento** (cargas <80% das séries válidas) **não conta** como série válida.

### Mapeamento exercício → grupamento (exemplos)
```
Supino reto (barra):     peito (1.0), tríceps (0.5), deltóide_ant (0.5)
Supino reto (máquina):   peito (1.0), tríceps (0.5)
Crucifixo / chest fly:   peito (1.0)
Agachamento (livre):     quadríceps (1.0), glúteo (0.5), adutor (0.5)
Leg press 45°:           quadríceps (1.0), glúteo (0.5), adutor (0.5)
Hack squat:              quadríceps (1.0), glúteo (0.5)
Stiff / RDL:             posterior (1.0), glúteo (0.5)
Hip thrust:              glúteo (1.0), posterior (0.5)
Leg curl:                posterior (1.0)
Puxada alta / pulldown:  latíssimo (1.0), bíceps (0.5)
Remada baixa:            latíssimo (1.0), upper_back (1.0), bíceps (0.5)
Desenvolvimento ombro:   deltóide_ant (1.0), tríceps (0.5)
Elevação lateral:        deltóide_lat (1.0)
Fly invertido:           deltóide_post (1.0), upper_back (0.5)
Rosca direta:            bíceps (1.0)
Tríceps polia/francês:   tríceps (1.0)
Panturrilha:             panturrilha (1.0)
Abdominal:               abdômen (1.0)
```

### Faixas-alvo por status (treino)
| Status | Volume mínimo (manutenção) | Volume eficaz (hipertrofia) | Volume teto recomendado |
|---|---|---|---|
| Novato | 4 séries/grupo/sem | 6–10 | 12 |
| Intermediário | 6 | 10–16 | 20 |
| Avançado | 8 | 14–20 | 25 (experimentação) |

### Flags
- **VOLUME_BAIXO**: volume semanal está abaixo do mínimo de manutenção do status.
  Algoritmo: `if volume_semanal < min_manutencao[status]`.
- **VOLUME_EXCESSIVO**: volume está acima do teto e aluno apresenta regressão de carga em 2+ exercícios.
  Algoritmo: `if volume_semanal > teto[status] AND regressao_detectada` (ver §5).

---

## 2. Volume load (VL) por exercício

### Definição
`VL = sets × reps × carga`

### Uso
- Acompanhar **tendência semanal** de VL **dentro do mesmo exercício**. NÃO comparar VL entre exercícios diferentes (faixas de reps diferentes distorcem).
- Métrica útil para detectar **estagnação** e **progressão real**.

### Algoritmo de tendência (regressão linear simples)
```
window = últimas 4 semanas
slope = regressao_linear(VL_semanal, tempo)

se slope > +5% por semana: PROGREDINDO_FORTE
se +1% ≤ slope ≤ +5%: PROGREDINDO
se -1% < slope < +1%: ESTÁVEL
se -5% ≤ slope ≤ -1%: REGREDINDO_LEVE
se slope < -5%: REGREDINDO_FORTE
```

Atenção: aluno pode estar em deload programado (regressão temporária esperada). Sinalizar apenas se regressão fora de janela de deload.

---

## 3. Progressão de carga por exercício

### Métodos por status

#### Novato — progressão linear simples
**Algoritmo**:
```
para cada exercício na sessão:
  se completou_serie_alvo(reps_alvo, carga_atual) em duas sessões consecutivas:
    proxima_sessao.carga = carga_atual + incremento[exercicio]
  se falhou_meta(reps_alvo) em duas sessões consecutivas:
    proxima_sessao.carga = carga_atual × 0.9
    reset_cycle()
```
Incrementos típicos:
- Compostos pesados (squat, terra, supino, remada): 2.5–5 kg
- Compostos médios (leg press, supino máquina): 5–10 kg
- Isolados: 1–2.5 kg

#### Intermediário em compostos — Wave Loading
**Algoritmo** (mesocycle 4 semanas):
```
sem 1: 3×8 a carga_base
sem 2: 3×7 a carga_base + 2.5 kg
sem 3: 3×6 a carga_base + 5 kg
sem 4: deload (3×6 a 80% da carga_base) OU pular se autoavaliação positiva
sem 5 (próximo ciclo): 3×8 a carga_base + 2.5 kg (incremento conquistado)
```

**Detecção de bom funcionamento**: volume load total do mesocycle N > mesocycle N-1.

#### Intermediário em isolados — Double Progression
**Algoritmo**:
```
faixa_reps = [r_min, r_max]  # ex.: [12, 15]

sessão atual:
  se todas as séries completam r_max no exercício:
    proxima_sessao.carga = carga_atual + 1-2.5kg
    proxima_sessao.reps = r_min
  senão:
    proxima_sessao.carga = carga_atual
    proxima_sessao.reps = min(reps_atingido + 1, r_max)
```

#### Avançado — Block / DUP
**Block periodization** (12 sem):
- Sem 1–6: Acumulação (8–12 reps, 65–75% 1RM, volume alto)
- Sem 7–10: Intensificação (4–6 reps, 80–87% 1RM, volume médio)
- Sem 11–12: Realization / peak (3–5 reps, 87–92% 1RM, volume baixo)
- Sem 13: Deload

**DUP** (ciclo semanal):
- Seg: pesado (5×5 a 80%)
- Qua: moderado (4×8 a 70%)
- Sex: leve (3×12 a 60%, foco isolação + lengthened partials)

---

## 4. Adesão

### Métricas
- **Adesão semanal** = sessões executadas / sessões prescritas (%)
- **Streak de adesão**: nº de semanas consecutivas com adesão ≥ 80%
- **Gap entre sessões do mesmo grupamento**: tempo (em dias) desde última sessão que estimulou o grupamento

### Flags
- **ADESAO_BAIXA_PONTUAL**: 1 semana com adesão <70% — investigar pontualmente, não mudar prescrição
- **ADESAO_BAIXA_RECORRENTE**: 2+ semanas consecutivas com adesão <70% — **reduzir prescrição** (volume e/ou frequência) para o que ele realmente faz; perdemos adesão antes de perder ganho ótimo
- **GAP_LONGO**: grupamento sem estímulo há mais de 7 dias — sinaliza desbalanço ou má distribuição da semana
- **STREAK_ALTO**: 4+ semanas com adesão ≥90% — boa hora pra propor pequena progressão de volume ou intensidade

### Cálculo (pseudocódigo)
```
adesao_semana(aluno, semana):
  prescritas = count(sessoes_prescritas onde data in semana)
  executadas = count(sessoes_executadas onde data in semana)
  return executadas / prescritas

flag_adesao(aluno):
  ultimas_semanas = ultimas_n_semanas(aluno, n=2)
  adesoes = [adesao_semana(aluno, s) for s in ultimas_semanas]

  if all(a < 0.7 for a in adesoes):
    return ADESAO_BAIXA_RECORRENTE
  elif adesoes[-1] < 0.7:
    return ADESAO_BAIXA_PONTUAL
  else:
    return OK
```

---

## 5. Detecção de estagnação

### Definição operacional
**Estagnação em um exercício**: 3 sessões consecutivas com **mesma carga** + **mesma faixa de reps** + **sem ganho de rep adicional**, fora de janela de deload.

### Algoritmo
```
detecta_estagnacao(exercicio, aluno):
  historico = ultimas_3_sessoes(exercicio, aluno)

  if em_deload(historico): return None

  cargas = [s.carga for s in historico]
  reps = [s.reps_total for s in historico]

  if all(c == cargas[0] for c in cargas) and all(r <= reps[0] + 1 for r in reps):
    return ESTAGNADO
  else:
    return PROGREDINDO
```

### Resposta à estagnação
- **1º tentativa**: aumentar intensidade de esforço (de RIR 2 para RIR 1, ou adicionar 1 série final ao falhamento)
- **2ª tentativa (após mais 2 semanas estagnado)**: deload (1 semana, volume 50%, intensidade -1 RPE)
- **3ª tentativa (estagnado pós-deload)**: variar exercício (substituir por variação angular equivalente) + reset do volume
- **4ª tentativa (após mais 3 semanas)**: revisar variáveis-mãe (volume semanal, sono, dieta, estresse, técnica) — geralmente o problema está aqui

---

## 6. Detecção de regressão

### Definição operacional
**Regressão**: queda de carga (≥5%) ou reps (≥20%) na mesma série de um exercício, comparado à sessão anterior do mesmo, fora de deload.

### Algoritmo
```
detecta_regressao(exercicio, aluno):
  ultima = ultima_sessao(exercicio, aluno)
  penultima = penultima_sessao(exercicio, aluno)

  if em_deload(ultima): return None

  if (ultima.carga < penultima.carga * 0.95) or
     (ultima.reps_total < penultima.reps_total * 0.8):
    return REGREDIDO
  else:
    return OK
```

### Resposta à regressão
- **1ª vez**: investigar causas (sono, dieta, estresse, lesão, dor). Não mudar prescrição ainda.
- **2 sessões consecutivas regredindo**: deload imediato + revisar volume semanal (provavelmente alto demais)
- **Regressão acompanhada de sintomas** (dor crônica, fadiga generalizada, sono ruim): reduzir volume estrutural, não só deload

---

## 7. Deload — critérios e implementação

### Quando aplicar (qualquer um aciona)
1. **Programado**: cada 4–6 semanas em intermediário/avançado; cada 6–8 sem em novato
2. **Reativo por estagnação**: 2 sessões consecutivas estagnadas em compostos principais
3. **Reativo por regressão**: 1 sessão com regressão clara
4. **Reativo por checklist Helms**: 2+ sinais de não-recuperação (sono ruim, aversão à academia, dores crônicas novas, RPE percebido elevado)

### Como executar
- **Volume**: -50% (ex.: de 4×8 para 2×8)
- **Intensidade**: -1 a -2 RPE (ou -10–20% da carga)
- **Duração**: 1 semana (ou 2 se fadiga severa)
- **Não pular treino**: treinar leve > não treinar (preserva hábito)

### Algoritmo
```
recomenda_deload(aluno):
  if semanas_desde_ultimo_deload(aluno) >= 6:
    return DELOAD_PROGRAMADO

  if detecta_estagnacao_geral(aluno, threshold=2):
    return DELOAD_ESTAGNACAO

  if detecta_regressao_geral(aluno):
    return DELOAD_REGRESSAO

  if checklist_recuperacao_negativa(aluno, threshold=2):
    return DELOAD_CHECKLIST

  return SEM_DELOAD
```

---

## 8. Tracking qualitativo

### RPE e RIR de sessão e série
- **RIR por série**: aluno reporta no app (Treino.io captura)
- **RPE de sessão (sRPE)**: agregado, escala 1–10
- **session-RPE × duração** = unidade arbitrária (AU) de carga interna

### Carga interna semanal (sRPE)
```
sRPE_semanal = sum(sessao.sRPE × sessao.duracao_min for sessao in semana)
```

Acompanhar tendência:
- **Aumento de sRPE_semanal sem aumento de performance** → sinal de não-adaptação. Considerar deload.
- **Queda de sRPE_semanal com performance estável ou crescente** → adaptação positiva, capacidade aumentando.

### Observações livres (text mining)
Treino.io captura `observacao_pessoal` por série/sessão. Palavras-chave a flagar:
- Indicadores de dor/lesão: "dor", "doeu", "estourei", "lesão", "machuquei"
- Indicadores de fadiga: "cansado", "exausto", "sem energia", "morto"
- Indicadores positivos: "leve", "fácil", "tranquilo", "PR", "recorde"
- Substituições / problemas: "trocado", "substituí", "máquina ocupada", "sem", "não consegui"

Algoritmo simples: contagem semanal de cada categoria. Aumento em indicadores negativos → flag.

---

## 9. Variáveis derivadas para dashboard

Para cada aluno, calcular semanalmente:

| Métrica | Fórmula | Interpretação |
|---|---|---|
| Volume semanal por grupamento | soma_series_diretas + 0.5 × soma_series_indiretas | Compara com faixa-alvo |
| VL semanal total | soma(sets×reps×carga) | Tendência indica progressão |
| % progressão por exercício | slope do VL nas últimas 4 sem | Status: progredindo / estável / regredindo |
| % adesão | sessões_executadas / sessões_prescritas | Trigger pra ajustar prescrição |
| sRPE semanal | sum(sessao.sRPE × duracao) | Carga interna agregada |
| Exercícios estagnados | count(exercícios com flag ESTAGNADO) | Acima de 2 → deload provável |
| Recordes na semana | count(eventos onde carga ou reps > histórico) | Indicador positivo |
| Notas qualitativas críticas | count(observações com palavras-chave de dor/fadiga) | Flag se >2 na semana |

---

## 10. Estado consolidado do aluno (relatório semanal)

Modelo de output gerável por aluno:

```
ALUNO: João Silva
SEMANA: 2026-05-13 a 2026-05-19

ADESÃO: 4/5 sessões (80%) — ✅ OK
VOLUME POR GRUPAMENTO:
  Peito: 14 séries (alvo 10-16) ✅
  Costas: 16 séries ✅
  Quadríceps: 12 séries ✅
  Posterior: 6 séries ⚠️ ABAIXO DO MÍNIMO
  Glúteo: 9 séries ✅
  ...

ESTADO DOS EXERCÍCIOS PRINCIPAIS:
  Supino reto: PROGREDINDO (+3.5% VL nas últimas 4 sem) ✅
  Squat: ESTÁVEL (+0.8%) ⚠️
  Stiff: ESTAGNADO (3 sessões mesma carga) 🔴

RECOMENDAÇÕES:
  - Aumentar volume de posterior em 2-4 séries/sem
  - Squat estável: investigar técnica ou aumentar intensidade de esforço
  - Stiff estagnado: tentar deload de 1 semana ou variação angular (stiff com banda)

OBSERVAÇÕES NA SEMANA:
  - "ombro estalando" (3×) — encaminhar avaliação
  - 1 PR no supino reto

PRÓXIMOS PASSOS PROPOSTOS:
  - Manter prescrição com ajuste em posterior (+ 1 exercício/sem)
  - Monitorar ombro nas próximas 2 sessões; se persistir, modificar supino
  - Se stiff seguir estagnado pós-deload, alternar com RDL
```

Esse formato é o output natural pra o site futuro consumir e mostrar.

---

## Citações

1. Helms E, Morgan A, Valdez A. *The Muscle and Strength Pyramid v2.0 — Training*, 2ª ed. 2018. Level 3.
2. Schoenfeld BJ. *Science and Development of Muscle Hypertrophy*, 2ª ed. Human Kinetics, 2021.
3. Hough P, Schoenfeld BJ (eds). *Advanced Personal Training: Science to Practice*, 2ª ed. Routledge, 2022. Cap.7 (RPE/sRPE).
4. Helms ER, Cronin J, Storey A, Zourdos MC (2016). Application of the repetitions in reserve-based rating of perceived exertion scale for resistance training. *Strength Cond J* 38(4):42–49.
5. Damas F, Phillips S, Vechin FC, Ugrinowitsch C (2015). A review of resistance training-induced changes in skeletal muscle protein synthesis and their contribution to hypertrophy. *Sports Med* 45(6):801–807.
