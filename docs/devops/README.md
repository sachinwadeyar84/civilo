# Civilo DevOps Playbook

This folder is your personal DevOps learning journal. Each phase document explains **what** we did, **why** we did it, **what it cost**, and **how to undo it**.

The order is the same one a real engineering team follows when shipping a new product.

| Phase | Topic | Status | Time | Cost |
|---|---|---|---|---|
| 1 | [Code Quality](01-code-quality.md) — ESLint, SonarCloud, CodeQL | ⏳ | 30 min | Free |
| 2 | [CI Pipeline](02-ci-pipeline.md) — Lint, test, build Docker image | ⏳ | 30 min | Free |
| 3 | [Azure Infra with Terraform](03-azure-terraform.md) — RG, ACR, AKS, Postgres, Key Vault | ⏳ | 90 min | ~₹50 |
| 4 | [Continuous Deployment](04-cd-pipeline.md) — Push image to ACR, deploy to AKS | ⏳ | 60 min | Running |
| 5 | [Monitoring](05-monitoring.md) — Container Insights, App Insights, alerts | ⏳ | 45 min | Running |
| 6 | [Tear Down](06-teardown.md) — `terraform destroy` and verify zero cost | ⏳ | 15 min | ₹0 |

## Why this order?

Real teams build **inside-out**: code quality first (so the codebase doesn't rot), then CI (so every push is verified), then infra (only once you have something worth deploying), then CD (automate the deploy), then monitoring (you can't run prod without it), then teardown (so the bill doesn't kill you).

Skipping the early phases is the #1 reason startups end up with unmaintainable codebases and broken deploys at 3am.

## Tools we'll use

| Tool | What it does | Why this one |
|---|---|---|
| GitHub Actions | CI/CD runner | Free for public repos, native to where our code lives |
| SonarCloud | Static analysis (bugs, smells, security) | Free for public repos, industry standard |
| CodeQL | Deep security scanning | Free, made by GitHub, finds CVEs |
| Terraform | Infrastructure as Code | Cloud-agnostic, declarative, the industry default |
| Azure | Cloud provider | We have $200 free credit |
| AKS | Managed Kubernetes | Where the app actually runs |
| ACR | Container registry | Stores our Docker images |
| Azure DB for PostgreSQL | Managed database | Same Postgres we run locally, but Azure-managed |
| Key Vault | Secrets store | JWT keys, DB passwords — never in git |
| Azure Monitor | Logs and metrics | Standard observability for AKS |

## Ground rules

1. **Run every command yourself.** I explain, you type. Muscle memory only comes from your hands.
2. **Read errors carefully.** 90% of DevOps is reading logs. We'll practice this on every failure.
3. **Tag every Azure resource** with `project=civilo` and `env=dev`. Makes cost tracking and cleanup trivial.
4. **Tear down at the end of each working session** if the cluster will sit idle for >24 hours.
5. **Never commit secrets.** All credentials go to Key Vault or GitHub Secrets, never to git.
