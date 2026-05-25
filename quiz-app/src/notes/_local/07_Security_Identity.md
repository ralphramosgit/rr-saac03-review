# AWS SAA-C03 — 07 · Security & Identity Services

> IAM, Organizations, KMS, Secrets Manager, Cognito, WAF, Shield, GuardDuty, Inspector, Macie, Security Hub, Config, CloudTrail.

---

## PART 1: IAM (Identity & Access Management)

**One-liner:** Global service controlling **who (principal)** can **do what (action)** on **which resource** under **what conditions**.

### Core Concepts

| Item | Definition |
|------|-----------|
| **User** | Long-term identity for a human/app; gets access keys/console pwd |
| **Group** | Collection of users; for policy attachment (cannot nest) |
| **Role** | Identity assumed temporarily; no long-term creds; for services/cross-account/federation |
| **Policy** | JSON: Effect / Action / Resource / Condition |
| **Identity Provider (IdP)** | SAML 2.0 (corporate AD), OIDC (Google, etc.) |

### Policy Types

| Type | Attached to | Use |
|------|------------|-----|
| **Identity-based** | User/group/role | Most common |
| **Resource-based** | Bucket/queue/role trust policy | Cross-account, anonymous |
| **Permissions boundary** | User/role | Max permissions ceiling |
| **SCP (Service Control Policy)** | OU/account in Org | Guardrails — denies/allows max set for accounts |
| **Session policy** | Temp via STS | Further restrict assumed role |
| **ACL** | S3 (legacy), VPC NACL | Resource-attached |

### Policy Evaluation Logic (Memorize)

```
Explicit DENY → DENY (always wins)
No applicable allow → DENY (implicit)
SCP must allow → otherwise DENY
Resource policy or identity policy allow → ALLOW
Permissions boundary must allow → otherwise DENY
```

### IAM Rules

- IAM = **global**, eventually consistent.
- Max **2 access keys per user** (rotate via creating second, then deleting first).
- **Roles for EC2 / Lambda / ECS** — never embed access keys.
- **STS** for temp creds (AssumeRole, AssumeRoleWithSAML, AssumeRoleWithWebIdentity).
- **IAM Access Analyzer** finds resources shared externally; generates least-privilege policies.

> **Keyword:** "EC2 needs S3 access" → **IAM Role** (instance profile), NOT keys.
> **Keyword:** "cross-account access" → **Role + trust policy**.
> **Keyword:** "federate corporate AD" → **SAML + IAM Identity Center** (formerly SSO).

### IAM Identity Center (SSO)
Replaces IAM SSO; integrates with AD/Okta/Azure AD; one login → many AWS accounts; permission sets.

---

## PART 2: AWS ORGANIZATIONS

| Feature | Detail |
|---------|--------|
| **Management (master) account** | Owns the org, pays bills |
| **Member accounts** | Joined or created in OUs |
| **OUs** | Hierarchical grouping; SCPs attach here |
| **SCPs** | Maximum permission boundary for an account; **don't grant**, only allow/deny boundary |
| **Consolidated billing** | One bill, volume discounts shared |
| **AWS Control Tower** | Opinionated multi-account governance on top of Organizations |
| **AWS RAM (Resource Access Manager)** | Share resources (subnets, TGW, license configs) across accounts |

> **Rule:** SCPs do **NOT** apply to the management account.
> **Rule:** SCPs alone don't grant — user still needs IAM permission.

---

## PART 3: ENCRYPTION & SECRETS

### AWS KMS

| Item | Detail |
|------|--------|
| **Key types** | AWS-owned (free), AWS-managed (`aws/<service>`, free), **Customer-managed (CMK)** |
| **Key spec** | Symmetric (AES-256), Asymmetric (RSA, ECC), HMAC |
| **Multi-Region keys** | Replicated key material; same key ID across regions |
| **Key policies** | Resource policy; **required** — IAM alone insufficient |
| **Grants** | Programmatic temporary delegation |
| **Envelope encryption** | KMS encrypts a data key; data key encrypts the data |
| **Rotation** | Auto-rotate AWS-managed: yearly; CMK: enable annual rotation |
| **Limits** | 100,000 req/sec via key (shared); KMS throttles on high request rates |

> **Keyword:** "I want to control rotation & audit" → **Customer-managed CMK**.
> **Keyword:** "encrypt across regions same key" → **Multi-Region KMS key**.

### AWS CloudHSM
Dedicated FIPS 140-2 Level 3 HSM hardware in your VPC. You manage keys; AWS doesn't see them.

### Secrets Manager vs SSM Parameter Store

| | Secrets Manager | SSM Parameter Store |
|---|-----------------|---------------------|
| **Cost** | $$ per secret + API | Free (standard) |
| **Rotation** | **Built-in** (Lambda integrations for RDS, etc.) | Manual / custom |
| **Size** | 64 KB | 4 KB std / 8 KB advanced |
| **Cross-account** | Yes | Yes (advanced) |
| **Use** | DB creds, API keys w/ rotation | Config, license keys, secrets w/ manual rotation |

> **Keyword:** "automatic rotation of RDS password" → **Secrets Manager**.
> **Keyword:** "store config values, cheap" → **Parameter Store**.

### AWS Certificate Manager (ACM)
Free public TLS certs, auto-renewal. Used by ALB, NLB (TLS listener), CloudFront, API GW.
- **CloudFront requires cert in us-east-1.**
- Private CA available (ACM PCA, paid).

---

## PART 4: APPLICATION IDENTITY

### Amazon Cognito

| Component | Purpose |
|-----------|---------|
| **User Pools** | Sign-up / sign-in; JWT tokens; MFA; social + SAML federation |
| **Identity Pools (Federated Identities)** | Exchange tokens for **temp AWS creds** to call AWS services from clients |

> **Keyword:** "mobile/web app sign-in + call S3/DynamoDB" → **Cognito User Pool + Identity Pool**.

### AWS Directory Service

| Option | Use |
|--------|-----|
| **AWS Managed Microsoft AD** | Full AD in cloud; trust with on-prem |
| **AD Connector** | Proxy to existing on-prem AD |
| **Simple AD** | Lightweight Samba-based; small workloads |

---

## PART 5: THREAT DETECTION & POSTURE

| Service | What It Does |
|---------|--------------|
| **GuardDuty** | Continuous threat detection on CloudTrail, VPC Flow Logs, DNS logs, EKS, S3, Lambda, malware on EBS |
| **Amazon Inspector** | Vulnerability scanning of EC2, ECR images, Lambda functions |
| **Amazon Macie** | Discover & classify **sensitive data (PII)** in S3 using ML |
| **AWS Security Hub** | Aggregate findings from GuardDuty/Inspector/Macie + 3rd parties; CIS/PCI checks |
| **AWS Detective** | Investigate & root-cause security findings (graph analysis) |
| **AWS Config** | Resource configuration history + compliance rules (e.g., "all EBS encrypted?") |
| **AWS CloudTrail** | API call audit logs across the account |
| **AWS Audit Manager** | Continuous compliance auditing (PCI, HIPAA, SOC 2) |

> **Keyword:** "find PII in S3" → **Macie**.
> **Keyword:** "scan EC2/containers for CVEs" → **Inspector**.
> **Keyword:** "detect compromised instances, port scan" → **GuardDuty**.
> **Keyword:** "track config changes for compliance" → **AWS Config**.
> **Keyword:** "who called API X?" → **CloudTrail**.

### CloudTrail Quick Facts

- Default: **90 days** of management events in Event History (free).
- Create a **Trail** to S3 (and CloudWatch Logs) for long-term + data events + insights events.
- **Multi-region trail** recommended.
- **Organization trail** captures all member accounts.
- **Log file integrity validation** (SHA-256 digest) for tamper detection.

---

## PART 6: PERIMETER PROTECTION

| Service | Layer | Protects | Notes |
|---------|-------|---------|-------|
| **AWS WAF** | L7 | CloudFront, ALB, API GW, AppSync, App Runner | SQLi, XSS, bot, rate limit, geo, managed rule groups |
| **AWS Shield Standard** | L3/L4 | All AWS | Free, automatic |
| **AWS Shield Advanced** | L3/L4/L7 | EC2, ELB, CloudFront, GA, R53 | $3K/mo + cost protection + DRT team |
| **AWS Firewall Manager** | Org-wide | WAF/Shield/SGs/Network Firewall policies across accounts | Requires Organizations |
| **AWS Network Firewall** | L3/L7 | VPC | Stateful Suricata rules, IDS/IPS |

> **Keyword:** "block SQL injection at app layer" → **WAF**.
> **Keyword:** "DDoS at scale, refunds for spikes" → **Shield Advanced**.
> **Keyword:** "enforce WAF rules across 50 accounts" → **Firewall Manager** (+ Organizations).

---

## Encryption Cheat

| Service | At Rest | In Transit |
|---------|---------|-----------|
| S3 | SSE-S3 default, SSE-KMS, SSE-C, DSSE | HTTPS, enforce via `aws:SecureTransport` |
| EBS | KMS (CMK) | Encrypted at host; volume-to-instance |
| RDS | KMS at create only | SSL/TLS |
| DynamoDB | Always (AWS or KMS) | HTTPS |
| EFS | KMS | TLS via amazon-efs-utils |
| SQS / SNS / Kinesis | KMS (SSE) | HTTPS |

---

## Self-Test

- Order of policy evaluation (deny vs allow vs SCP)?
- Why use a role for EC2 instead of access keys?
- Cognito User Pool vs Identity Pool?
- Secrets Manager vs Parameter Store — when each?
- Macie vs Inspector vs GuardDuty?
- Where is CloudFront's ACM cert region?
- Multi-Region KMS key — what does it solve?
- SCP applies to management account? (No)
