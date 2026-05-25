# AWS SAA-C03 — 08 · Management Tools

> CloudWatch, CloudTrail, Config, Systems Manager, CloudFormation, OpsWorks, Trusted Advisor, Health, Service Catalog, Control Tower.

---

## CloudWatch

**One-liner:** Metrics, logs, alarms, dashboards, events. The observability backbone.

### Components

| Component | Purpose |
|-----------|---------|
| **Metrics** | Time-series data; AWS default + custom |
| **Logs** | Log Groups → Log Streams; with retention + filters |
| **Alarms** | Threshold or anomaly detection → SNS / Auto Scaling / EC2 actions |
| **Dashboards** | Visualize cross-region/account |
| **Events / EventBridge** | Rule-based event routing (see Application Services) |
| **Logs Insights** | Query logs with custom syntax |
| **Container Insights** | EKS/ECS observability |
| **Lambda Insights** | Lambda perf metrics |
| **Synthetics** | Canaries for endpoint monitoring |
| **RUM (Real User Monitoring)** | Client-side web app metrics |
| **Evidently** | Feature flags / A-B |

### Metrics Granularity

| Type | Resolution | Cost |
|------|-----------|------|
| **Standard** | 1 minute | Default |
| **Detailed monitoring** (EC2) | 1 minute (vs 5 default) | Extra |
| **High-resolution custom** | 1 second | $$ |

### Default vs Custom Metrics on EC2

| Default (free) | NOT Default — need agent |
|---------------|--------------------------|
| CPU, Disk I/O, Network, Status checks | **Memory (RAM), Disk free space, OS-level** |

> **Rule:** Memory & disk usage are **OS-level** → install **CloudWatch Agent**.
> **Keyword:** "monitor RAM usage on EC2" → **CloudWatch Agent + custom metric**.

### Alarms States: `OK`, `ALARM`, `INSUFFICIENT_DATA`. Actions: SNS, Auto Scaling, EC2 reboot/stop/terminate/recover.

---

## CloudTrail (also in [07_Security_Identity.md](07_Security_Identity.md))

- API auditing across all AWS services.
- Event types: **Management events** (default), **Data events** (S3 obj, Lambda invoke — must opt in), **Insights events** (unusual API patterns).
- 90-day free history; **create a trail** for long-term S3 storage + multi-region + org-wide.

---

## AWS Config

| Feature | Detail |
|---------|--------|
| **Resource Inventory** | Snapshot + history of every supported resource |
| **Config Rules** | Managed (e.g., `s3-bucket-public-read-prohibited`) or custom (Lambda / Guard) |
| **Conformance Packs** | Bundles of rules for compliance frameworks |
| **Remediation Actions** | Auto-fix via SSM Automation |
| **Aggregator** | Multi-account / multi-region view |

> **Keyword:** "track if resources comply with a rule over time" → **AWS Config**.
> **Config vs CloudTrail:** Config = **state of resource**. CloudTrail = **API calls**.

---

## AWS Systems Manager (SSM)

| Capability | Purpose |
|-----------|---------|
| **Parameter Store** | Hierarchical config + secrets (see [07](07_Security_Identity.md)) |
| **Session Manager** | Shell into EC2 / on-prem **without SSH or bastion**; logged to CloudWatch/S3 |
| **Run Command** | Execute commands across fleet (no SSH) |
| **Patch Manager** | OS patch baselines + maintenance windows |
| **State Manager** | Enforce desired config |
| **Automation** | Pre-built / custom runbooks |
| **Inventory** | Catalog software on instances |
| **OpsCenter** | Centralized ops issue tracking |
| **Incident Manager** | Incident response with runbooks |
| **Fleet Manager** | UI to manage instances |
| **Distributor** | Package distribution |

> **Rule:** SSM Agent + IAM role + outbound HTTPS / VPC endpoints = no inbound SSH needed.
> **Keyword:** "manage EC2 without opening 22/3389" → **Session Manager**.
> **Keyword:** "patch 1000 servers on schedule" → **Patch Manager**.

---

## CloudFormation (IaC)

| Item | Detail |
|------|--------|
| **Template** | JSON/YAML; declares resources |
| **Stack** | Deployed instance of a template |
| **Change Set** | Preview changes before apply |
| **Drift Detection** | Detect manual edits vs template |
| **StackSets** | Deploy stacks across many accounts/regions |
| **Nested Stacks** | Modularize |
| **Custom Resources** | Lambda-backed for unsupported resources |
| **Rollback** | Auto on failure (or disable) |
| **DeletionPolicy / UpdateReplacePolicy** | Retain, Snapshot, Delete |

> **Keyword:** "deploy infra across 50 accounts/regions" → **CloudFormation StackSets**.
> **Keyword:** "infrastructure as code, AWS-native" → **CloudFormation** (or AWS CDK / SAM on top).

### Related IaC tools
- **AWS CDK** — TypeScript/Python/Java/Go → synthesizes CFN.
- **AWS SAM** — CFN extension for serverless apps.
- **Terraform** — third-party, multi-cloud.

---

## AWS OpsWorks
Managed Chef / Puppet. **Legacy.** SAA may mention vs Elastic Beanstalk / CloudFormation.

---

## AWS Trusted Advisor

5 categories: **Cost Optimization, Performance, Security, Fault Tolerance, Service Limits**.

| Plan | Checks |
|------|--------|
| Basic / Developer | Core checks (~7) |
| **Business / Enterprise** | **All checks** |

> **Keyword:** "identify idle EC2, overutilized service limits, security best practices" → **Trusted Advisor**.

---

## AWS Health

| Variant | Detail |
|---------|--------|
| **AWS Personal Health Dashboard** | Account-specific alerts |
| **AWS Service Health Dashboard** | Public AWS-wide status |
| **AWS Health API + EventBridge** | Programmatic & automation |

---

## AWS Service Catalog

Curated catalog of approved CFN-backed products for end users in your org. Self-service launch with governance.

---

## AWS Control Tower

| Feature | Purpose |
|---------|---------|
| **Landing Zone** | Pre-built multi-account environment |
| **Account Factory** | Standardized account vending |
| **Guardrails** | Preventive (SCPs) + detective (Config rules) |
| Integrates with | Organizations, IAM Identity Center, Config, CloudTrail |

> **Keyword:** "set up well-architected multi-account environment quickly" → **Control Tower**.

---

## CloudWatch vs CloudTrail vs Config — **Memorize**

| | CloudWatch | CloudTrail | Config |
|---|-----------|-----------|--------|
| Tracks | **Performance metrics + logs** | **API calls** (who/when/what) | **Resource configuration + compliance** |
| Question | "Is it healthy?" | "Who did it?" | "Is it compliant? What changed?" |

---

## Self-Test

- What metric is NOT default on EC2?
- Difference between Config and CloudTrail?
- How to SSH-less manage EC2 fleet?
- How to deploy stacks across many accounts/regions?
- Trusted Advisor full checks need which support tier?
