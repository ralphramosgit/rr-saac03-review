// SAA-C03 Domain Notes — consolidated cheat-sheets per exam domain.
// 4 domains × 4 variants (In-Depth · Concise · Exam Prep · Comparisons & Scenarios).

export type DomainVariantKind = "in-depth" | "concise" | "exam" | "compare";

export type DomainVariant = {
  kind: DomainVariantKind;
  label: string;
  hint: string;
  content: string;
};

export type Domain = {
  id: string;
  number: string;
  title: string;
  weightPct: number; // official exam weight
  emoji: string;
  blurb: string;
  keyServices: string[];
  variants: DomainVariant[];
};

/* ──────────────────────────────────────────────────────────────────────
   DOMAIN 1 — DESIGN SECURE ARCHITECTURES (30%)
   ────────────────────────────────────────────────────────────────────── */

const SECURE_IN_DEPTH = `# Domain 1 — Design Secure Architectures (30%)

> The largest exam domain. Covers identity, network isolation, data protection
> (at-rest & in-transit), perimeter controls, threat detection, and governance.

## 1. Identity & Access Management (IAM)

### Principals, Policies, Evaluation Logic
- **Principal types:** IAM Users, IAM Roles, AWS services, federated identities (SAML/OIDC), root.
- **Policy types (evaluation order):**
  1. **Explicit Deny** — anywhere — always wins.
  2. **Organizations SCPs** — guardrails on accounts (deny by absence).
  3. **Resource policies** (S3 bucket, KMS key, SNS topic, Lambda).
  4. **Identity policies** attached to user/group/role.
  5. **Permission boundaries** (max permissions a principal can have).
  6. **Session policies** (passed at AssumeRole; further restrict).
- **Default = implicit deny.** Allow must be explicit and uncontradicted.
- **Conditions:** \`aws:SourceIp\`, \`aws:PrincipalOrgID\`, \`aws:MultiFactorAuthPresent\`, \`aws:SourceVpce\`, \`aws:RequestTag\`, \`aws:ResourceTag\`.

### Roles vs Users
- **IAM Role:** temporary STS creds, **assumed** by services/users/federation. No long-term keys.
- **IAM User:** long-term creds; avoid for workloads.
- **EC2 Instance Profile** = container that delivers a role to EC2.
- **Cross-account access:** Role in Account B with **trust policy** allowing Account A's principal to \`sts:AssumeRole\`.

### Federation & Centralized Identity
- **IAM Identity Center (SSO):** AWS-recommended SSO across accounts in Organizations; integrates with AD/Okta/Entra ID.
- **Cognito:**
  - **User Pools** → sign-up/sign-in for app users; issues JWTs.
  - **Identity Pools (federated identities)** → exchange JWT for **temporary AWS credentials**.
- **STS APIs:** \`AssumeRole\`, \`AssumeRoleWithSAML\`, \`AssumeRoleWithWebIdentity\`, \`GetSessionToken\`, \`GetFederationToken\`.

### Organizations & SCPs
- **AWS Organizations:** consolidated billing + multi-account governance.
- **OU hierarchy** with **SCPs** restricting maximum permissions of member accounts.
- **SCPs don't grant permissions** — they only limit what IAM allows.
- **Tag policies, AI services opt-out, Backup policies** also enforced org-wide.

### Best Practices (exam triggers)
- "Long-term keys on EC2" → **wrong** → use **instance profile/role**.
- "Application needs AWS API access from on-prem" → **IAM Roles Anywhere** (X.509 certs) or **SSO + AssumeRole**.
- "Need least privilege" → **IAM Access Analyzer** generates policies from CloudTrail logs.
- "Audit unused permissions" → IAM Access Analyzer **unused access findings**.

## 2. Network Security

### VPC Building Blocks
- **VPC:** logically isolated network in one region; CIDR /16 to /28.
- **Subnets:** AZ-scoped; **public** (route to IGW) vs **private** (no IGW).
- **Internet Gateway (IGW):** horizontally scaled, free, attaches to VPC.
- **NAT Gateway:** managed egress for private subnets; per-AZ for HA; **NAT Instance** = legacy/self-managed.
- **Egress-only IGW:** IPv6 outbound only.
- **Route tables:** per-subnet (or default).

### Stateful vs Stateless Filters
- **Security Group (SG):** **stateful**; instance-level; **allow only** (no deny rules); references SG IDs.
- **NACL:** **stateless**; subnet-level; allow+deny rules; numbered, lowest first; **default = allow all**, **custom = deny all**.
- **Ephemeral ports (1024-65535)** must be opened in NACLs for return traffic.

### Connectivity Patterns
- **VPC Peering:** 1:1, no transitive, same/cross-region/account.
- **Transit Gateway (TGW):** hub-and-spoke; transitive; route tables per attachment; **scales to thousands of VPCs**.
- **VPC Endpoints:**
  - **Gateway Endpoint** (free): S3, DynamoDB → route table entry.
  - **Interface Endpoint** (PrivateLink, ENI, $$): everything else (KMS, SSM, EC2 API, SNS, SQS, etc.).
- **AWS PrivateLink:** expose service privately to consumer VPCs without VPC peering.
- **Site-to-Site VPN:** IPsec over internet; ~1.25 Gbps per tunnel.
- **Direct Connect (DX):** dedicated fiber; **1/10/100 Gbps**; lower latency than VPN; **DX Gateway** = global, multiple VGW/TGW.
- **Direct Connect + VPN backup** = standard hybrid pattern.
- **Client VPN:** OpenVPN-based user access into VPC.

### Edge Protection
- **AWS WAF:** L7; rules on HTTP/HTTPS; deploy on **CloudFront, ALB, API Gateway, AppSync, App Runner, Cognito**. Not NLB.
- **AWS Shield Standard:** free, L3/L4 DDoS, always on.
- **AWS Shield Advanced:** $3,000/mo; 24/7 DRT; cost protection; advanced reporting; **WAF included**.
- **AWS Firewall Manager:** centrally manage WAF, Shield Advanced, SG, Network Firewall across Org.
- **AWS Network Firewall:** stateful managed firewall at VPC level (Suricata rules); IDS/IPS.
- **Route 53 Resolver DNS Firewall:** block DNS queries to malicious domains.
- **CloudFront + WAF + Shield + Route 53** = standard public-facing protection stack.

## 3. Data Protection

### Encryption at Rest
- **KMS:** envelope encryption; **CMKs** (now "KMS keys").
  - **AWS-managed keys** (free, per-service, can't change policy).
  - **Customer-managed keys (CMK)** — full control, key policy, rotation.
  - **AWS-owned** — invisible.
  - **External / Imported** key material (BYOK).
- **Symmetric (AES-256)** default; **asymmetric (RSA/ECC)** for sign/verify or encrypt across boundaries.
- **Automatic rotation:** customer-managed symmetric keys, **yearly**; manual for asymmetric/imported.
- **Multi-Region keys:** same key ID across regions, ideal for global apps + DR.
- **CloudHSM:** single-tenant FIPS 140-2 L3 HSM; required for regulatory custody, custom cipher suites.
- **Per-service encryption:** S3 SSE-S3/SSE-KMS/SSE-C/DSSE-KMS, EBS (KMS), RDS/Aurora (KMS at create), DynamoDB (KMS), EFS (KMS), FSx, SNS, SQS, etc.

### Encryption in Transit
- **TLS** everywhere; ACM provides free public certs (renewed automatically) for ELB, CloudFront, API Gateway.
- **ACM Private CA:** internal PKI.
- **VPN/DX:** use **MACsec** (DX 10/100 Gbps) for L2 encryption; IPsec for VPN.

### Secrets & Parameters
- **AWS Secrets Manager:** secrets storage + **automatic rotation** (Lambda) for RDS/Redshift/DocDB. Cross-region replication.
- **SSM Parameter Store:** config + secrets; **Standard (free, 4KB)** vs **Advanced ($, 8KB, policies)**; rotation via EventBridge/Lambda (no built-in).
- **Use Secrets Manager when:** rotation is a requirement; **Parameter Store when:** cheap config storage or hierarchical params.

### S3 Data Protection (heavy on exam)
- **Bucket policies + IAM** — both checked.
- **Block Public Access** (account + bucket level) — turn ON unless explicitly serving public content.
- **Versioning + MFA Delete** — protect against accidental/malicious deletion.
- **Object Lock** (WORM): **Governance** (privileged override) vs **Compliance** (immutable even root); **Legal Hold**.
- **Replication:** SRR/CRR; needs versioning on both; **RTC = 15 min SLA**; can change ownership/encryption.
- **Pre-signed URLs:** time-bound access without exposing creds.
- **Access Points / Multi-Region Access Points / Object Lambda**.
- **S3 Macie:** ML detection of PII/PHI in S3 buckets.

## 4. Threat Detection & Monitoring

| Service | Source | Detects |
|---|---|---|
| **GuardDuty** | VPC Flow Logs, DNS, CloudTrail, EKS audit, S3, RDS auth, Lambda, Malware Protection | Threats, anomalies, crypto-mining |
| **Inspector v2** | EC2, ECR images, Lambda | CVEs & network reachability |
| **Macie** | S3 objects | PII/PHI/sensitive data |
| **Detective** | Logs + ML graph | Investigation/root cause |
| **Security Hub** | All security findings | Single pane, CIS/PCI standards |
| **Config** | Resource snapshots | Compliance drift, change history |
| **CloudTrail** | API calls | Audit log (Mgmt, Data, Insights events) |
| **Audit Manager** | Continuous evidence | Framework reports (PCI/HIPAA/SOC2) |

- **CloudTrail Lake** for SQL queries over events. **CloudTrail → Org trail** for multi-account.
- **VPC Flow Logs** → CloudWatch Logs / S3 / Kinesis Firehose; capture ACCEPT/REJECT traffic.

## 5. Governance & Compliance

- **AWS Config Rules:** managed + custom (Lambda/Guard); auto-remediation via SSM Automation.
- **AWS Control Tower:** opinionated multi-account landing zone built on Organizations + Config + IAM Identity Center.
- **Service Control Policies (SCPs):** account-level guardrails.
- **AWS Artifact:** compliance reports (SOC, PCI, ISO).
- **AWS License Manager:** BYOL tracking.
- **Tag-based access control (ABAC):** scale permissions via tags.

## 6. Common Secure-Architecture Patterns

- **3-tier web app:** ALB (public) → app EC2/ECS (private) → RDS (private). SG chains. NAT GW for egress patches.
- **Bastion/SSM Session Manager:** **prefer SSM** (no inbound ports, full logging) over bastion host.
- **Private API to AWS services:** **VPC Endpoints** + bucket policies with \`aws:SourceVpce\` condition.
- **Cross-account S3 access:** bucket policy + IAM role assumption; consider **S3 Object Ownership = Bucket owner enforced** to disable ACLs.
- **Zero-trust ingress:** CloudFront → WAF → ALB; **AWS Verified Access** for app-level identity-aware access (replaces VPN).
`;

const SECURE_CONCISE = `# Domain 1 — Concise

## IAM
- Policy eval: **Explicit Deny → SCP → Resource → Identity → Boundary → Session**.
- Never put keys on EC2 → use **roles via instance profile**.
- Cross-account = **trust policy + sts:AssumeRole**.
- Centralize → **IAM Identity Center** (SSO) over Organizations.
- App users → **Cognito User Pools (auth) + Identity Pools (AWS creds)**.

## Network
- **SG = stateful, allow-only, instance**. **NACL = stateless, subnet, allow+deny**.
- Outbound private → **NAT Gateway** (HA per AZ).
- Private AWS API → **Gateway Endpoint** (S3/DDB free) or **Interface Endpoint** (PrivateLink, paid).
- Hub-spoke many VPCs → **Transit Gateway**.
- Hybrid: **DX + VPN backup**.
- L7 protect: **CloudFront + WAF + Shield (Advanced if SLA)**.
- VPC-level deep inspection: **Network Firewall**.

## Data
- Keys → **KMS CMK** (rotate yearly); single-tenant FIPS → **CloudHSM**.
- TLS certs → **ACM** (free, auto-renew on ELB/CF/APIGW).
- Secrets w/ rotation → **Secrets Manager**; cheap config → **SSM Parameter Store**.
- S3: enable **Block Public Access**, **Versioning**, **Default Encryption**, **Object Lock (WORM)** when immutability required.
- Tamper-proof CloudTrail logs → S3 + **Object Lock Compliance + log validation**.

## Detection
- Threats → **GuardDuty**. CVE → **Inspector**. PII → **Macie**.
- Investigation → **Detective**. Aggregation → **Security Hub**.
- Drift/config compliance → **AWS Config**. Audit trail → **CloudTrail**.

## Governance
- Multi-account guardrails → **SCPs in Organizations / Control Tower**.
- ABAC via **resource & principal tags**.
- Centralized firewall mgmt → **Firewall Manager**.

## Top "wrong-answer traps"
- WAF on **NLB** — NO (NLB is L4, no WAF).
- NACL is **stateful** — NO, stateless.
- SCP **grants** access — NO, only restricts.
- Bastion host is best practice — NO, **SSM Session Manager**.
- Root account daily use — NEVER.
`;

const SECURE_EXAM = `# Domain 1 — Exam Prep (rapid recall)

## 60-Second Service Map

| Need | Service |
|---|---|
| User sign-in for app | **Cognito User Pool** |
| Temporary AWS creds for federated users | **Cognito Identity Pool / STS** |
| Cross-account access | **IAM Role with trust policy** |
| Multi-account SSO | **IAM Identity Center** |
| Org-wide guardrails | **SCPs / Control Tower** |
| Workload identity from on-prem | **IAM Roles Anywhere** |
| Rotate DB password automatically | **Secrets Manager** |
| Store config / params cheaply | **SSM Parameter Store** |
| Encryption keys, regulated single-tenant | **CloudHSM** |
| Encryption keys, multi-tenant managed | **KMS** |
| Public TLS cert, free, auto-renew | **ACM** |
| Internal PKI | **ACM Private CA** |
| Block SQLi/XSS at edge | **WAF on CloudFront/ALB/APIGW** |
| DDoS, free | **Shield Standard** |
| DDoS w/ SLA + DRT | **Shield Advanced** |
| Central WAF mgmt across Org | **Firewall Manager** |
| Stateful VPC IDS/IPS | **Network Firewall** |
| Block malicious domains | **Route 53 Resolver DNS Firewall** |
| Threat detection on logs | **GuardDuty** |
| OS / container / Lambda CVE scan | **Inspector** |
| Find PII in S3 | **Macie** |
| Investigate alerts | **Detective** |
| Aggregate findings | **Security Hub** |
| API audit log | **CloudTrail** |
| Config drift / compliance | **AWS Config** |
| Continuous compliance evidence | **Audit Manager** |
| Private S3 access from VPC | **Gateway VPC Endpoint** |
| Private KMS/SSM access from VPC | **Interface Endpoint (PrivateLink)** |
| Many VPC + on-prem hub | **Transit Gateway** |
| Lowest-latency hybrid link | **Direct Connect** |
| Encrypted DX | **DX + MACsec** |
| No-bastion EC2 shell | **SSM Session Manager** |
| Identity-aware ZTNA app | **AWS Verified Access** |

## Memory Hooks
- **G**uardDuty = **G**lobal threat radar.
- **M**acie = **M**any **P**II discoveries.
- **I**nspector = **I**nventory of CVEs.
- **D**etective = **D**ig deeper.
- **C**onfig = **C**ompliance state.
- **C**loudTrail = **C**alls (API).

## Encryption Quick Rules
- KMS key request: **per-region**, can be **multi-region** keyset.
- Envelope = **data key encrypted by KMS key**; data encrypted with data key.
- Imported key material: **must rotate manually**, can set expiration.
- S3 SSE-C: client supplies key per request (AWS never stores).
- DSSE-KMS: **double encryption** for high-assurance workloads.

## High-Confusion Boundaries
- **Bucket policy** (resource) vs **IAM policy** (identity): both checked; **explicit deny wins**.
- **SG** references SG IDs across peering — **NACL** cannot.
- **NAT GW** scales to 100 Gbps; **NAT Instance** is single-EC2 and a SPOF.
- **Gateway Endpoint** (S3/DDB) is **free, regional**; **Interface Endpoint** is **per-AZ, per-hour, per-GB**.
- **WAF**: CloudFront / ALB / APIGW / AppSync / App Runner / Cognito. **NOT NLB**.

## "Always pick this" Patterns
- New SAA-C03 question: **temporary creds, no long-term keys** → IAM Role.
- "Most secure for…" + KMS-able service → **CMK with key policy + CloudTrail**.
- "Privately reach AWS service" → **VPC Endpoint**.
- "Centralized…across accounts" → **Organizations + Identity Center / Firewall Manager / Config aggregator / Security Hub**.
- "Compliance immutability" → **S3 Object Lock Compliance mode**.
- "Compromised credentials risk" → **Secrets Manager rotation + IAM Access Analyzer + GuardDuty**.

## Common Trap Answers (mark them wrong)
- Storing IAM access keys in EC2 user-data.
- Using NACL alone for app-level filtering.
- Putting WAF in front of NLB.
- Granting permissions via SCP.
- Using root for daily admin.
- Public S3 bucket with object ACL "for compatibility".
`;

const SECURE_COMPARE = `# Domain 1 — Comparisons & Scenarios

## Side-by-Side Comparisons

### KMS vs CloudHSM
| Feature | KMS | CloudHSM |
|---|---|---|
| Tenancy | Multi-tenant managed | Single-tenant HSM |
| Compliance | FIPS 140-2 L2 (L3 for HSM-backed) | **FIPS 140-2 L3** |
| Key control | AWS-shared admin plane | Customer-only |
| Integration | Native with 100+ AWS services | Limited; via PKCS#11/JCE/CNG |
| Cost | $1/key/mo + API | $1.45/hr/HSM |
| Use case | Default | Custom cipher, regulatory custody, BYOK chains |

### Secrets Manager vs SSM Parameter Store
| Feature | Secrets Manager | Parameter Store |
|---|---|---|
| Cost | $0.40/secret/mo + API | **Free** (standard) |
| Rotation | **Native (Lambda template)** | Manual / EventBridge |
| Size | 64 KB | 4 KB std / 8 KB advanced |
| Cross-region | **Replica secrets** | No (manual) |
| Use when | DB rotation, compliance | Config, feature flags, cheap secrets |

### Security Group vs NACL
| | SG | NACL |
|---|---|---|
| State | **Stateful** | **Stateless** |
| Scope | ENI/Instance | Subnet |
| Rules | Allow only | Allow + Deny |
| Default new | Deny inbound / Allow outbound | Allow all both ways (custom = deny all) |
| Eval | All rules | Numbered, first match |
| References | SG IDs, prefix lists | CIDR only |

### Cognito User Pool vs Identity Pool
| User Pool | Identity Pool |
|---|---|
| Auth: sign-up / sign-in | Federated identity broker |
| Output: **JWTs** | Output: **temporary AWS creds (STS)** |
| Use to gate your API | Use to call S3/DDB/Lambda directly from client |

### GuardDuty vs Inspector vs Macie vs Detective
- **GuardDuty** = anomalies in logs (CloudTrail/DNS/Flow/EKS).
- **Inspector** = vulns/CVEs in EC2, ECR, Lambda.
- **Macie** = sensitive data discovery in S3.
- **Detective** = root-cause investigation across logs (graph DB).

### CloudTrail vs CloudWatch vs Config
- **CloudTrail** = **who did what** (API calls).
- **CloudWatch** = **performance & operational** metrics/logs/alarms.
- **Config** = **what state** resources are in over time + compliance.

### WAF vs Shield vs Network Firewall vs SG/NACL
- **WAF**: L7, HTTP filtering, OWASP rules.
- **Shield**: L3/L4 DDoS volumetric.
- **Network Firewall**: L3-L7 IDS/IPS at VPC perimeter, Suricata.
- **SG/NACL**: per-instance/subnet allow-deny, no inspection.

### Direct Connect vs VPN vs Transit Gateway
- **VPN**: cheap, fast to deploy, IPsec, internet-routed, ~1 Gbps tunnel.
- **DX**: dedicated, low/consistent latency, 1/10/100 Gbps, weeks to provision.
- **TGW**: connects many VPCs + DX/VPN as a hub.
- **DX + VPN backup** = HA hybrid.

---

## Exam Scenarios

### S1 — "Hospital app must store PHI in S3 with proof of immutability for 7 years."
**Answer:** S3 with **versioning + default SSE-KMS + Object Lock Compliance mode (7-year retention) + Bucket Policy denying delete**. Audit with **CloudTrail data events + Config + Macie**.

### S2 — "EC2 in private subnet needs to call S3 without going over the internet."
**Answer:** **Gateway VPC Endpoint for S3**, add bucket policy condition \`aws:SourceVpce\`.
- ❌ NAT Gateway → works but not "without the internet" and costs more.
- ❌ Interface endpoint → only for ~all other services, S3 is gateway.

### S3 — "Centralized authentication for 30 AWS accounts with corporate AD."
**Answer:** **AWS Organizations + IAM Identity Center + SAML 2.0 federation to AD/Entra ID**. Map AD groups → permission sets.

### S4 — "Lambda needs to read a DB password that rotates every 30 days."
**Answer:** **Secrets Manager with automatic rotation** + Lambda IAM role permitted to \`secretsmanager:GetSecretValue\`. Cache with the Secrets Manager Lambda extension.

### S5 — "Block SQL-injection attacks on a public REST API."
**Answer:** **WAF managed rule group (AWSManagedRulesSQLiRuleSet)** on **API Gateway** or fronted **CloudFront/ALB**.

### S6 — "Detect crypto-mining behavior on EC2."
**Answer:** **GuardDuty** (CryptoCurrency finding type) with EventBridge to SNS/Lambda for remediation.

### S7 — "Audit which API call deleted an S3 object yesterday."
**Answer:** **CloudTrail Data Events** for the S3 bucket, queried with **CloudTrail Lake** or Athena.

### S8 — "Hardware-isolated HSM for FIPS 140-2 Level 3."
**Answer:** **CloudHSM** (KMS is multi-tenant L2; KMS Custom Key Store can front a CloudHSM cluster).

### S9 — "Application on EC2 must access another account's S3 bucket."
**Answer:** Create IAM Role in **target account** trusting source account's role; source EC2 instance role calls \`sts:AssumeRole\`; alternative: **bucket policy** granting the source role principal directly.

### S10 — "Single bucket served as static website plus signed access to private objects."
**Answer:** **CloudFront** with **OAC** (Origin Access Control) in front of S3; **signed URLs/cookies** for private paths; Block Public Access ON; bucket policy only allows CF.

### S11 — "Replace bastion hosts in 5 accounts."
**Answer:** **SSM Session Manager** (no inbound ports, session logging to S3/CloudWatch, IAM-controlled). Combine with **VPC interface endpoints for SSM**.

### S12 — "Comply with PCI DSS report requirement."
**Answer:** **AWS Artifact** for AWS-side reports + **Audit Manager** for continuous evidence collection + **Security Hub PCI standard**.

### S13 — "Sensitive data leaked to a public S3 bucket — how to detect & prevent recurrence?"
**Answer:** Detect: **Macie** scan; prevent: **S3 Block Public Access (account level)**, **SCP denying \`s3:PutBucketPublicAccessBlock=false\`**, **Config Rule s3-bucket-public-read-prohibited**.

### S14 — "Single VPC has 200 spoke VPCs and 3 on-prem sites."
**Answer:** **Transit Gateway** with route tables segmenting prod/dev + **DX + VPN backup** to on-prem; **DX Gateway** if multi-region.

### S15 — "App must call only AWS services in same region with no internet."
**Answer:** **Interface VPC endpoints** for required services + **gateway endpoints** for S3/DDB; disable public IPs.

### S16 — "Need to revoke an IAM user's access keys immediately if they leak."
**Answer:** **GuardDuty + EventBridge → Lambda → \`iam:UpdateAccessKey Inactive\` + notify**; longer term: **IAM Roles Anywhere / federation** to remove keys entirely.
`;

/* ──────────────────────────────────────────────────────────────────────
   DOMAIN 2 — DESIGN RESILIENT ARCHITECTURES (26%)
   ────────────────────────────────────────────────────────────────────── */

const RESILIENT_IN_DEPTH = `# Domain 2 — Design Resilient Architectures (26%)

> Designing for **high availability, fault tolerance, decoupling, and disaster recovery**.
> The exam tests AZ/region failure isolation, stateless designs, and DR strategy choice.

## 1. AWS Global Foundations

- **Region:** 2+ AZs, isolated; choose by **latency, compliance, services, cost**.
- **Availability Zone (AZ):** 1+ datacenters, isolated power/network; **fault domain** unit.
- **Edge Locations:** ~600+, used by CloudFront, R53, Global Accelerator, S3 Transfer Accel.
- **Local Zones / Wavelength / Outposts:** extend AWS to specific geo / 5G / on-prem.
- **Resilience hierarchy:** Multi-AZ (HA) → Multi-Region (DR) → Multi-Account (blast-radius).

## 2. Compute Resilience

### EC2 + Auto Scaling Group (ASG)
- **ASG across ≥2 AZs** → AZ-tolerant compute.
- **Health checks:** EC2 status or **ELB health** (preferred for app failures).
- **Scaling policies:** Target tracking, step, scheduled, predictive.
- **Lifecycle hooks**: drain, warm-up, term.
- **Warm pools** for fast scale-out.
- **Launch templates** preferred over launch configs.
- **Replacement during failure:** Unhealthy → terminated → new instance.

### Elastic Load Balancing
| LB | L | Targets | Features |
|---|---|---|---|
| **ALB** | 7 | EC2/IP/Lambda/ECS | Host/Path/Header routing, WebSocket, gRPC, Cognito auth |
| **NLB** | 4 | EC2/IP/ALB | TCP/UDP, **static IPs / EIPs**, ultra-low latency, **millions RPS** |
| **GWLB** | 3/4 | Firewall appliances | Insert L3 appliances (transparent) |
| **CLB** | Legacy | — | — |
- **Cross-zone LB:** ALB ON by default; NLB OFF by default (per-AZ cost).
- **Deregistration delay (connection draining):** default 300s.
- **Sticky sessions:** ALB cookie-based; NLB by source IP.

### Containers & Serverless
- **ECS:** Fargate (serverless) or EC2 launch; **Service auto-scaling**; **capacity providers**.
- **EKS:** managed Kubernetes; **cluster autoscaler / Karpenter**; **Multi-AZ node groups**.
- **Fargate:** spreads tasks across AZs; ephemeral storage 20-200 GB.
- **Lambda:** automatic Multi-AZ within region; **reserved concurrency** for throttling control; **provisioned concurrency** for cold-start; **DLQ + destinations + retries** for async failures.
- **Step Functions:** state machine for retries/parallel/wait/saga.

## 3. Storage Resilience

### S3
- **11 9s durability**, **4 9s availability** (Standard).
- All but One Zone-IA = **multi-AZ**.
- **S3 One Zone-IA / Express One Zone**: single-AZ, lower cost.
- **CRR / SRR** for cross-region or same-region replication.
- **Multi-Region Access Points** for failover routing.
- **Versioning + Lifecycle + MFA Delete** for durability against deletion.

### EBS
- **Single-AZ** → snapshot to S3 (regional) for AZ failure recovery.
- **Multi-Attach** (io1/io2) — same-AZ only, **not** HA across AZ.
- **Snapshots cross-region copy** for DR; **Fast Snapshot Restore (FSR)** for instant capacity.
- **io2 Block Express** — 99.999% durability per volume.

### EFS
- **Multi-AZ regional file system**, scales automatically.
- **Lifecycle to IA / Archive** for cost.
- **EFS Replication** for cross-region DR (15 min RPO).

### FSx
- **FSx for Windows File Server / NetApp ONTAP / OpenZFS / Lustre**.
- **Multi-AZ deployments** available for Windows/ONTAP.

### Backup
- **AWS Backup:** centralized policies; cross-region + cross-account vaults; **Vault Lock (WORM)**.
- **Snapshot Manager (DLM)** for EBS.

## 4. Database Resilience

### RDS
- **Multi-AZ (Standby)** = sync replica in another AZ, automatic failover (60-120s), **same endpoint**.
- **Multi-AZ Cluster** = 1 writer + 2 readers in 3 AZs (faster failover, MySQL/PostgreSQL).
- **Read Replicas** = async, **read scaling**, can be cross-region (manual promote for DR).
- **Automated backups (1-35 days)** + manual snapshots; **PITR**.

### Aurora
- **6 copies of data across 3 AZs**, self-healing.
- **Aurora Replicas** (up to 15) with **<100ms failover**.
- **Aurora Global Database:** 1 primary region, up to 5 read-only regions, **<1s replication, <1min RPO, ~1min cross-region failover**.
- **Aurora Serverless v2** auto-scales ACUs continuously.

### DynamoDB
- **Multi-AZ regional by default**, single-digit ms.
- **Global Tables:** multi-region, multi-active, eventually consistent.
- **PITR (35 days)** and on-demand backups.
- **DAX** in-memory cache (microseconds).
- **Streams** for change-data-capture.

### ElastiCache
- **Redis:** Multi-AZ with automatic failover, cluster mode for sharding, **Global Datastore** for cross-region.
- **Memcached:** no replication, sharded multi-node.
- **MemoryDB for Redis**: durable Redis with multi-AZ persistence.

## 5. Decoupling for Resilience

| Service | Pattern |
|---|---|
| **SQS** | Buffer + asynchronous; **standard** (at-least-once, unlimited TPS) vs **FIFO** (exactly-once, 300/3000 TPS) |
| **SNS** | Pub-sub fan-out to SQS/Lambda/HTTP/SMS/Email; **FIFO SNS → FIFO SQS**; cross-region with Mobile or message filtering |
| **EventBridge** | Event bus, schema registry, scheduler; integrates 130+ AWS + SaaS sources |
| **Kinesis Data Streams** | Ordered shards, replay (24h-365d), millisecond ingest |
| **Kinesis Firehose** | Managed delivery to S3/Redshift/OpenSearch/3rd-party |
| **MSK (Kafka)** | Managed Kafka, ordering, multi-AZ |
| **Step Functions** | Workflow orchestration, retries, error handling |
| **MQ (ActiveMQ/RabbitMQ)** | Migration of legacy JMS/AMQP |

- **DLQ pattern:** SQS DLQ for failed messages; Lambda destinations on failure.
- **Idempotency:** required for SQS-standard and at-least-once delivery.
- **Visibility timeout** must be ≥ processing time.
- **Long polling (WaitTimeSeconds=20)** to reduce empty receives.

## 6. DNS & Edge for Resilience

### Route 53
- **Routing policies:** Simple, Weighted, Latency, **Failover (with health checks)**, Geolocation, Geoproximity (traffic flow), Multi-Value Answer.
- **Health checks** on endpoints, calculated, or CloudWatch alarm.
- **Active-Active / Active-Passive** with failover policy + multiple regions.
- **Alias records** to AWS resources (ALB, CF, S3, APIGW) — free, point to changing IPs.

### CloudFront
- Global CDN, **400+ POPs**; reduces origin load; **Origin Failover** for primary/secondary origins.
- **OAC** for S3; signed URLs/cookies; **Lambda@Edge** / **CloudFront Functions** for logic.

### Global Accelerator
- 2 anycast **static IPs**, routes via AWS backbone, **fast regional failover (<1 min)**, deterministic IPs for whitelisting.
- Best for **non-HTTP** workloads, gaming, IoT, VoIP.

## 7. Disaster Recovery Strategies

| Strategy | RPO | RTO | Cost | How |
|---|---|---|---|---|
| **Backup & Restore** | Hours | Hours | Lowest | Restore from S3/Backup vault in DR region |
| **Pilot Light** | Minutes | 10s of min | Low | Core data replicating; minimal infra running; scale up on DR |
| **Warm Standby** | Seconds | Minutes | Medium | Scaled-down but live env; scale up on event |
| **Multi-Site Active-Active** | Near-zero | Near-zero | Highest | Both regions serving live traffic; R53 + Global Accelerator |

- **AWS Elastic Disaster Recovery (DRS)**: block-level replication into AWS for pilot-light/warm-standby of physical, VM, or cloud servers.
- **AWS Backup cross-region** for compliance retention.
- **Aurora Global / DynamoDB Global Tables / S3 CRR** for data layer.

## 8. Fault-Tolerance Design Principles

1. **Design for failure** — assume any AZ/instance/AZ can die.
2. **Stateless tiers** behind ASG + ELB; offload state to RDS/DDB/S3/ElastiCache.
3. **Bulkheads:** isolate failures via separate accounts/VPCs/queues.
4. **Loose coupling:** queues/topics instead of direct sync calls.
5. **Idempotency + retries with exponential backoff + jitter**.
6. **Graceful degradation:** circuit breakers, fallback responses (CloudFront cached errors).
7. **Health-checked routing:** R53 + ALB health; remove bad instances/regions automatically.
8. **Practice failover** (Game Days) with Fault Injection Service (FIS).
`;

const RESILIENT_CONCISE = `# Domain 2 — Concise

## HA Building Blocks
- **Always ≥2 AZs**. Region-wide failure → **multi-region**.
- **ASG + ALB across AZs** for stateless web tier.
- **RDS Multi-AZ (sync, same endpoint)** for HA; **Read Replicas (async)** for scale or cross-region DR.
- **Aurora** = 6-way storage replication; **Global DB** for <1s cross-region.
- **DynamoDB Global Tables** = multi-region, multi-active.
- **S3** = 11 9s, multi-AZ default. **CRR** for region failover.
- **EFS** = multi-AZ; **EBS** = single AZ (snapshot to recover).

## Decoupling
- **SQS** to buffer / smooth spikes; FIFO when order matters.
- **SNS** fan-out → multiple SQS subscribers.
- **EventBridge** for event-driven and SaaS integration.
- **Kinesis** for ordered streams w/ replay.
- **Step Functions** for stateful workflows.

## Edge / DNS
- **Route 53 Failover policy + health checks** for regional failover.
- **CloudFront Origin Failover** for origin HA.
- **Global Accelerator** static IPs + fast regional failover for non-HTTP.

## DR Cheat-Sheet
| Strategy | RPO/RTO | Cost |
|---|---|---|
| Backup & Restore | hrs | $ |
| Pilot Light | mins/10s mins | $$ |
| Warm Standby | secs/mins | $$$ |
| Multi-Site Active-Active | ~0 | $$$$ |

## Common HA Patterns
- Stateless EC2 + ASG + ALB + RDS Multi-AZ + S3 + ElastiCache.
- Serverless: APIGW + Lambda + DDB (all multi-AZ by default).
- Pub-sub: SNS → SQS DLQ → Lambda (idempotent).
- Hybrid HA: DX + VPN failover.

## Don't Confuse
- Multi-AZ RDS = HA (no read scaling on standby).
- Read Replica = scale reads, async, can be promoted.
- Aurora Replicas = both HA and read scaling.
- DDB streams ≠ Kinesis Streams (DDB CDC is fixed 24h).
`;

const RESILIENT_EXAM = `# Domain 2 — Exam Prep (rapid recall)

## "Make it HA" Answers by Layer

| Layer | HA mechanism |
|---|---|
| DNS | **Route 53 health check + failover/multi-value** |
| Edge | **CloudFront origin failover / Global Accelerator** |
| LB | **ALB/NLB across AZs (cross-zone if needed)** |
| Compute (EC2) | **ASG ≥2 AZ + ELB health check** |
| Containers | **ECS/EKS multi-AZ service** |
| Serverless | **Lambda (auto multi-AZ)** |
| SQL DB | **RDS Multi-AZ / Aurora cluster** |
| NoSQL DB | **DynamoDB (regional) / Global Tables** |
| Cache | **ElastiCache Redis Multi-AZ + auto failover** |
| Object Store | **S3 (multi-AZ)** + **CRR for region DR** |
| Block Store | **EBS snapshots** (volume itself is single-AZ) |
| File Store | **EFS regional / FSx Multi-AZ** |
| Messaging | **SQS/SNS (multi-AZ regional)** |

## Failover Times (memorize)
- **RDS Multi-AZ:** 60-120s (DNS swap on standby).
- **RDS Multi-AZ Cluster:** <35s.
- **Aurora:** <30s typical, often <10s.
- **DynamoDB Global Tables:** none — multi-active.
- **Global Accelerator:** **<1 minute regional**.
- **Route 53 failover:** ~health check fail (3 × 30s default = 90s).
- **NLB AZ failure:** seconds.

## DR Strategy Picker
- "Cheapest, can tolerate hours RTO" → **Backup & Restore**.
- "Mostly off, scale up in DR" → **Pilot Light**.
- "Always running smaller copy" → **Warm Standby**.
- "Zero downtime, global" → **Multi-Site Active/Active**.

## Storage Durability/Availability Numbers
- S3 Standard: **11 9s** durability, **4 9s** availability.
- S3 One Zone-IA: 11 9s, **3 9s** availability.
- S3 Glacier Deep Archive: 11 9s, restore hrs.
- EBS io2 Block Express: **99.999%** annual durability.
- DynamoDB: 99.999% multi-region (Global Tables).

## SQS Gotchas
- **Max retention:** 14 days.
- **Max message size:** 256 KB (use S3 + extended client for larger).
- **Visibility timeout default 30s**, max 12 hr.
- **Long polling = 20s**.
- **FIFO:** 300 TPS (no batching) / 3000 (with batching); **MessageGroupId** required.

## Lambda Resilience
- Async: 2 retries + DLQ/destinations.
- Sync (APIGW): caller handles.
- Stream sources: retries up to record expiry; configure on-failure destination.
- Use **idempotency token** when invoking again.

## Auto Scaling Triggers
- **Target tracking** = simplest (e.g., 60% CPU).
- **Step** = different scaling for different alarm levels.
- **Scheduled** = predictable traffic.
- **Predictive** = ML-based.

## R53 Routing Policy Picker
- Region by user latency → **Latency**.
- Compliance/geo restriction → **Geolocation**.
- Bias to closer + override → **Geoproximity**.
- HA failover → **Failover + health check**.
- A/B traffic split → **Weighted**.
- Many healthy endpoints → **Multi-Value Answer**.

## Always-Wrong on Resilience Q's
- EBS Multi-Attach for cross-AZ HA (it's same-AZ).
- Single-AZ RDS for prod HA.
- Single NAT GW in one AZ → AZ-failure breaks egress for other AZs.
- Sticky sessions for stateless scaling.
- Storing session state in EC2 local disk.
`;

const RESILIENT_COMPARE = `# Domain 2 — Comparisons & Scenarios

## Side-by-Side Comparisons

### ALB vs NLB vs GWLB
| | ALB | NLB | GWLB |
|---|---|---|---|
| Layer | 7 | 4 | 3/4 |
| Latency | ms | μs | μs |
| Static IP | No (DNS) | **Yes (EIP)** | No |
| WebSocket / HTTP/2 / gRPC | **Yes** | No | No |
| TLS termination | Yes | Yes (pass-through too) | No |
| Targets | EC2/IP/Lambda/ECS | EC2/IP/ALB | Firewall appliances |
| Use | Web apps | Game servers, brokers | NF chain |

### RDS Multi-AZ vs Read Replicas
| | Multi-AZ | Read Replica |
|---|---|---|
| Purpose | **HA** | **Read scale / DR** |
| Replication | Sync | Async |
| Usable for reads | No (standby invisible) | Yes |
| Failover | Automatic | Manual promote |
| Cross-region | Cluster: no / Single-AZ: no | **Yes** |

### Aurora vs RDS
- Aurora: **storage auto-grow 128TB**, 6-way replication, **15 replicas**, Global DB, Serverless v2.
- RDS: traditional engines, simpler, supports Oracle/SQL Server, M-AZ via standby.

### SQS vs SNS vs EventBridge vs Kinesis
| | SQS | SNS | EventBridge | Kinesis Data Streams |
|---|---|---|---|---|
| Pattern | Queue (1 consumer) | Pub-sub fanout | Event bus + rules | Ordered shard stream |
| Persistence | up to 14 days | none | none (Archive add-on) | 24h-365d, replayable |
| Ordering | FIFO opt | FIFO topics | No | **Per-shard** |
| Targets | App pull | SQS/Lambda/HTTP/Email/SMS | 130+ AWS/SaaS targets | Consumers (KCL/Lambda) |
| Use | Decouple workers | Fanout notifications | Event-driven app | Real-time analytics, CDC |

### Step Functions vs Lambda chaining vs SWF
- **Step Functions:** declarative state machine, visual, modern. Pick this.
- **SWF:** legacy; only if "code-based deciders" specifically required.
- **Lambda → Lambda:** OK for ≤3 steps; gets brittle.

### Route 53 vs Global Accelerator vs CloudFront
- **Route 53:** DNS-level routing/failover; affects DNS TTL latency (~60s).
- **Global Accelerator:** TCP/UDP, **2 anycast IPs**, instant failover via backbone, non-HTTP.
- **CloudFront:** HTTP/HTTPS caching CDN at edge; can also do origin failover.

### EBS vs EFS vs FSx vs S3 (resilience lens)
- **EBS** = single-AZ block; snapshot to regional S3 for DR.
- **EFS** = multi-AZ NFS regional.
- **FSx Windows/ONTAP** = Multi-AZ option.
- **S3** = multi-AZ default; CRR for region.

### Backup & Restore vs Pilot Light vs Warm Standby vs Multi-Site
*(see DR table in In-Depth)*

---

## Exam Scenarios

### R1 — "Web app must survive AZ failure with no downtime."
**Answer:** ALB across ≥2 AZs → ASG ≥2 AZs → **RDS Multi-AZ** → **ElastiCache Multi-AZ** → S3 for assets. NAT GW per AZ.

### R2 — "Survive entire region outage with RTO < 1 hour, RPO < 5 min, moderate budget."
**Answer:** **Warm Standby** in DR region: Aurora Global DB (read replica) or DynamoDB Global Tables, ASG min=1 in DR scaled up on failover, **Route 53 failover** to DR ALB, S3 CRR.

### R3 — "Spiky traffic burns out the backend during sales."
**Answer:** Insert **SQS** between API and workers; **ASG scales on queue depth**; SNS for fan-out; CloudFront caches.

### R4 — "Static IPs required for partners and fast multi-region failover for TCP service."
**Answer:** **Global Accelerator** → regional NLBs in 2 regions.

### R5 — "Replace tape backups with WORM compliance retention."
**Answer:** **AWS Backup** with cross-region copy + **Backup Vault Lock (Compliance mode)**.

### R6 — "Lambda async processing fails sometimes; messages get lost."
**Answer:** Configure **DLQ (SQS)** + **on-failure destination**; add idempotency.

### R7 — "MySQL DB must scale reads globally."
**Answer:** **Aurora Global Database** (read replicas in 5 regions, <1s lag).

### R8 — "Cross-region active/active e-commerce app."
**Answer:** **Route 53 latency routing** + **DynamoDB Global Tables** + **S3 CRR** + **Aurora Global DB (writer forwarding)** + **Global Accelerator** for static IPs.

### R9 — "Failover DB password / connections automatically."
**Answer:** **RDS Proxy** in front of RDS to pool & survive failovers; Secrets Manager for creds.

### R10 — "Stateless app stores user sessions on EC2 disk."
**Answer:** Externalize sessions to **ElastiCache Redis** or **DynamoDB**.

### R11 — "Long-running batch with retries, branching, and parallelism."
**Answer:** **Step Functions** (Standard) orchestrating Lambda/ECS.

### R12 — "FIFO queue must guarantee one consumer per order group."
**Answer:** **SQS FIFO** with **MessageGroupId**; consumers respect group locking.

### R13 — "Game backend latency-sensitive UDP across globe."
**Answer:** **Global Accelerator + NLB(UDP)** + GameLift (if game-specific).

### R14 — "On-prem app must continue if AWS region fails."
**Answer:** **Active-Active** with secondary AWS region + **DX + VPN backup** + Route 53 failover. Data: Aurora Global or DDB Global.

### R15 — "EBS volume must survive AZ outage."
**Answer:** Not possible in place — **regular snapshots to S3** (regional) and recreate volume in another AZ. For databases use Multi-AZ/Aurora.

### R16 — "Test resilience hypotheses safely."
**Answer:** **AWS Fault Injection Service (FIS)** — controlled chaos experiments.
`;

/* ──────────────────────────────────────────────────────────────────────
   DOMAIN 3 — DESIGN HIGH-PERFORMING ARCHITECTURES (24%)
   ────────────────────────────────────────────────────────────────────── */

const PERF_IN_DEPTH = `# Domain 3 — Design High-Performing Architectures (24%)

> Performance = right compute type + right storage I/O profile + right DB + caching +
> edge delivery + concurrency model + monitoring.

## 1. Compute Performance

### EC2 Sizing & Families
| Family | Hint |
|---|---|
| **General (T, M)** | Burstable / balanced |
| **Compute (C)** | High CPU per $; HPC, batch, encoders |
| **Memory (R, X, z1d)** | In-memory DBs, caches, real-time big data |
| **Storage (I, D, H)** | NVMe local SSD / dense HDD; **I = high IOPS**, **D = HDFS** |
| **Accel. compute (P, G, Inf, Trn, F)** | GPU/ML/inference; F = FPGA |
| **HPC (Hpc7, Hpc6id)** | Tightly coupled HPC + EFA |

- **Placement Groups:**
  - **Cluster** — same rack, **highest network throughput**, **same AZ**.
  - **Spread** — separate racks (up to 7 per AZ), HA.
  - **Partition** — logical partitions (HDFS/Kafka/Cassandra).
- **EFA** (Elastic Fabric Adapter) for HPC/ML (OS-bypass).
- **Enhanced networking** (ENA, SR-IOV) for high PPS.
- **Hibernate** to fast-restart; **dedicated host/instance** for licensing/isolation.
- **Capacity Reservations / On-Demand Capacity Reservations** to guarantee availability.

### Auto Scaling for Performance
- **Target tracking** keeps a metric (CPU/RequestCountPerTarget) at target.
- **Predictive scaling** for cyclical traffic.
- **Step scaling** for spikes with tiered alarms.

### Serverless & Containers
- **Lambda:** 10 GB memory, 6 vCPU, 15-min max; **CPU scales with memory**; use **provisioned concurrency** to remove cold starts.
- **Lambda SnapStart** for Java/Python/.NET → ~10x faster cold starts.
- **Fargate:** size CPU/memory per task; supports **ephemeral storage to 200 GB**, **Graviton**.
- **EKS / ECS:** use **Karpenter** or cluster autoscaler; **Spot** for batch.

## 2. Storage Performance

### EBS Volume Types
| Type | IOPS | Throughput | Use |
|---|---|---|---|
| **gp3** | up to 16,000 | 1,000 MB/s | Default; balanced |
| **gp2** | 3 IOPS/GB to 16k | 250 MB/s | Legacy |
| **io2 / io2 Block Express** | 64k / **256k** | 1k / **4k MB/s** | Highest perf, SAP/HANA, Oracle |
| **st1** | 500 | 500 MB/s | Big data/log streaming (HDD) |
| **sc1** | 250 | 250 MB/s | Cold HDD |
- **Burst** behavior on gp2 (credits). **gp3 = predictable, decoupled IOPS/throughput**.
- **RAID 0** for combining IOPS (no redundancy); EBS encryption is free.

### Instance Store
- **NVMe local SSD**, **millions IOPS, μs latency**, **ephemeral**. Use for caches, scratch, shuffle.

### EFS Throughput Modes
- **Bursting** (default).
- **Provisioned throughput** (specify MB/s).
- **Elastic** (auto-scales, pay-per-use). **General-Purpose** vs **Max I/O** (higher latency, parallel).

### FSx for Lustre
- **Sub-ms latency**, **100s GB/s throughput**, HPC/ML, S3 linkage.

### S3 Performance
- **Multipart upload (>100 MB)**, **byte-range fetch** parallelism.
- **Transfer Acceleration** via CloudFront edges.
- **5,500 GET / 3,500 PUT per prefix per sec** (use many prefixes to scale).
- **Express One Zone** = single-digit ms, single-AZ, very high RPS.

## 3. Database Performance

### RDS / Aurora
- Vertical scale (instance class). Horizontal: **Read Replicas** (15 in Aurora).
- **Aurora Auto Scaling** for replica count.
- **RDS Proxy** for connection pooling.
- **Performance Insights** + **Enhanced Monitoring** for diagnosis.
- **Aurora Serverless v2** auto-scales ACUs in sub-second.

### DynamoDB
- **On-demand** vs **Provisioned (with Auto Scaling)**.
- **WCU/RCU** sizing; **adaptive capacity** handles hot partitions.
- **Strong vs Eventually consistent reads**.
- **DAX** in-memory accelerator (microseconds).
- **GSI/LSI** for query patterns; partition design critical.

### ElastiCache
- **Redis** (rich data, persistence, replication, cluster mode for sharding).
- **Memcached** (multi-threaded, sharded, no persistence).
- Caching patterns: **Lazy Loading**, **Write-Through**, **TTL**.
- **Sub-millisecond** reads.

### Redshift & Analytics
- **Redshift RA3** with managed storage; **AQUA** for analytics acceleration; **Concurrency Scaling** for spikes.
- **Athena** + **partitioned, columnar Parquet/ORC** for huge speedups; **Glue catalog**.
- **OpenSearch** for search/log analytics; UltraWarm/Cold for cheap storage.

## 4. Network Performance

- **Enhanced networking (ENA up to 200 Gbps; EFA for HPC)**.
- **Placement Group: Cluster** for tightly coupled.
- **VPC peering / TGW** stays on AWS backbone — high throughput.
- **CloudFront** caches at edge → reduces origin RTT.
- **Route 53 Latency-based** routing for closest healthy region.
- **Global Accelerator** routes via AWS backbone — lower jitter than internet.
- **Direct Connect** for predictable low-latency hybrid.

## 5. Caching Layers

| Layer | Tool |
|---|---|
| Browser/edge | **CloudFront / API GW caching** |
| App tier | **ElastiCache (Redis/Memcached)** |
| DB | **DAX (DDB)**, **RDS read replicas**, query cache |
| Compute | **Lambda extension cache**, ephemeral disk |

## 6. Decoupling for Performance

- **SQS** to absorb spikes; consumer scales on queue depth.
- **Kinesis** for parallel real-time consumers.
- **EventBridge Pipes** for low-glue event flows.

## 7. Monitoring & Profiling

- **CloudWatch metrics + dashboards + Contributor Insights**.
- **CloudWatch Synthetics** for canaries.
- **X-Ray** distributed tracing.
- **CloudWatch RUM** for real-user front-end metrics.
- **CodeGuru Profiler** for Java/Python perf bottlenecks.
- **AWS Compute Optimizer** for right-sizing recommendations.

## 8. Design Principles

1. **Right tool for the job** (don't put time-series in RDS).
2. **Scale horizontally** stateless tiers; vertical only when forced.
3. **Cache aggressively** — closest to user wins.
4. **Async + decoupled** for spike absorption.
5. **Push computation to data** (Athena, Glue) instead of moving data.
6. **Choose Graviton** for ~20-40% better price/perf where supported.
7. **Measure before optimizing** (Performance Insights, X-Ray).
`;

const PERF_CONCISE = `# Domain 3 — Concise

## Compute
- Choose family: T/M general, C compute, R memory, I storage, P/G GPU/ML, Hpc HPC.
- **Cluster placement group** for low-latency.
- **EFA** for HPC/ML inter-node.
- **Graviton** = better price/perf where compatible.
- ASG: **target tracking** is default; **predictive** for cyclical.

## Storage
- **gp3** = default EBS (cheaper + tunable IOPS/throughput than gp2).
- **io2 Block Express** = max IOPS / throughput.
- **Instance store NVMe** = highest IOPS, ephemeral.
- **EFS** modes: Bursting / Provisioned / Elastic.
- **FSx Lustre** = HPC/ML scratch.
- **S3**: multipart, byte-range, **3.5k PUT / 5.5k GET per prefix**; Transfer Accel for distant clients.

## Database
- **DAX** = DDB μs cache.
- **Aurora Replicas (15) / Aurora Serverless v2** for elastic SQL.
- **RDS Proxy** for connection pooling (Lambda).
- **ElastiCache Redis** for sub-ms reads.
- **Redshift RA3 + Concurrency Scaling** for warehouse.
- **Athena**: partition + Parquet for speed/cost.

## Network/Edge
- **CloudFront** + caching + Origin Shield.
- **Global Accelerator** for non-HTTP perf + failover.
- **R53 latency policy** for closest region.
- **VPC Endpoints** keep traffic on backbone.

## Monitoring
- **Compute Optimizer** = right-size.
- **X-Ray / RUM / Synthetics / CodeGuru** for app perf.

## Common Pitfalls
- gp2 with constant bursting → switch to gp3.
- DDB hot partition → review partition key / DAX.
- High Lambda cold start → provisioned concurrency / SnapStart.
- Single read replica → scale to multiple.
- Single NAT GW → throughput cap; use per-AZ.
`;

const PERF_EXAM = `# Domain 3 — Exam Prep (rapid recall)

## "Pick the fastest" by Scenario

| Need | Pick |
|---|---|
| Sub-ms key-value reads | **ElastiCache Redis / DAX** |
| Microsec block storage | **Instance Store NVMe** |
| Max single-volume IOPS | **io2 Block Express** |
| Default EBS (cheap + perf) | **gp3** |
| HPC parallel FS | **FSx for Lustre** |
| Tightly coupled HPC EC2 | **Cluster placement group + EFA** |
| Spread risk across racks | **Spread placement** |
| Big-data partitioned (HDFS) | **Partition placement** |
| Reduce SQL DB load | **Read replicas + ElastiCache** |
| Lambda DB conn storms | **RDS Proxy** |
| Java Lambda cold start | **SnapStart / Provisioned Concurrency** |
| Global low-latency static content | **CloudFront** |
| Global low-latency TCP/UDP | **Global Accelerator** |
| Query S3 with SQL fastest | **Athena on Parquet + partitions** |
| Petabyte warehouse spikes | **Redshift + Concurrency Scaling** |
| Time series | **Timestream** |
| Graph | **Neptune** |
| Ledger immutability | **QLDB** |
| Wide-column | **Keyspaces** |
| Real-time stream analytics | **Kinesis Data Streams + Analytics (Managed Flink)** |
| ETL on schema | **Glue (serverless Spark)** |
| Hadoop/Spark big jobs | **EMR** |
| Search/log analytics | **OpenSearch** |
| Lots of small files | **S3 + many prefixes / FSx for OpenZFS** |
| Faster S3 uploads from far | **Transfer Acceleration** |
| Fastest from on-prem to S3 | **DataSync / Snowball Edge for PBs** |

## EBS Numbers (memorize)
- gp3: 3,000-16,000 IOPS; 125-1,000 MB/s.
- io2 Block Express: 256,000 IOPS; 4,000 MB/s; 64 TiB.
- st1: 500 IOPS / 500 MB/s.
- Max EBS-instance throughput depends on EC2 type (e.g., Nitro 80 Gbps).

## S3 Throughput Numbers
- **3,500 PUT/COPY/POST/DELETE** and **5,500 GET/HEAD per prefix per second**.
- **Multipart upload** recommended for objects > 100 MB; required >5 GB.
- **Max object size: 5 TB**.

## DynamoDB
- 1 WCU = 1 KB write/sec; 1 RCU = 4 KB strong read/sec (or 2 eventually consistent).
- Item size max 400 KB.
- DAX read cache = μs; reduces RCU.
- Use **on-demand** for unpredictable; **provisioned + auto scale** when known.

## Lambda
- Memory 128 MB - 10,240 MB; CPU scales with memory.
- Timeout max 15 min; payload sync 6 MB / async 256 KB.
- Concurrency = 1000 per region default (raise via quota).
- Provisioned concurrency = no cold start; pre-warmed.
- SnapStart = Java/Python/.NET cold start cut up to 10x.

## CloudFront Performance
- **Cache by viewer query string/headers/cookies** (CloudFront policies).
- **Origin Shield** = additional caching layer reduces origin load.
- **Lambda@Edge** vs **CloudFront Functions**: Functions are faster, JS-only, ≤1ms; Lambda@Edge supports more runtimes/longer logic.

## Always Wrong on Perf Q's
- gp2 for high IOPS (use gp3/io2).
- Single EFS Bursting mode for sustained high throughput (use Provisioned/Elastic).
- Single-AZ NAT for high egress workload (per-AZ for throughput too).
- DDB scan for analytic — should be GSI/Athena.
- RDS with hundreds of Lambda connections (need RDS Proxy).
`;

const PERF_COMPARE = `# Domain 3 — Comparisons & Scenarios

## Side-by-Side Comparisons

### EBS Volume Types
*(see In-Depth table)*

### EFS vs FSx vs S3 vs EBS (perf lens)
| | EFS | FSx Lustre | S3 | EBS |
|---|---|---|---|---|
| Protocol | NFS | POSIX (Lustre) | HTTPS | Block |
| Latency | low ms | **sub-ms** | tens of ms | sub-ms |
| Throughput | up to 20+ GB/s | 100s GB/s | very high parallel | bound by instance |
| Concurrency | multi-attach (NFS clients) | massive parallel | unlimited | single-AZ multi-attach io1/2 |
| Use | shared Linux files | HPC / ML / video | object | DB / boot |

### DynamoDB vs RDS vs Aurora vs ElastiCache (perf)
| | DDB | RDS | Aurora | ElastiCache |
|---|---|---|---|---|
| Latency | single-digit ms | ms | ms | **sub-ms** |
| Scale | massive horizontal | vertical + RR | vertical + 15 RR + serverless | horizontal sharding |
| Schema | NoSQL | SQL | SQL | KV |
| Cache wrapper | DAX | RR + ElastiCache | RR + ElastiCache | n/a |

### Kinesis Data Streams vs MSK vs SQS
- **Kinesis** = managed shards, replay, AWS-native.
- **MSK** = managed Kafka, OSS API, fine partition control.
- **SQS** = queue (not stream); not for ordered analytics.

### CloudFront vs Global Accelerator vs Route 53
*(perf focus)*
- **CloudFront** = caches HTTP at edge.
- **GA** = TCP/UDP path optimization, static IPs.
- **R53** = DNS routing (no path optimization).

### Athena vs Redshift vs EMR
| | Athena | Redshift | EMR |
|---|---|---|---|
| Type | Serverless SQL on S3 | MPP DW | Hadoop/Spark |
| Latency | secs-mins | secs | mins |
| Setup | None | Cluster | Cluster |
| Best for | Ad-hoc queries on S3 | BI / reports | Big-data ETL/ML |

### Spot vs On-Demand vs RI/SP (perf availability)
- **Spot:** 90% off, can be interrupted; great for stateless batch.
- **On-Demand:** any time, full price.
- **RI/Savings Plans:** discount with commitment.

---

## Exam Scenarios

### P1 — "Application latency from Europe is high."
**Answer:** Deploy a region in EU + **Route 53 latency routing** OR front with **CloudFront/Global Accelerator** to use AWS backbone.

### P2 — "DDB table has hot partition reads."
**Answer:** Add **DAX** for read caching; review **partition key** distribution; consider **GSI** for alternate access pattern.

### P3 — "RDS overwhelmed with read traffic."
**Answer:** Add **Read Replicas**; route reads to replicas; add **ElastiCache** in front.

### P4 — "Reports on 10 TB in S3 take hours in RDS."
**Answer:** Move to **Athena** with **Parquet + partitions**, or **Redshift Spectrum**.

### P5 — "Lambda invocations stall opening DB connections."
**Answer:** **RDS Proxy** for connection pooling.

### P6 — "Need 200,000 IOPS for a single database volume."
**Answer:** **io2 Block Express** (up to 256,000 IOPS).

### P7 — "HPC simulation across 100 nodes."
**Answer:** **Cluster placement group + EFA + FSx for Lustre + Hpc-class instances**.

### P8 — "Cold starts hurt Java Lambda."
**Answer:** **Provisioned Concurrency** or **SnapStart**.

### P9 — "Global video catalog must load fast for users worldwide."
**Answer:** **S3 + CloudFront + Lambda@Edge / CF Functions** for personalization at edge; **Origin Shield** for cache offload.

### P10 — "Ingest 1 million events/sec, replayable, ordered per device."
**Answer:** **Kinesis Data Streams** (shards keyed by device id) + KCL/Lambda consumers; Firehose to S3 for archive.

### P11 — "DDB writes throttled by hot key."
**Answer:** Use **write sharding** (append suffix), enable **on-demand**, review key design.

### P12 — "Run Spark on petabytes of S3."
**Answer:** **EMR with Spot Task nodes + S3 + Glue catalog**, or **Athena for SQL**.

### P13 — "Need to query streaming data with SQL in seconds."
**Answer:** **Managed Service for Apache Flink (Kinesis Data Analytics)** over Kinesis stream.

### P14 — "Reduce ELB latency for 10M concurrent connections."
**Answer:** **NLB** (handles millions of connections, μs latency, static IPs).

### P15 — "Optimize EC2 cost & perf for changing workload."
**Answer:** **Compute Optimizer + Graviton + Auto Scaling + Savings Plans**.

### P16 — "Per-prefix S3 throughput limit hit during high-rate writes."
**Answer:** Distribute writes across many key prefixes (hash prefix), use **multipart**, enable **Transfer Acceleration** if cross-region clients.

### P17 — "Frequent dataset uploads from on-prem datacenter to S3 are slow."
**Answer:** **DataSync** for ongoing; **Snowball Edge / Snowmobile** for huge one-shot; **Direct Connect + S3 endpoint** for sustained high throughput.

### P18 — "Real-time leaderboard requires sub-ms reads."
**Answer:** **ElastiCache Redis** with **sorted sets**; DDB+DAX as alternative.
`;

/* ──────────────────────────────────────────────────────────────────────
   DOMAIN 4 — DESIGN COST-OPTIMIZED ARCHITECTURES (20%)
   ────────────────────────────────────────────────────────────────────── */

const COST_IN_DEPTH = `# Domain 4 — Design Cost-Optimized Architectures (20%)

> Match capacity to demand, pick the cheapest tier that meets SLO, automate cleanup,
> measure with **Cost Explorer / Budgets / CUR**, and use **Savings Plans / RIs / Spot**.

## 1. Compute Cost Levers

### Purchase Options
| Option | Discount | Constraint |
|---|---|---|
| **On-Demand** | 0 | None |
| **Spot** | up to **90%** | Can interrupt 2-min notice; stateless, fault-tolerant |
| **Reserved Instance (RI)** | up to 72% | 1- or 3-yr commit; instance attributes |
| **Compute Savings Plans** | up to 66% | 1/3 yr commit on $/hr; flexible across EC2/Fargate/Lambda/region/family |
| **EC2 Instance Savings Plans** | up to 72% | 1/3 yr; family + region |
| **Dedicated Host / Reservation** | varies | Licensing isolation |

- **Spot Fleet / EC2 Fleet / Mixed Instances ASG**: combine On-Demand + Spot + RIs.
- **Capacity Rebalancing** in ASG for Spot interruption resilience.
- **Convertible RI** can change family/OS/tenancy; less discount than Standard.

### Right-Sizing & Automation
- **AWS Compute Optimizer** for EC2/EBS/Lambda/ECS/ASG recommendations.
- **Trusted Advisor** flags idle instances, low-utilization, unused EIPs/EBS, etc.
- **EC2 Instance Scheduler** to stop dev/test off-hours.
- **Auto Scaling** to scale in during low demand.

### Serverless = Cost Optimization
- **Lambda** = pay per ms × memory; idle = free.
- **Fargate Spot** = up to 70% off.
- **Step Functions Express** for high-volume short workflows (cheaper than Standard).
- **DynamoDB On-Demand** for spiky; **provisioned** for steady.

## 2. Storage Cost Optimization

### S3 Storage Classes
| Class | Cost | Retrieval | Use |
|---|---|---|---|
| **Standard** | $$$ | ms | Hot |
| **Intelligent-Tiering** | auto | ms-hrs | Unknown patterns — **default if unsure** |
| **Standard-IA** | $$ | ms (per-GB retrieve fee) | Infrequent ≥30d |
| **One Zone-IA** | $ | ms | Non-critical IA, single AZ |
| **Glacier Instant Retrieval** | $ | ms | Quarterly access |
| **Glacier Flexible Retrieval** | ¢ | min-hrs | Archive needing rare reads |
| **Glacier Deep Archive** | ¢ (lowest) | hrs | 7-10 yr retention |
- **Lifecycle policies** to transition / expire.
- **S3 Storage Lens** for org-wide visibility & savings.
- **Requester Pays** for shared bucket cost shifting.
- **Multi-Part upload cleanup** lifecycle rule (orphans cost!).

### EBS / EFS / FSx
- **EBS gp2 → gp3**: ~20% cheaper at equal/better perf; conversion online.
- **Delete unattached EBS volumes & unused snapshots** (DLM lifecycle).
- **EFS lifecycle to IA / Archive** for cold files.
- **FSx**: choose right deployment (Single-AZ for non-critical), use compression on ONTAP.

### Data Transfer
- **Inter-AZ traffic costs**; intra-AZ free **only via private IPs**.
- **NAT GW** = $$ per GB processed; use **VPC Endpoints** instead.
- **CloudFront cheaper than S3 egress** for high outbound to internet.
- **Direct Connect** lowers per-GB egress for sustained large transfers.

## 3. Database Cost Optimization

- **RDS Reserved Instances** (up to 69%).
- **Aurora Serverless v2** scales to fractional ACUs, cheap for spiky/dev.
- **Stop RDS** (up to 7 days) for non-prod.
- **DynamoDB on-demand vs provisioned**: provisioned + Auto Scaling almost always cheaper if you can model traffic; **DDB Standard-IA** for cold tables (60% cheaper storage).
- **ElastiCache RIs** available.
- **Redshift**: pause clusters, use **RA3 managed storage** (decoupled), Spectrum to avoid loading.

## 4. Network Cost Optimization

- **VPC Gateway Endpoints** (S3, DDB) — **free** + saves NAT.
- **VPC Interface Endpoint** — paid per ENI + GB, but cheaper than NAT egress for AWS APIs.
- **Replace NAT GW** for AWS-service-only traffic with endpoints.
- **CloudFront** to reduce S3/EC2 egress; data transfer "in" is free.
- **PrivateLink** for SaaS traffic stays on AWS network.
- **Same-AZ** when possible to avoid cross-AZ data charges.

## 5. Visibility & Governance

- **AWS Cost Explorer** — visualize cost & forecast; **Rightsizing recommendations**.
- **AWS Budgets** — alerts at $/usage thresholds; can trigger SNS/Action.
- **Cost & Usage Report (CUR)** → S3 → Athena/QuickSight.
- **Cost Allocation Tags** (activate user-defined + AWS-generated).
- **AWS Organizations Consolidated Billing** — shared volume discounts, RI/SP sharing.
- **AWS Pricing Calculator** for what-if before deploy.
- **Cost Categories** for grouping.
- **Compute Optimizer** for EC2/EBS/Lambda recommendations.

## 6. Lifecycle & Auto-Cleanup

- **S3 Lifecycle** for transitions + expirations.
- **DLM** for EBS snapshot lifecycle.
- **CloudWatch Logs retention** (default = never!).
- **AWS Backup lifecycle to cold storage**.
- **EventBridge Scheduler** for stop/start dev environments.
- **Service Quotas + Budgets Actions** to enforce.

## 7. Architectural Patterns Saving Money

1. **Move static assets to S3 + CloudFront** instead of serving from EC2.
2. **Replace cron EC2 with Lambda + EventBridge Scheduler**.
3. **Use SQS** to flatten spikes → smaller steady fleet.
4. **Spot Fleet for batch** (ML, encoding, CI).
5. **Multi-tier storage**: hot → Standard, warm → IA, cold → Glacier.
6. **Serverless data lake**: S3 + Glue + Athena + QuickSight (no clusters running).
7. **Right-size DBs**: shrink instance + scale via RR or Aurora Serverless.
8. **Compress + columnar** in S3 cuts Athena and Glacier costs.
9. **Use Graviton** where compatible (~20% cheaper).
10. **CloudFront + caching** to reduce origin compute and egress.
`;

const COST_CONCISE = `# Domain 4 — Concise

## Compute
- Steady → **Savings Plans / RIs**.
- Spiky/fault-tolerant → **Spot / Fargate Spot**.
- Idle workload → **Lambda / Aurora Serverless**.
- Dev/test → **schedule stop/start**.
- Use **Graviton** when supported.

## Storage
- Unknown access → **S3 Intelligent-Tiering**.
- Archive long-term → **Glacier Deep Archive**.
- Convert **gp2 → gp3**.
- **Lifecycle rules** for transitions & expirations.
- Delete orphans: snapshots, multipart uploads, unattached EBS.

## Network
- **Gateway endpoints (S3/DDB) free** — avoid NAT charges.
- **CloudFront** for high egress to internet.
- Same-AZ private IPs free; cross-AZ ¢/GB.

## Database
- **Aurora Serverless v2** for variable load.
- **DDB provisioned + auto-scale** when traffic modelled.
- Pause Redshift, stop RDS (≤7 days).

## Visibility
- **Cost Explorer + Budgets + CUR + Tags**.
- **Compute Optimizer + Trusted Advisor** to right-size.
- **Storage Lens** for S3.

## Common wastes
- Idle EC2 / oversized instances.
- Old EBS snapshots, unattached volumes.
- Unused EIPs ($0.005/hr).
- NAT GW egress for AWS APIs (use endpoints).
- Cross-region/cross-AZ chatter.
- CloudWatch Logs without retention.
`;

const COST_EXAM = `# Domain 4 — Exam Prep (rapid recall)

## Pick the cheapest that meets SLO

| Workload | Pick |
|---|---|
| Steady 24×7 prod EC2 | **Compute SP or RI 3-yr** |
| Bursty short jobs | **Lambda / Fargate Spot** |
| Stateless web batch | **Spot Fleet / Mixed ASG** |
| Dev/test that idles nights | **Instance Scheduler / stop** |
| Unknown S3 access pattern | **Intelligent-Tiering** |
| Cold archive | **Glacier Deep Archive** |
| One-time PB transfer | **Snowball Edge / Snowmobile** |
| Big outbound to internet | **CloudFront** |
| AWS API traffic from VPC | **VPC Endpoints** (avoid NAT) |
| Cross-region replica needed only for DR | **Pilot Light / Backup & Restore** |
| Spiky DB | **Aurora Serverless v2 / DDB On-Demand** |
| BI on S3 ad-hoc | **Athena over Parquet** |
| Logs cheap analytics | **OpenSearch UltraWarm/Cold** |
| Many low-tps queues | **SQS Standard** |

## Discounts Memorize
- Spot up to **90%**.
- Standard RI 3-yr All Upfront up to **72%**.
- Convertible RI up to **66%**.
- Compute Savings Plans up to **66%**.
- EC2 Instance SP up to **72%**.
- Fargate Spot up to **70%**.
- S3 Glacier Deep Archive ~**$0.00099/GB-mo** (lowest).

## RI vs Savings Plan Tie-Break
- Need to change EC2 family/region across the term → **Compute SP**.
- Need RDS/ElastiCache/Redshift discount → **RI** (SP doesn't cover them).
- Need exchange ability → **Convertible RI**.

## "Free" Things
- Data in to AWS (most).
- Same-AZ private-IP traffic.
- VPC Gateway Endpoints for S3/DDB.
- CloudFront → S3 (origin fetches in same region: free).
- Up to 100 GB/mo CloudFront free tier (perpetual).
- AWS-managed KMS keys (charges only for usage).

## Always-Wrong Cost Answers
- Provision more capacity for spikes → use **scaling / serverless**.
- Choose **One Zone-IA** for critical data.
- Static IPs via EC2 nodes instead of NLB EIPs.
- Use **NAT GW** to access S3 — endpoints are free.
- Keep EBS snapshots forever without DLM.
- Egress through public internet when DX/CF is option for big volume.
`;

const COST_COMPARE = `# Domain 4 — Comparisons & Scenarios

## Side-by-Side Comparisons

### Spot vs Reserved vs Savings Plans
| | Spot | RI Std | RI Conv | Compute SP | EC2 Inst SP |
|---|---|---|---|---|---|
| Discount | up to 90% | up to 72% | up to 66% | up to 66% | up to 72% |
| Commit | none | 1/3 yr | 1/3 yr | 1/3 yr | 1/3 yr |
| Flexibility | runtime only | low | medium (exchange) | **high (family/region/Fargate/Lambda)** | family + region |
| Interruption | yes (2-min) | no | no | no | no |
| Best for | stateless batch | steady prod, specific instance | might change family | mixed compute portfolio | predictable EC2 family |

### S3 Storage Class Cost Tradeoffs
| Class | Storage $ | Retrieval | Min duration |
|---|---|---|---|
| Standard | $$$ | none | none |
| Intelligent-Tiering | auto | none (small monitoring fee) | none |
| Standard-IA | $$ | per-GB | 30 days |
| One Zone-IA | $ | per-GB | 30 days |
| Glacier Instant | $ | per-GB | 90 days |
| Glacier Flexible | ¢ | per-GB + req | 90 days |
| Glacier Deep | ¢ (cheapest) | per-GB + req | 180 days |

### gp2 vs gp3
- gp3 = ~20% cheaper, decoupled IOPS/throughput, baseline 3000 IOPS / 125 MB/s included.

### NAT GW vs VPC Endpoints
- NAT GW = $0.045/hr per AZ + $0.045/GB processed.
- Gateway Endpoint (S3/DDB) = **free**.
- Interface Endpoint = $0.01/hr per ENI per AZ + $0.01/GB; still beats NAT for high-volume AWS API traffic.

### Aurora Serverless v2 vs Provisioned
- Serverless v2: ACUs scale per-second; pay only for used ACUs; great for spiky/dev.
- Provisioned: cheaper for steady, predictable load.

### DynamoDB On-Demand vs Provisioned
- On-Demand: pay-per-request, no capacity planning, **better for unpredictable**.
- Provisioned + Auto Scaling: cheaper when traffic predictable.

### CloudFront vs Direct Egress
- CloudFront cheaper per GB above ~10 TB/mo and free origin pulls from same-region S3.
- Plus reduces origin compute load.

---

## Exam Scenarios

### C1 — "Batch processing every night, can tolerate interruption."
**Answer:** **Spot Fleet** (or Fargate Spot for containers) with diverse instance types + **EventBridge Scheduler** to launch.

### C2 — "S3 bucket with unpredictable access patterns growing rapidly."
**Answer:** **S3 Intelligent-Tiering** as default class + Lifecycle to **Glacier Deep Archive** after 1 year.

### C3 — "Reduce cost of high outbound traffic from EC2 to internet."
**Answer:** Front origin with **CloudFront**; turn on **Origin Shield**; consider **Global Accelerator** if non-HTTP.

### C4 — "Lots of NAT Gateway charges for S3 traffic."
**Answer:** **S3 Gateway Endpoint** — free + bypass NAT.

### C5 — "Dev environments running 24×7."
**Answer:** **EC2 / RDS Instance Scheduler** to stop nights/weekends; tag-based automation.

### C6 — "EBS snapshots from 2 years ago piling up."
**Answer:** **Data Lifecycle Manager (DLM)** to age out + **Recycle Bin** for accidental deletion safety.

### C7 — "EC2 RIs were purchased but workload changed family."
**Answer:** **Convertible RIs** (exchange) or modernize with **Compute Savings Plans** which are family-flexible.

### C8 — "BI team wants to query 100 TB in S3 occasionally."
**Answer:** **Athena** over **Parquet/Partitioned** data — pay per TB scanned; no cluster.

### C9 — "Lambda invoked 10/min for a small DB lookup."
**Answer:** Keep serverless; consider **DAX or DDB** to reduce DB; check Provisioned Concurrency only if latency matters.

### C10 — "RDS instance very large but only used few hours/day."
**Answer:** Migrate to **Aurora Serverless v2** to scale down to fractional ACUs.

### C11 — "Multi-account org wants centralized cost visibility."
**Answer:** **AWS Organizations** + **Consolidated billing** + **CUR to S3** + **QuickSight dashboards**; **Cost Categories** for grouping; **AWS Budgets** alerts.

### C12 — "Picture website serves global users; bills high on EC2."
**Answer:** Move statics to **S3 + CloudFront**; size EC2 down; use Lambda@Edge for dynamic personalization.

### C13 — "Backup compliance 7 years, rarely read."
**Answer:** **S3 Glacier Deep Archive** + **Vault Lock** for WORM; lifecycle from active class.

### C14 — "Logs in CloudWatch Logs costing too much."
**Answer:** Set **log retention**, **export to S3 + lifecycle to Glacier**, use **subscription filter** to drop noise, or use **OpenSearch with UltraWarm** for analytics.

### C15 — "App in 2 regions needs cheaper inter-region data."
**Answer:** Compress data; use **VPC peering** (still charged) or **DX cross-connect**; consider **architecture redesign** to keep data regional.

### C16 — "Want to enforce shutdown when monthly budget exceeded."
**Answer:** **AWS Budgets** with **Budget Action** to stop EC2/RDS or apply IAM deny SCP.

### C17 — "Many small files in S3 inflating request costs."
**Answer:** Aggregate objects (Athena will be slow too with small files); consider **S3 Batch Operations**, or store in DynamoDB if KV access pattern.

### C18 — "ML training jobs once a week."
**Answer:** **SageMaker Training with Spot (Managed Spot Training)** + checkpointing — up to 90% off.
`;

/* ──────────────────────────────────────────────────────────────────────
   DOMAIN REGISTRY
   ────────────────────────────────────────────────────────────────────── */

const VARIANTS = (
  inDepth: string,
  concise: string,
  exam: string,
  compare: string,
): DomainVariant[] => [
  {
    kind: "in-depth",
    label: "In-Depth",
    hint: "Comprehensive consolidated notes",
    content: inDepth,
  },
  {
    kind: "concise",
    label: "Concise",
    hint: "Tight summary, no fluff",
    content: concise,
  },
  {
    kind: "exam",
    label: "Exam Prep",
    hint: "Rapid recall + memory hooks",
    content: exam,
  },
  {
    kind: "compare",
    label: "Comparisons & Scenarios",
    hint: "Side-by-side + question scenarios",
    content: compare,
  },
];

export const DOMAINS: Domain[] = [
  {
    id: "secure",
    number: "1",
    title: "Design Secure Architectures",
    weightPct: 30,
    emoji: "🛡️",
    blurb:
      "IAM, network isolation, data protection (at-rest/in-transit), edge controls, detection, governance.",
    keyServices: [
      "IAM",
      "KMS",
      "WAF",
      "Shield",
      "GuardDuty",
      "Macie",
      "VPC Endpoints",
      "Secrets Manager",
      "Organizations",
    ],
    variants: VARIANTS(
      SECURE_IN_DEPTH,
      SECURE_CONCISE,
      SECURE_EXAM,
      SECURE_COMPARE,
    ),
  },
  {
    id: "resilient",
    number: "2",
    title: "Design Resilient Architectures",
    weightPct: 26,
    emoji: "♻️",
    blurb:
      "High availability, fault tolerance, decoupling, multi-AZ/region, and DR strategies.",
    keyServices: [
      "ASG",
      "ELB",
      "Route 53",
      "Aurora",
      "DynamoDB Global",
      "S3 CRR",
      "SQS",
      "SNS",
      "EventBridge",
      "Step Functions",
    ],
    variants: VARIANTS(
      RESILIENT_IN_DEPTH,
      RESILIENT_CONCISE,
      RESILIENT_EXAM,
      RESILIENT_COMPARE,
    ),
  },
  {
    id: "performance",
    number: "3",
    title: "Design High-Performing Architectures",
    weightPct: 24,
    emoji: "⚡",
    blurb:
      "Right compute, fast storage, caching, edge delivery, async/concurrency, monitoring.",
    keyServices: [
      "EC2",
      "Lambda",
      "EBS gp3/io2",
      "ElastiCache",
      "DAX",
      "CloudFront",
      "Global Accelerator",
      "Athena",
      "Redshift",
    ],
    variants: VARIANTS(PERF_IN_DEPTH, PERF_CONCISE, PERF_EXAM, PERF_COMPARE),
  },
  {
    id: "cost",
    number: "4",
    title: "Design Cost-Optimized Architectures",
    weightPct: 20,
    emoji: "💰",
    blurb:
      "Right-size, scale-to-demand, storage tiering, network egress, visibility & budgets.",
    keyServices: [
      "Savings Plans",
      "RIs",
      "Spot",
      "S3 Intelligent-Tiering",
      "Glacier",
      "Cost Explorer",
      "Budgets",
      "Compute Optimizer",
      "VPC Endpoints",
    ],
    variants: VARIANTS(COST_IN_DEPTH, COST_CONCISE, COST_EXAM, COST_COMPARE),
  },
];

/** Lightweight TOC: pull h2/h3 from markdown. */
export function extractDomainToc(
  md: string,
): { level: 2 | 3; text: string; id: string }[] {
  const out: { level: 2 | 3; text: string; id: string }[] = [];
  const lines = md.split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const level = (m[1].length === 2 ? 2 : 3) as 2 | 3;
    const text = m[2].replace(/[`*_]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    if (text) out.push({ level, text, id });
  }
  return out;
}
