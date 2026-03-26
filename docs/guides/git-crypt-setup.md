# git-crypt — Encrypted Files in the Repository

## What it does

git-crypt transparently encrypts files in the Git repository. Locally, encrypted files appear as plain text. On GitHub (or any remote), they appear as binary — unreadable without the key.

## When to use

Store sensitive data that needs to be version-controlled alongside the code:
- Bank account details (IBAN, BIC/SWIFT)
- API keys that must be shared across machines
- Internal credentials or tokens
- Any data you wouldn't want exposed if the repo became public

**Do NOT use for:** `.env` files (already in `.gitignore`), managed secrets (e.g. Supabase dashboard), passwords (use a password manager).

## Setup

```bash
# 1. Install
brew install git-crypt

# 2. Initialize in the repo (one-time)
git-crypt init

# 3. Export backup key (store in password manager or secure location)
git-crypt export-key ~/path/to/backup/git-crypt-<repo-name>.key

# 4. Define which files to encrypt in .gitattributes
# Example:
# secrets/** filter=git-crypt diff=git-crypt
# config/credentials.yml filter=git-crypt diff=git-crypt
```

## How it works

1. **`.gitattributes`** defines which file patterns are encrypted
2. On `git add` / `git commit`, matching files are encrypted automatically
3. On `git checkout` / `git pull`, they are decrypted automatically
4. On GitHub, the files appear as binary (unreadable)

## New machine / collaborator setup

```bash
# Clone the repo normally
git clone <repo-url>

# Unlock with the exported key
git-crypt unlock ~/path/to/backup/git-crypt-<repo-name>.key
```

Without unlocking, encrypted files appear as binary locally.

## Verify encryption is working

```bash
# Check which files are encrypted
git-crypt status

# Should show files matching .gitattributes patterns as "encrypted"
```

## Key management

- The key lives at `.git/git-crypt/keys/default` (local, not committed)
- **Always export a backup** and store it in a password manager or secure external storage
- **If you lose the key, you lose access to encrypted files forever**
- One key per repo — each repo has its own independent key

## Adding new encrypted paths

Edit `.gitattributes`:

```
path/to/sensitive/** filter=git-crypt diff=git-crypt
```

**Important:** files must be added to `.gitattributes` *before* they are committed. If a file was committed unencrypted, adding it to `.gitattributes` later won't encrypt the existing history — you'd need to rewrite Git history.

## Recommended encrypted paths

| Path pattern | Use case |
|---|---|
| `secrets/**` or `templates/secrets/**` | Bank accounts, credentials, tokens |
| `config/credentials.*` | Service credentials |
| `*.secret.md` | Individual sensitive docs |
