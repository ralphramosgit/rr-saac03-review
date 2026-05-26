# AWS SAA-C03 — Personal Weaknesses Cheat Sheet

> Topics you've gotten wrong on practice exams. **Drill these until reflexive.** Each section has the rule, the wrong instincts to kill, and the keyword that should snap you to the right answer.

---

## 1. DATABASE PERFORMANCE TRICKS (DynamoDB & Aurora)

### 1A. DynamoDB Throttling — Uneven WCU Consumption

**The rule:** To distribute workloads evenly and use provisioned throughput efficiently, use **partition keys with HIGH-CARDINALITY attributes** (lots of distinct values). DynamoDB hashes the partition key to assign data across physical partitions — uniform key distribution = uniform load.

| Symptom in the question                           | Fix                                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| "Some partitions throttled while others sit idle" | **Use a high-cardinality partition key**                                            |
| "Hot partition"                                   | High-cardinality PK; consider **write sharding** (suffix the PK with a random 1..N) |
| "Read-heavy hot key"                              | **DAX** cache, or replicate via **read sharding**                                   |

**Wrong instincts to kill:**

- ❌ "Switch to a composite primary key (partition + sort)" — sort key doesn't change physical partitioning. Distribution is driven by the **partition key only**.
- ❌ "Reduce / shorten the partition key" — irrelevant; what matters is **cardinality**, not length.
- ❌ "Increase provisioned WCU" — wastes money if the imbalance is the real problem; throttling continues on the hot partition.

**Keyword trigger:** "evenly distribute write workload" / "utilize provisioned throughput efficiently" → **high-cardinality partition key**.

---

### 1B. Aurora Reporting — Separate Production from Analytics

**The rule:** To isolate reporting/analytics queries from production traffic on the **same Aurora cluster**, create a **custom endpoint** that points at a chosen subset of replicas (e.g. larger reader instances dedicated to reporting). Aurora does **NOT** auto-route traffic by instance size or capacity.

| Endpoint                      | Routes to                          | Use                                                    |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------ |
| **Cluster endpoint** (writer) | The current writer instance        | Writes                                                 |
| **Reader endpoint**           | Load-balances across all readers   | General read scaling                                   |
| **Custom endpoint**           | A user-defined subset of instances | **Isolate reporting / BI / batch** to specific readers |
| **Instance endpoint**         | One specific instance              | Targeted testing / ops                                 |

**Wrong instincts to kill:**

- ❌ "Use the default cluster endpoint" — that's the writer, only routes to the primary.
- ❌ "Use the reader endpoint" — load-balances across **all** readers, including ones serving prod traffic.
- ❌ "Aurora will route heavy queries to bigger instances automatically" — no, it won't. You must define it.

**Keyword trigger:** "route reporting queries to specific (larger / dedicated) instances" / "isolate analytics from production reads" → **Aurora custom endpoint**.

---

## 2. ADVANCED SECURITY & COMPLIANCE (RDS & S3)

### 2A. RDS — Passwordless EC2 → DB Access

**The rule:** For **passwordless, short-lived** credentials from an EC2 (or Lambda/ECS) instance to a **MySQL or PostgreSQL RDS / Aurora** database, you must **explicitly enable IAM DB Authentication** on the DB. The app then calls `rds:GenerateDBAuthToken` and uses the **15-minute SigV4 token** as the password over an SSL connection.

**Required pieces (all of them):**

1. **Enable IAM DB authentication** on the RDS instance/cluster.
2. **Create a DB user** with `AWSAuthenticationPlugin` (MySQL) or `rds_iam` role (PostgreSQL).
3. EC2 **IAM role** with `rds-db:connect` on the DB user resource.
4. Connect with **SSL/TLS required** (use Amazon RDS CA bundle).

**Wrong instincts to kill:**

- ❌ "Just attach an IAM role to the EC2 — done" — you still need IAM DB auth turned **ON in RDS** and a DB user mapped.
- ❌ "Use SSL" — SSL encrypts in transit but still requires a username/password (or IAM token). SSL alone is not passwordless auth.
- ❌ "Use Secrets Manager" — rotates a stored password; still password-based (valid, but **not** the IAM-token-based "passwordless" pattern).
- ❌ "Use Kerberos" — that's **Windows AD** for SQL Server / Oracle / Postgres AD auth, not the MySQL/Postgres IAM token flow.

**Keyword trigger:** "passwordless", "short-lived token", "IAM-based authentication to MySQL/PostgreSQL RDS" → **Enable IAM DB Authentication**.

---

### 2B. S3 — Strict Client-Side Encryption (no keys or plaintext leave the client)

**The rule:** When compliance forbids sending **either** the plaintext data **or** the encryption keys (master keys) to AWS, you must use **S3 Client-Side Encryption with a Client-Side Master Key** (CSE-C). Encryption happens entirely in the client SDK using a key you store **outside** AWS; only ciphertext ever touches S3.

| Option                             | Data sent unencrypted?       | Key material sent to AWS?                | Meets the strict rule?      |
| ---------------------------------- | ---------------------------- | ---------------------------------------- | --------------------------- |
| **SSE-S3**                         | Yes (AWS encrypts at rest)   | N/A (AWS-owned key)                      | ❌ No                       |
| **SSE-KMS**                        | Yes                          | Yes (KMS holds the key)                  | ❌ No                       |
| **SSE-C**                          | Yes                          | Yes (you send the key with each request) | ❌ No — key transits to AWS |
| **CSE-KMS**                        | No (encrypted before upload) | **Yes** — uses KMS data key              | ❌ No — KMS is in AWS       |
| **CSE-C (client-side master key)** | No                           | **No** — key stays on-prem               | ✅ **YES**                  |

**Wrong instincts to kill:**

- ❌ "Client-side encryption with KMS" — KMS is **in AWS**, so the key material (or data key) is brokered by AWS.
- ❌ "SSE-C is client-supplied so it's safe" — SSE-C **transmits the key in the request** (header) and AWS uses it to encrypt server-side. Both data and key touch AWS.

**Keyword trigger:** "neither the unencrypted data nor any encryption keys can be sent to AWS" / "encryption must happen entirely on the client / on-prem" → **S3 client-side encryption with a client-side master key (CSE-C)**.

---

## 3. ROUTE 53 — GEOLOCATION vs GEOPROXIMITY

| Policy                                  | What it does                                                                                                                                      | Pick when…                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Geolocation**                         | Routes **based on the user's location** (continent, country, US state). No distance math — strict mapping.                                        | "Send users in Japan to the Tokyo server", "comply with content licensing per country", "serve language by country" |
| **Geoproximity** (via **Traffic Flow**) | Routes based on **geographic distance** between user and resource, **with a bias** value (+/-) that **expands or shrinks** a resource's footprint | "Shift more traffic to us-west-2 as a bias", "balance load across regions geographically with a tunable knob"       |

**Wrong instincts to kill:**

- ❌ Picking geoproximity for plain "users in country X → server in country X" — that's **Geolocation**.
- ❌ Thinking geolocation has a bias knob — it doesn't.
- ❌ Forgetting geoproximity requires **Route 53 Traffic Flow** policies.

**Keyword triggers:**

- "Strictly by user's country / continent / state" → **Geolocation**.
- "**Bias** to expand/shrink the footprint" / "shift traffic geographically by a tunable amount" → **Geoproximity**.

---

## 4. EDGE PROTECTION vs INFRASTRUCTURE FIREWALLS

**The rule:** Match the attack/threat to the right AWS service.

| Threat                                                                                                         | Right service                                                                                                      | Wrong but tempting                                                |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Volumetric DDoS (L3/L4)** — SYN floods, UDP reflection                                                       | **AWS Shield Advanced** (24/7 DRT, cost protection, advanced mitigations). Shield Standard is auto-on but limited. | Security Groups, NACLs                                            |
| **L7 web exploits** — SQL injection, XSS, bad bots, rate-based abuse on an ALB / CloudFront / API GW / AppSync | **AWS WAF** (managed rules, custom rules, rate-based rules)                                                        | Shield (Shield is L3/L4)                                          |
| **Manage WAF + Shield + SG rules across many accounts**                                                        | **AWS Firewall Manager** (org-wide policy admin)                                                                   | Picking it as the "firewall" — it's a **manager**, not a firewall |
| **East-west / egress filtering inside VPC**                                                                    | **AWS Network Firewall** or 3rd-party via GWLB                                                                     | Security Groups, NACLs (too coarse)                               |
| **Per-ENI stateful filter**                                                                                    | **Security Group**                                                                                                 | NACL                                                              |
| **Per-subnet stateless filter**                                                                                | **NACL**                                                                                                           | Security Group                                                    |

**Wrong instincts to kill:**

- ❌ "SGs / NACLs will stop a DDoS" — they don't scale to absorb volumetric attacks. They drop packets but the **link/capacity is still consumed**.
- ❌ "Firewall Manager protects against attacks" — it **administers** WAF/Shield/SG rules across accounts. The protection comes from WAF and Shield.
- ❌ "Shield protects against SQL injection" — wrong layer. SQLi/XSS = **WAF**.

**Keyword triggers:**

- "Active DDoS attack mitigation / cost protection during attacks" → **Shield Advanced**.
- "SQL injection / XSS / OWASP Top 10 on a web app fronting ALB or CloudFront" → **WAF**.
- "Centrally manage WAF/Shield/SG rules across many accounts" → **Firewall Manager**.

---

## 5. CUSTOM CLOUDWATCH METRICS — WHAT EC2 DOESN'T GIVE YOU NATIVELY

**Native (no agent needed)** from the EC2 hypervisor:

- **CPU utilization**
- **Network in/out** (bytes & packets)
- **Disk read/write** (for **instance store** volumes — bytes & ops)
- **EBS volume metrics** are emitted by **EBS itself** (not the instance), available without an agent.
- **Status checks** (system / instance).

**NOT native — requires the CloudWatch Agent installed on the instance:**

- **Memory utilization** (RAM)
- **Swap utilization**
- **Disk space used / free** (filesystem-level, vs raw disk I/O)
- **Per-process metrics**
- **Custom application logs** (also via CloudWatch Logs agent)

**Wrong instincts to kill:**

- ❌ "Enable Detailed Monitoring to get memory" — Detailed Monitoring just changes the frequency to 1-minute for the **native** metrics. It does **not** add memory/swap.
- ❌ "It's in the EC2 console, must be native" — memory is **OS-level**; the hypervisor can't see inside the guest.

**Keyword trigger:** "monitor memory / swap / disk space inside the OS" → **install the CloudWatch Agent**.

---

## 6. MESSAGING FAN-OUT — ONE SNS TOPIC, MANY QUEUES

**The rule:** To deliver **different message types** from one publisher to **different SQS queues** cleanly, use **one SNS topic** with **SNS subscription filter policies** on each SQS subscription. Each subscriber receives only the messages whose **message attributes** match its filter policy.

```
Publisher ──► SNS Topic ──┬── filter: type=order   ──► SQS-orders
                          ├── filter: type=refund  ──► SQS-refunds
                          └── filter: type=alert   ──► SQS-alerts
```

**Wrong instincts to kill:**

- ❌ "Create one SNS topic per message type" — operationally heavy, publisher has to know which topic to use, and you lose the single-publish fan-out benefit.
- ❌ "Use EventBridge buses for everything" — valid pattern, but if the question describes an existing **SNS** fan-out, the **filter policy** answer is the targeted fix.
- ❌ Filtering on **message body** by default — SNS filter policies match **message attributes**. (Body filtering does exist now via "Payload-based filtering" but exam-default is attribute-based.)

**Keyword trigger:** "single SNS topic, different SQS queues per message type" → **SNS subscription filter policy** on message attributes.

---

## ONE-PAGE FLASHCARD SUMMARY

| Weakness                                       | Snap rule                                             |
| ---------------------------------------------- | ----------------------------------------------------- |
| DynamoDB throttling                            | **High-cardinality partition key**                    |
| Aurora reporting split                         | **Custom endpoint** (not reader, not cluster)         |
| Passwordless RDS from EC2                      | **Enable IAM DB Authentication** (SigV4 15-min token) |
| Strict S3 encryption (no keys/data to AWS)     | **CSE-C (client-side master key)**                    |
| User-country routing                           | **Geolocation**                                       |
| Bias-driven geographic routing                 | **Geoproximity** (Traffic Flow)                       |
| Active DDoS mitigation                         | **Shield Advanced**                                   |
| SQLi / XSS on ALB                              | **WAF**                                               |
| Centrally manage WAF/Shield/SG across accounts | **Firewall Manager** (admin only, not the firewall)   |
| EC2 memory / swap / disk-space metrics         | **Install CloudWatch Agent**                          |
| One topic → many SQS queues by type            | **SNS subscription filter policy**                    |

---

## SELF-TEST PROMPTS

1. DynamoDB writes are throttled on one partition while others are idle — what attribute property fixes it?
2. Aurora cluster has 2 large + 4 small readers. How do you route reporting queries to only the small ones?
3. EC2 needs token-based (no password) access to a Postgres RDS — name the **two** things you must do.
4. Compliance: "no plaintext data and no encryption keys may be transmitted to AWS." Which S3 encryption?
5. Geolocation or Geoproximity for "shift 20% more traffic toward eu-west-1"?
6. Active DDoS on an ALB + custom SQLi protection — which **two** services?
7. Three EC2 metrics that are **native** and three that require the **CloudWatch Agent**.
8. One publisher, three SQS queues by message type — minimum-component design?
9. Is "IAM role on EC2" alone enough for passwordless RDS connection?
10. SSE-C vs CSE-C — which one keeps the key entirely off AWS?

> Answers: (1) **High cardinality** in the partition key. (2) **Custom endpoint** pointing at the small reader instances. (3) Enable **IAM DB Authentication** on the DB; grant `rds-db:connect` to the EC2 instance role (and map a DB user with `rds_iam`/`AWSAuthenticationPlugin`). (4) **Client-side encryption with a client-side master key (CSE-C)**. (5) **Geoproximity** (bias). (6) **Shield Advanced** (DDoS) + **WAF** (SQLi). (7) Native: CPU, Network in/out, Disk read/write (instance store) — Agent: Memory, Swap, Disk-space used. (8) **One SNS topic + filter policies** on each SQS subscription. (9) No — RDS must have IAM DB Auth enabled and a mapped DB user. (10) **CSE-C** — SSE-C still sends the key to AWS in the request header.
