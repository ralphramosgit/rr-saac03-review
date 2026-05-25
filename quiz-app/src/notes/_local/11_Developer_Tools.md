# AWS SAA-C03 — 11 · Developer Tools

> Code* suite, X-Ray, Cloud9, CloudShell, CDK, SAM. Light on the exam, but know what each does.

---

## CodeSuite

| Service | Purpose |
|---------|---------|
| **CodeCommit** | Managed Git (note: in maintenance mode; new customers limited) |
| **CodeBuild** | Build & test; serverless |
| **CodeDeploy** | Automated deployments to EC2 / Lambda / ECS / on-prem |
| **CodePipeline** | CI/CD orchestrator |
| **CodeArtifact** | Managed artifact repo (Maven, npm, PyPI, NuGet) |
| **CodeStar** | (Discontinued July 2024) — unified project view |
| **CodeGuru** | ML code reviews + perf profiler |
| **CodeWhisperer / Q Developer** | AI code suggestions |

### CodeDeploy Deployment Strategies

| Compute | Strategies |
|---------|-----------|
| **EC2 / on-prem** | In-place, Blue/Green |
| **Lambda** | Canary (e.g., 10% → 100%), Linear, All-at-once |
| **ECS** | Blue/Green via ALB |

> **Keyword:** "shift 10% traffic for 10 min, then 100%" → **Canary** deployment.
> **Keyword:** "shift equal increments over time" → **Linear**.

---

## AWS X-Ray

Distributed tracing. SDK in app → traces with service map + latency breakdowns.

> **Keyword:** "find latency bottleneck in microservices" → **X-Ray**.

---

## Cloud9 / CloudShell

| | Cloud9 | CloudShell |
|---|--------|-----------|
| Type | Cloud IDE (browser) | Browser shell |
| Cost | EC2 hourly | Free |
| Persistence | EBS | 1 GB home dir, per-region |
| Use | Full dev env, pair-programming | Quick CLI tasks |

> Note: Cloud9 is no longer available to new customers; CloudShell is the recommended browser CLI.

---

## IaC Layered on CFN

- **AWS SAM** — serverless-focused CFN extension; `sam build / deploy`.
- **AWS CDK** — TypeScript/Python/Java/Go/C# → CFN templates.
- **Amplify** — front-end + backend hosting/CI/CD (see Front-end notes).

---

## Self-Test

- CodeDeploy Lambda strategies?
- Which service traces distributed requests?
- CDK output is what under the hood?
