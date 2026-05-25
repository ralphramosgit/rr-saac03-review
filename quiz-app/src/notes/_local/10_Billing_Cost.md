# AWS SAA-C03 — 10 · Billing & Cost Management

> Cost Explorer, Budgets, CUR, Savings Plans, RIs, Spot, Pricing Calculator, Compute Optimizer.

---

## Cost Tools

| Tool | Purpose |
|------|---------|
| **AWS Pricing Calculator** | Estimate cost **before** deployment |
| **AWS Cost Explorer** | Visualize/analyze **historical & forecast** (13-month history) |
| **AWS Budgets** | Alert on cost / usage / RI / SP coverage; can trigger SNS/Lambda |
| **Cost & Usage Report (CUR)** | Most detailed billing data → S3 → Athena/Redshift/QuickSight |
| **Cost Anomaly Detection** | ML detects unusual spend |
| **Cost Categories** | Custom groupings of cost |
| **Billing Conductor** | Custom pricing for chargeback |
| **AWS Compute Optimizer** | ML rightsizing recommendations (EC2, ASG, EBS, Lambda) |

---

## Discount Models

### Savings Plans

| Type | Commit To | Flexibility | Discount |
|------|-----------|-------------|----------|
| **Compute Savings Plan** | $/hr for 1 or 3 yr | EC2 (any family/size/region/OS/tenancy), **Fargate, Lambda** | Up to ~66% |
| **EC2 Instance Savings Plan** | $/hr in a family + region | Size/OS/tenancy within family/region | Up to ~72% |
| **SageMaker Savings Plan** | $/hr | SageMaker any instance | — |

### Reserved Instances (RIs)

| Type | Detail |
|------|--------|
| **Standard RI** | Highest discount; locked to attributes; can sell on Marketplace |
| **Convertible RI** | Lower discount; change family/OS/tenancy |
| **Scheduled RI** | (Discontinued) |

| Payment | Discount |
|---------|----------|
| All Upfront | Most |
| Partial Upfront | Less |
| No Upfront | Least |

> **Savings Plans vs RIs:** SPs are simpler, more flexible — generally preferred. RIs offer slightly higher discount when you know exact instance.

### Spot Instances
- Up to **90% off**; 2-min interruption notice.
- Use for stateless, fault-tolerant: batch, CI, big data, rendering, ML training (with checkpointing).
- **Spot Fleet / EC2 Fleet** — diversify across pools.
- **Spot Blocks** (discontinued).

### On-Demand & Dedicated

| Mode | Use |
|------|-----|
| **On-Demand** | Default, no commitment |
| **Dedicated Instance** | Single-tenant hardware, billed per instance |
| **Dedicated Host** | Whole physical host; BYOL (Windows/Oracle/SQL Server) |

---

## Other Cost Controls

| Lever | Where |
|-------|-------|
| **S3 Lifecycle / Intelligent-Tiering** | Storage tier transitions |
| **Auto Scaling** | Match capacity to load |
| **Spot in ASG** | Mixed instance policy |
| **VPC Endpoints (Gateway = free)** | Avoid NAT GW data charges to S3/DynamoDB |
| **Right-sizing** | Compute Optimizer |
| **Delete unused EIPs / EBS / snapshots** | Trusted Advisor |
| **CloudFront price classes** | Limit geographic edges |
| **Egress** | Keep traffic within same AZ where possible |

> **Rule:** Unattached EIPs are billed hourly.
> **Rule:** EBS volumes attached to **stopped** instances still bill.
> **Rule:** Snapshots are incremental but bill for total stored blocks.

---

## Organizations & Billing

- **Consolidated billing** in Organizations: one bill, **volume tier discounts shared**, RI/SP **sharing** across accounts (configurable).
- Tagging strategy + **Cost Allocation Tags** required for chargeback reports.

---

## Self-Test

- Cheapest compute discount for fault-tolerant batch?
- Compute SP vs EC2 SP — which is more flexible?
- Where do you find the most detailed billing data?
- Which tool gives rightsizing recommendations?
- What costs continue after you stop an EC2?
