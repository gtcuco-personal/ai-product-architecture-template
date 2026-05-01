# [Repo Name] — Index

> **Last updated:** YYYY-MM-DD
> **Mandatory governance file.** Must be updated in every PR that adds, moves, or removes content in `stakeholders/`, `pitches/`, `research/`, `decisions/`, `meetings/`, or equivalent artifact folders. Refreshed automatically by `/sync-docs` and created by `/sync-repos` where missing.

## Purpose

Mapa rápido do que existe e onde está. Duas audiências:
1. **Humano** — encontrar artifacts sem `grep` (briefings, decisões, research, stakeholders)
2. **Claude / agents** — ler UM ficheiro antes de explorar, poupando tokens

## 🟢 Active initiatives

Lista de workstreams, deals ou projectos activos. Cada entrada:

- **Nome da iniciativa**
- 1 linha de descrição / contexto
- Links para artifacts principais (proposals, research, decisions, stakeholders)
- Status actual

_[preencher com iniciativas activas; remover este placeholder]_

Exemplo:

```
### [Nome da iniciativa]
- Proposta: `path/to/proposal.md`
- Stakeholder: `stakeholders/nome.md`
- Research: `research/folder/`
- Decisão pendente: `decisions/briefing.md`
- **Status:** [aguardar decisão X / em execução / bloqueado por Y]
```

## 📁 Folder map

Estrutura de pastas principais com 1 linha de propósito:

- `docs/` — governance (roadmap, changelog, business context, health check)
- `tasks/` — tarefas activas e `lessons.md`
- _[adicionar pastas específicas deste repo]_

## 🗄️ Archive

Iniciativas completas, pausadas ou abandonadas. Mantêm-se aqui para contexto histórico sem poluir a vista activa.

_[preencher; remover placeholder quando houver conteúdo]_

## Convention

Governance rules para este ficheiro:

1. **Obrigatório** em todos os repos governados por `ai-product-architecture-template`
2. Cada PR que adiciona, move ou remove conteúdo em pastas de artifacts deve actualizar esta INDEX
3. A data "Last updated" deve reflectir o último update
4. Iniciativas movem de "Active" para "Archive" quando completas — não são removidas
5. Se uma entrada tiver >5 links, considerar README.md dedicado na pasta da iniciativa
6. `/sync-docs` refresca automaticamente este ficheiro a cada run
7. `/sync-repos` audita a presença e auto-popula onde falta
