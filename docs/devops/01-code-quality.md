# Phase 1 — Code Quality

> **Goal:** Make every push automatically scan the code for bugs, security issues, and style violations. Free, no Azure yet.

---

## Why this phase first?

Real engineering teams treat code quality as a build-time check, not a "we'll fix it later" thing. The cost of fixing a bug grows roughly 10x for every stage it slips through:

```
write code (1x) → CI (10x) → staging (100x) → prod (1000x) → customer reports it (10,000x)
```

Catching it in CI = cheap. Catching it from a customer = expensive (refunds, reputation, all-nighters). Phase 1 is the cheapest insurance you'll ever buy.

---

## What we'll add

| Tool | What it catches | Where it runs |
|---|---|---|
| **ESLint** | Style issues, simple bugs (unused vars, == vs ===, etc.) | Locally + CI |
| **Prettier** | Formatting (auto-fix) | Locally + CI |
| **SonarCloud** | Bugs, security smells, code smells, duplication, coverage | CI only (cloud) |
| **CodeQL** | Real CVEs and security vulns (SQL injection, XSS, etc.) | CI only (GitHub) |

---

## Mental model: what each tool actually does

### ESLint
Reads your JS files, applies a ruleset, flags violations. Example rule: `no-unused-vars` warns when you declare a variable you never use. Customizable per project.

### Prettier
Doesn't have opinions about logic — only about *formatting*. Long lines get wrapped, indentation normalized, quotes consistent. Run it once, never argue about formatting in PRs again.

### SonarCloud
Sits in the cloud, looks at your whole repo as a project. Tracks **trends over time** (is code quality improving or rotting?), enforces a **quality gate** (e.g. "no merge if coverage drops below 80%"). Gives you a public badge for the README.

### CodeQL
GitHub's own scanner. Builds a *semantic graph* of your code (not just text matching) and queries it for known vulnerability patterns. Finds things like "this user input flows into a SQL query without sanitization" — actual exploitable bugs.

---

## Step-by-step (you do these)

### Step 1.1 — Add ESLint config
We'll add a small `.eslintrc.json` to `backend/` so it has actual rules to enforce.

### Step 1.2 — Add Prettier config
`.prettierrc` at repo root. Auto-format on save in VS Code.

### Step 1.3 — Sign up for SonarCloud
- Go to https://sonarcloud.io
- Sign in with GitHub
- Authorize the SonarCloud app on your civilo repo
- Set up the project (it auto-detects)

### Step 1.4 — Add SONAR_TOKEN to GitHub secrets
- SonarCloud generates a token
- Paste into GitHub → Settings → Secrets → `SONAR_TOKEN`

### Step 1.5 — Add SonarCloud workflow
A new file `.github/workflows/sonar.yml` runs on every push.

### Step 1.6 — Enable CodeQL
- GitHub → Security → Code scanning → Set up CodeQL
- Pick the default config — one click

### Step 1.7 — Make a deliberate bug, push, watch the scanners catch it
Real learning: see a tool flag your bug, then fix it.

### Step 1.8 — Read your first SonarCloud report
Understand: bugs vs vulns vs smells vs hotspots vs coverage.

---

## Expected outcomes

After this phase:
- ✅ Every push → ESLint, Prettier, SonarCloud, CodeQL all run
- ✅ A SonarCloud badge in your README showing project health
- ✅ A "Security" tab on GitHub that shows real findings
- ✅ You can read a quality report and know what each metric means
- ✅ Zero Azure spend (everything is free)

---

## Cost: ₹0
