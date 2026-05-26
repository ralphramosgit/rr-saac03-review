# AWS SAA-C03 — Disaster Recovery (DR) Cheat Sheet

> Resilience hierarchy, the 4 DR strategies, RTO/RPO, and the AWS services that implement each pattern.

---

## PART 1: CORE CONCEPTS

### HA vs FT vs DR (don't confuse these on the exam)

| Concept                    | Goal                                                            | Failure handled                      | Typical AWS lever                                            |
| -------------------------- | --------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| **High Availability (HA)** | Minimize downtime; brief disruption OK (e.g. re-login)          | Single component / AZ failure        | Multi-AZ ASG behind ELB, RDS Multi-AZ                        |
| **Fault Tolerance (FT)**   | Operate **through** faults; **zero** disruption                 | Component faults masked in real time | Active-active multi-AZ, Aurora, redundant in-flight requests |
| **Disaster Recovery (DR)** | **Recover** from a disaster (region loss, ransomware, deletion) | Catastrophic / regional event        | Cross-Region backups, pilot light, warm standby, multi-site  |

> **Rule:** HA ≠ DR. A Multi-AZ RDS is HA, not DR. DR almost always implies **cross-Region** (or at least cross-account / off-AWS) protection.

---

### RTO vs RPO (memorize the definitions)

| Metric                             | Meaning                                  | Question keywords                            |
| ---------------------------------- | ---------------------------------------- | -------------------------------------------- |
| **RTO — Recovery Time Objective**  | How long can the system be **down**?     | "back online within X", "downtime tolerated" |
| **RPO — Recovery Point Objective** | How much **data** can we afford to lose? | "data loss tolerance", "last backup window"  |

```
   <-- RPO -->  DISASTER  <-- RTO -->
   last good                  service
   snapshot                   restored
```

- **Smaller RTO/RPO = more expensive** (more redundancy, more replication).
- Snapshots improve **RPO** (more frequent = less data lost), but restore time still drives **RTO**.
- Read Replicas → near-zero RPO + low RTO (promote replica).

> **Exam keyword:** "near-zero RPO and RTO across regions" → **Aurora Global Database** (RPO < 1s, RTO < 1 min via cross-region failover).

---

## PART 2: THE FOUR DR STRATEGIES (AWS Well-Architected)

| Strategy                                      | Cost | RTO                 | RPO       | What's running in DR site                                               |
| --------------------------------------------- | ---- | ------------------- | --------- | ----------------------------------------------------------------------- |
| **1. Backup & Restore**                       | $    | Hours–days          | Hours     | Nothing — only backups (S3, AMIs, snapshots)                            |
| **2. Pilot Light**                            | $$   | 10s of min          | Minutes   | **Core data replicated + minimal infra OFF/idle**; scale up on failover |
| **3. Warm Standby**                           | $$$  | Minutes             | Seconds   | **Full but scaled-down** copy always running; scale UP on failover      |
| **4. Multi-Site Active-Active** (Hot Standby) | $$$$ | Near zero (seconds) | Near zero | **Full-scale, live traffic in both** regions                            |

```
Cost ──────────────────────────────────► more $$$
                                          ↓
Backup&Restore  →  Pilot Light  →  Warm Standby  →  Multi-Site
                                          ↑
RTO/RPO ◄────────────────────────── lower (better)
```

### 1. Backup & Restore

- **Cheapest.** Take backups (EBS snapshots, AMI, RDS snapshots, S3 replication) and store them in another Region (or via **AWS Backup** cross-Region/cross-Account copy).
- On disaster: **provision new infra from scratch** in DR Region using snapshots / IaC (CloudFormation).
- **Keyword:** "lowest cost, hours of downtime acceptable" → **Backup & Restore**.

### 2. Pilot Light

- **Data is live-replicated** to DR Region (RDS cross-region replica, S3 CRR, DynamoDB Global Tables).
- **Core services exist** (AMIs ready, ASG min=0 / instances stopped, Lambdas deployed).
- Failover: start/scale the compute, switch DNS.
- **Keyword:** "data is replicated continuously, compute is dormant" → **Pilot Light**.

### 3. Warm Standby

- **Always-on scaled-down** version of the full stack in DR Region (e.g. 1 small EC2 per tier).
- Failover: **scale OUT/UP** (raise ASG desired count, resize instances/DB) + DNS shift.
- **Keyword:** "scaled-down but functional copy" → **Warm Standby**.

### 4. Multi-Site / Active-Active (Hot Standby)

- Both Regions serve **live production traffic** (Route 53 latency/geo/weighted, Global Accelerator).
- Data is bi-directionally replicated (Aurora Global write-forwarding, DynamoDB Global Tables, S3 multi-region access points).
- **Keyword:** "zero downtime", "RTO/RPO near zero", "active-active" → **Multi-Site**.

---

## PART 3: AWS BUILDING BLOCKS FOR DR

### Backup & Replication

| Service                               | DR Use                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS Backup**                        | Centralized, policy-driven, **cross-Region & cross-Account** copy for EBS, EC2, RDS, DynamoDB, EFS, FSx, Storage Gateway, S3, Aurora. **Backup Vault Lock = WORM (compliance/ransomware)**. |
| **EBS Snapshots**                     | Stored in S3 (regional). Copy to another Region. Can be encrypted, shared, automated via **DLM (Data Lifecycle Manager)**.                                                                  |
| **AMI**                               | Bake instance state; copy across regions.                                                                                                                                                   |
| **S3 Cross-Region Replication (CRR)** | Async object replication. Requires versioning + bucket policy. **Replicates NEW objects only by default** (use S3 Batch Replication for existing).                                          |
| **S3 Same-Region Replication (SRR)**  | Compliance / log aggregation / account isolation.                                                                                                                                           |
| **RDS Snapshots / Automated Backups** | Cross-Region snapshot copy; **RDS read replica in another Region** (MySQL, MariaDB, PostgreSQL, Oracle, SQL Server).                                                                        |
| **Aurora Global Database**            | Storage-level replication, **RPO < 1s**, **RTO < 1 min**, up to 5 secondary Regions, secondary read-only, **detach & promote** for failover.                                                |
| **DynamoDB Global Tables**            | Multi-Region, multi-active, last-writer-wins. Requires streams + on-demand or autoscaling.                                                                                                  |
| **Storage Gateway**                   | On-prem → S3/Glacier for hybrid backup.                                                                                                                                                     |

### Failover & Routing

| Service                                                    | DR Use                                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Route 53 Failover routing**                              | Active-passive; health check on primary, falls back to secondary.                                                                     |
| **Route 53 health checks**                                 | HTTP/HTTPS/TCP, calculated, CloudWatch-alarm-based.                                                                                   |
| **Global Accelerator**                                     | Static anycast IPs + AWS backbone; **sub-second** regional failover; better for non-HTTP.                                             |
| **CloudFront origin failover**                             | Origin group with primary + secondary; failover on 4xx/5xx/timeout.                                                                   |
| **Elastic Disaster Recovery (DRS / formerly CloudEndure)** | **Block-level replication of any source server (on-prem or cloud) into AWS**; sub-second RPO; launches recovery instances in minutes. |

### Compute / Infra Recovery

| Service                                 | DR Use                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------- |
| **Auto Scaling Group across multi-AZ**  | HA, not DR by itself, but the building block in DR Region.             |
| **CloudFormation / CDK / Terraform**    | Re-provision infra fast in DR Region (Backup & Restore + Pilot Light). |
| **EC2 Image Builder + AMI replication** | Keep DR-Region AMIs current.                                           |

> **Keyword:** "lift-and-shift on-prem servers into AWS for DR with sub-second RPO" → **AWS Elastic Disaster Recovery (DRS)**.
> **Keyword:** "back up many AWS services to another Region from one place with WORM compliance" → **AWS Backup + Vault Lock**.

---

## PART 4: PATTERN → SERVICE QUICK MAP

| Scenario                                        | Pick                                                 |
| ----------------------------------------------- | ---------------------------------------------------- |
| On-prem DR into AWS, near-zero RPO, low RTO     | **AWS Elastic Disaster Recovery (DRS)**              |
| Cross-Region RDS DR, RPO ~seconds, RTO ~minutes | **Cross-Region Read Replica** (promote on failover)  |
| Cross-Region relational DB, near-zero RPO/RTO   | **Aurora Global Database**                           |
| Active-active multi-Region NoSQL                | **DynamoDB Global Tables**                           |
| Multi-Region object store                       | **S3 CRR** (+ Multi-Region Access Point for routing) |
| Centralized cross-account/region backups        | **AWS Backup**                                       |
| Active-passive DNS failover                     | **Route 53 Failover + health checks**                |
| Sub-second non-HTTP regional failover           | **Global Accelerator**                               |
| Cheap, slow DR                                  | **Backup & Restore** (snapshots → another Region)    |
| Cheap-ish, faster DR                            | **Pilot Light**                                      |
| Balanced cost + speed                           | **Warm Standby**                                     |
| Zero downtime, max cost                         | **Multi-Site Active-Active**                         |

---

## PART 5: BACKUP STRATEGY GOTCHAS

- **EBS snapshots are regional** — copy to another Region for DR (encrypted snapshots use cross-Region KMS key handling).
- **RDS automated backups are deleted with the instance** — take a **final snapshot** or copy to another account/Region first.
- **S3 versioning + MFA Delete** protects against accidental/malicious deletion. Pair with **Object Lock (WORM)** for ransomware/compliance.
- **AWS Backup Vault Lock** = compliance mode prevents anyone (even root) from deleting backups before retention expires.
- **DynamoDB PITR** = continuous backup, restore to any second in last 35 days. Separate from on-demand backups.

---

## PART 6: KEYWORD TRIGGERS

| Question says…                                                   | Pick                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| "RPO/RTO near zero across Regions, SQL"                          | **Aurora Global Database**                                  |
| "Multi-Region, multi-active NoSQL, low latency for global users" | **DynamoDB Global Tables**                                  |
| "Replicate on-prem VMs to AWS for DR"                            | **AWS DRS** (Elastic Disaster Recovery)                     |
| "WORM compliant backups, ransomware-resistant"                   | **AWS Backup + Vault Lock**, or **S3 Object Lock**          |
| "Snapshot every EBS volume on a schedule"                        | **DLM** (Data Lifecycle Manager) or AWS Backup              |
| "Active-passive across two Regions for a web app"                | **Route 53 Failover** + health checks (+ pilot light infra) |
| "Cheapest DR"                                                    | **Backup & Restore**                                        |
| "Cost-effective but minimal downtime"                            | **Pilot Light** or **Warm Standby**                         |
| "Always-on scaled-down stack in second Region"                   | **Warm Standby**                                            |
| "Both Regions serve traffic, no failover needed"                 | **Multi-Site active-active**                                |
| "Snapshot cross-Region cross-Account from one console"           | **AWS Backup**                                              |

---

## PART 7: SELF-TEST PROMPTS

1. Which DR strategy keeps a **fully scaled-down** environment always running in the DR Region?
2. RPO of 5 minutes for a Postgres DB across Regions — which two options qualify, and which is cheaper?
3. The compliance team wants backups that **no one** can delete for 7 years. Which feature?
4. App must survive a full-Region outage with **zero data loss**. Database engine of choice?
5. On-prem VMs need DR into AWS with **sub-second RPO**. Service?
6. Multi-AZ RDS — is that DR? Why or why not?
7. What's the difference between **S3 CRR** and **SRR**?
8. Pilot light vs warm standby — what's the key distinguishing factor?
9. Default behavior: are existing S3 objects replicated when you turn CRR on?
10. RTO vs RPO — which one is "how much data can I lose"?

> Answers: (1) Warm Standby. (2) Aurora Global DB (cheaper for low RPO) vs cross-Region Read Replica. (3) AWS Backup Vault Lock (or S3 Object Lock). (4) Aurora Global Database (or DynamoDB Global Tables for NoSQL). (5) AWS Elastic Disaster Recovery (DRS). (6) No — HA only, single Region. (7) CRR = cross-Region; SRR = same-Region (compliance, log aggregation). (8) Pilot light = compute OFF; warm standby = compute always ON but scaled down. (9) No — only new objects (use S3 Batch Replication for backfill). (10) RPO.
