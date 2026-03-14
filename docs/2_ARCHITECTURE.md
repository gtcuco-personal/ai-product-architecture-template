# Architecture

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

## External Services

| Service | Purpose | Auth |
|---------|---------|------|
| [name] | [what it does] | [how it authenticates] |
