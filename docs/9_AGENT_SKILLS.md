# Agent Skills

Guia para criar e organizar Agent Skills neste repo.

## O que são Skills

Agent Skills são instruções reutilizáveis que extendem as capacidades de um agente (Claude Code, Cursor, etc.) com conhecimento especializado, procedimentos e ferramentas. Cada skill é uma pasta com um ficheiro `SKILL.md` obrigatório.

Skills globais vivem em `~/.claude/skills/` (disponíveis em todos os repos). Skills de repo vivem em `skills/` na raiz do repo (específicas a este projecto).

## Framework KEPT

Cada skill deve cobrir 4 tipos de conteúdo:

| Letra | Tipo | Exemplos |
|---|---|---|
| **K** — Knowledge | Factos, regras, contexto, constraints | Regras de negócio, definições, limites |
| **E** — Examples | Templates, formatos, amostras boas/más | Input/output de referência, casos típicos |
| **P** — Procedures | Checklists, SOPs, guias passo a passo | Fluxo de execução, decisões condicionais |
| **T** — Tools | Scripts ou referências a MCP tools | Comandos bash, APIs, MCPs configurados |

## Estrutura recomendada

```
skills/
└── skill-name/
    ├── SKILL.md         # Obrigatório — descrição + procedimento de alto nível
    ├── assets/          # Opcional — conteúdo pesado carregado por step
    │   ├── step1.md
    │   └── step2.md
    └── references/      # Opcional — frameworks e documentação externa
        └── frameworks.md
```

## Minimal Privilege

Cada skill declara explicitamente as suas `permissions` no frontmatter. O agente opera **apenas dentro desses limites**.

Se a tarefa requer permissões não declaradas: **PARAR e informar o utilizador.** Nunca auto-expandir permissões.

Ver `docs/10_AGENT_SAFETY.md` para a tabela completa de valores válidos, defaults, e a política de Trust Hierarchy.

---

## Regra principal: SKILL.md lean

**O SKILL.md deve ter ≤ 60 linhas.**

Porquê: quando uma skill é activada, o SKILL.md vai todo para o context window de uma vez. Um SKILL.md pesado (>100 linhas) sobrecarrega o contexto e aumenta o risco de erros.

O conteúdo detalhado (tabelas, queries, critérios) vai para `assets/` e é carregado só quando o step relevante o pede.

### Como a progressive disclosure funciona

1. **Discovery** — ao arrancar, o agente carrega só o nome + descrição de cada skill
2. **Activation** — quando a tarefa bate com a descrição, lê o SKILL.md completo
3. **Execution** — o agente segue os passos e carrega `assets/` só quando necessário

## Formato do SKILL.md

```yaml
---
name: skill-name
description: Uma linha clara sobre quando usar esta skill — seja específico
permissions:
  tools: [Read, Glob, Grep]
  filesystem: read-only
  git: none
  network: none
  external_services: []
---

# Skill Name

## Quando usar
[Trigger claro — que pedido do utilizador activa esta skill]

## Passos
1. [Step 1 — ver `assets/step1.md` para detalhe]
2. [Step 2]
3. [Step 3 — ver `assets/step3.md` para critérios]
...

## Output
[Formato e localização do resultado]
```

## Quando criar uma skill de repo vs skill global

| Critério | Skill de repo (`skills/`) | Skill global (`~/.claude/skills/`) |
|---|---|---|
| Âmbito | Específica a este projecto | Usada em vários repos |
| Contexto | Conhece a stack e arquitectura deste repo | Genérica ou parametrizável |
| Exemplos | "gerar migration SQL para este schema" | "sync-docs", "deploy", "uae-market" |

## Referências

- [Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [agentskills.io](https://agentskills.io/what-are-skills)
- BuildersCamp AI Agents — Rui Vas (Jan 2025)
