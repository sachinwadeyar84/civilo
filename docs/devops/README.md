# Civilo DevOps Playbook

This folder is your personal DevOps learning journal. Each phase document explains **what** we did, **why** we did it, **what it cost**, and **how to undo it**.

The order is the same one a real engineering team follows when shipping a new product.

| Phase | Topic | Status | Time | Cost |
|---|---|---|---|---|
| 1 | [Code Quality](01-code-quality.md) — ESLint, SonarCloud | ✅ Done | 90 min | Free |
| 2 | [CI Pipeline](02-ci-pipeline.md) — Docker build, push to registry | ⏳ | 30 min | Free |
| 3 | [Azure Infra with Terraform](03-azure-terraform.md) — RG, ACR, AKS, Postgres, Key Vault | ⏳ | 90 min | ~₹50 |
| 4 | [Continuous Deployment](04-cd-pipeline.md) — Deploy to AKS | ⏳ | 60 min | Running |
| 5 | [Monitoring](05-monitoring.md) — Container Insights, App Insights, alerts | ⏳ | 45 min | Running |
| 6 | [Tear Down](06-teardown.md) — `terraform destroy` and verify zero cost | ⏳ | 15 min | ₹0 |

## Phase 1 Recap (what you actually did)

- Set up ESLint with sensible Node.js rules
- Configured Prettier for consistent formatting
- **Found and fixed a real product bug** (the `radius` query parameter wasn't actually filtering vendors)
- Created SonarCloud account and generated a token
- Stored token in GitHub Secrets as `SONAR_TOKEN`
- Wrote `sonar-project.properties` and `.github/workflows/sonar.yml`
- Pushed → first scan failed (Auto + CI conflict)
- Disabled Automatic Analysis on SonarCloud
- Re-ran the workflow → green ✅
- Every future push now gets scanned automatically

## Skills you can now claim on your CV

- ESLint configuration for Node.js projects
- SonarCloud / SonarQube setup with GitHub Actions
- GitHub Secrets for credential management
- Reading SonarCloud quality reports
- Debugging CI workflow failures from logs

## Why this order?

Real teams build **inside-out**: code quality first (so the codebase doesn't rot), then CI (so every push is verified), then infra (only once you have something worth deploying), then CD (automate the deploy), then monitoring (you can't run prod without it), then teardown (so the bill doesn't kill you).

## Ground rules

1. **Run every command yourself.** I explain, you type.
2. **Read errors carefully.** 90% of DevOps is reading logs.
3. **Tag every Azure resource** with `project=civilo` and `env=dev`.
4. **Tear down at the end of each working session** if the cluster will sit idle for >24 hours.
5. **Never commit secrets.** All credentials go to Key Vault or GitHub Secrets.
