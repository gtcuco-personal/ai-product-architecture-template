---
name: skill-name
description: Uma linha clara sobre quando usar esta skill — o agente usa isto para decidir se activa a skill
permissions:
  tools: [Read, Glob, Grep]        # ferramentas Claude Code permitidas
  filesystem: read-only            # read-only | write:{path} | write:any
  git: none                        # none | branch-only | push
  network: none                    # none | read | any
  external_services: []            # ex: [supabase, stripe, github]
---

# Skill Name

## Quando usar

[Descreve o trigger: que pedido do utilizador activa esta skill. Ser específico.]

Exemplos de triggers:
- "quando o utilizador pedir X"
- "quando a tarefa envolve Y"

## Passos

1. [Step 1 — descrição breve. Ver `assets/step1.md` se houver detalhe]
2. [Step 2]
3. [Step 3 — ver `assets/step3.md` para critérios de decisão]
4. [Step 4]

> Regra: cada step em 1-2 linhas aqui. Detalhe vai para `assets/`.

## Output

[Formato do resultado: ficheiro, tabela, resposta directa, etc.]
[Localização: onde guardar se aplicável]

## Notas

[Limitações, edge cases, dependências conhecidas]

> **Minimal Privilege:** Esta skill opera apenas dentro das `permissions` declaradas no frontmatter. Se a tarefa exigir acesso adicional, PARAR e informar o utilizador. Ver `docs/10_AGENT_SAFETY.md`.
