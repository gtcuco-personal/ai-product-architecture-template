# Architecture

## System Boundaries and Responsibilities

Name the system's users, the responsibilities owned here, and the dependencies
owned elsewhere. Mark interfaces that cross an authentication, data ownership,
or deployment boundary. Link to the detailed security or data policy instead
of repeating it.

| Boundary / component | Responsibility owned here | External dependency / contract |
|----------------------|---------------------------|--------------------------------|
| [name] | [what this system guarantees] | [owner, interface and relevant constraint, or N/A] |

Diagrams are optional. Use a small Mermaid context, component, sequence, or flow
diagram only when it makes relationships or ordering materially easier to
understand. Label arrows with what crosses the boundary and update a diagram in
the same change as the relationship it describes. Do not create a full C4 set by
default.

## Routes / Entry Points

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | [Component] | [description] |

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| [Name] | `src/components/` | [description] |

## Data Model

[Describe database tables, schemas, or data structures.]

| Table / Entity | Purpose |
|----------------|---------|
| [name] | [description] |

### Database Design Checklist

Before building features, think data-first. The database is the source of truth — UI is just a view on top.

- [ ] **Entities identified** — what are the core "things" in the app? (users, posts, orders, etc.)
- [ ] **Relationships mapped** — how do entities relate? (one-to-many, many-to-many, belongs-to)
- [ ] **Access patterns defined** — who reads/writes what? Which queries will be frequent?
- [ ] **Row-Level Security** — RLS policies defined per table (who can SELECT, INSERT, UPDATE, DELETE?)
- [ ] **Defaults are restrictive** — deny all, then grant explicitly per role
- [ ] **Indexes planned** — columns used in WHERE/JOIN/ORDER BY have indexes
- [ ] **Nullability intentional** — every nullable column is nullable for a reason, not by accident

## Directory Structure

```
[Paste actual project tree here]
```

## Data Flow

```
[Input] → [Processing] → [Storage] → [Output]
```

### Critical Flow and Failure Behaviour

Choose one important journey and describe success, failure and recovery. Add a
short sequence or flow diagram only when ordering, multiple services, or retries
would otherwise be difficult to follow.

| Step / boundary | Expected result | Failure and recovery | Evidence of success |
|-----------------|-----------------|----------------------|---------------------|
| [operation] | [durable effect or output] | [timeout, retry/idempotency, rollback or user action] | [read-back, artifact, test or log without sensitive data] |

For an externally owned dependency, say what happens if it is unavailable.
For a persistent write, identify how the result is verified after the request
finishes; see `docs/11_TESTING.md` for the mutation-proof contract.

## External Services

| Service | Purpose | Auth |
|---------|---------|------|
| [name] | [what it does] | [how it authenticates] |
