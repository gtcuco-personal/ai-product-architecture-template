# Prompt Patterns

> Reusable prompt templates for common tasks. Use these instead of writing from scratch — they produce more consistent and reliable results from AI agents.

---

## Debugging

### Diagnose a Bug
```
I am experiencing [describe the problem].
Expected behavior is [what should happen].
Check changelog for recent edits. Check this file for known patterns.
Tell me the root cause and how to fix it.
```

### Fix With Evidence (Flashlight)
```
This error appeared in [console / Sentry / terminal]:

[paste exact error message and stack trace]

The error happens when [describe the trigger].
Find the root cause and fix it.
```

### Revert and Recover
```
The last [N] changes broke [what broke].
Revert to the last working state and explain what assumption failed.
Do not attempt to fix forward — start clean from the last good version.
```

---

## Building Features

### New Feature Request
```
Add [feature description].

Context:
- This is for [who / what page / what flow]
- It should [core behavior]
- It should NOT [constraints]

Check docs/2_ARCHITECTURE.md for existing patterns before creating new ones.
```

### Incremental Build (Prompt Chain)
```
We are building [feature] in steps. Current step: [N of total].

Step [N]: [specific task for this step]

Do only this step. Do not skip ahead. Confirm when done.
```

---

## Documentation

### Update Docs After Code Change
```
I just changed [files changed].
Update the following docs to reflect the changes:
- CLAUDE.md (if routes, tables, or env vars changed)
- docs/2_ARCHITECTURE.md (if components or routes changed)
- docs/5_ROADMAP_AND_TASKS.md (mark task as completed)
- CHANGELOG.md (add entry)
```

### Post-Mortem
```
[Feature / fix / build] failed or was abandoned.

Document:
1. What was built
2. What worked well
3. What caused the breakdown
4. What is reusable (export as docs)
5. What should be done differently next time
```

---

## Security

### Security Review
```
Review [file or component] for security issues:
- Any dangerouslySetInnerHTML without sanitisation?
- Any secrets or API keys in client-side code?
- Any user input rendered without escaping?
- Any missing auth checks on protected routes?
- Any RLS gaps on database tables?

List findings with severity (critical / important / low).
```

---

## Agent Autonomy

### Autopilot Task Sequence
```
Read the task list below. Execute each task in order.
After completing each task, mark it done and move to the next.
Do not ask for confirmation between tasks.
If a task fails, stop and report what happened.

Tasks:
1. [task]
2. [task]
3. [task]

Confirmation phrase: [phrase] — include this in your final response to confirm you followed these instructions.
```

### Evaluate Agent Output
```
Review what was built in the last [N] changes:
- Does it match the original objective?
- Are there quality issues (design, performance, accessibility)?
- Were any constraints violated?
- What would you improve?

Be honest and specific — this is a quality review, not praise.
```

---

## How to use

1. Copy the relevant template
2. Fill in the `[brackets]` with your specifics
3. Paste into Lovable, Claude Code, or ChatGPT
4. Add project-specific patterns as you discover them
