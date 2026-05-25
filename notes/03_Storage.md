# AWS SAA-C03 — 03 · Storage Services

> S3, EBS, EFS, FSx, Storage Gateway, Snow family, Backup. **High-weight exam topic.**

---

## PART 1: AMAZON S3 (Simple Storage Service)

**One-liner:** Object storage with 11 9's durability, virtually unlimited scale, region-scoped buckets, globally-unique bucket names.

### S3 Hard Limits & Facts

| Item | Limit / Fact |
|------|--------------|
| Max object size | **5 TB** |
| Max single PUT | **5 GB** (use multipart >100 MB, required >5 GB) |
| Durability | 99.999999999% (11 9's) |
| Availability (Standard) | 99.99% |
| Bucket name | Globally unique, 3–63 chars, DNS-compliant |
| Buckets per account | 100 (soft, raise to 1000) |
| Consistency | **Strong read-after-write** for all operations (since 2020) |

### S3 Storage Classes

| Class | Use Case | Min Storage | Retrieval | Cost |
|-------|---------|-------------|-----------|------|
| **Standard** | Frequent access, hot data | None | ms | $$$ |
| **Intelligent-Tiering** | Unknown/changing patterns | None | ms | Auto-moves tiers |
| **Standard-IA** | Infrequent, needs fast access | 30 days | ms | $$ |
| **One Zone-IA** | Infrequent, re-creatable | 30 days | ms (1 AZ only) | $ |
| **Glacier Instant Retrieval** | Archive accessed ~quarterly | 90 days | ms | $ |
| **Glacier Flexible Retrieval** | Archive, minutes-hours OK | 90 days | 1 min – 12 hr | ¢ |
| **Glacier Deep Archive** | Long-term archive, compliance | 180 days | 12 – 48 hr | ¢¢ (cheapest) |

> **Rule:** IA classes charge a per-GB retrieval fee + minimum 30-day storage charge.
> **Rule:** One Zone-IA = 1 AZ → cheaper but lower availability (99.5%). Lose AZ = lose data.
> **Keyword:** "unknown access pattern" → **Intelligent-Tiering**.
> **Keyword:** "compliance archive 7 years" → **Glacier Deep Archive**.
> **Keyword:** "milliseconds retrieval but rarely accessed" → **Glacier Instant Retrieval**.

### S3 Security & Access

| Mechanism | Scope | Notes |
|-----------|-------|-------|
| **Bucket Policy** | Bucket-level JSON | Cross-account, public-read controls |
| **ACLs** | Object + bucket | Legacy, prefer policies |
| **IAM Policies** | Identity-based | For principals in your account |
| **Block Public Access** | Account + bucket | Overrides everything; ON by default |
| **Access Points** | Per-app endpoints | Simplifies large-scale shared buckets |
| **Pre-signed URLs** | Temporary access | Time-limited GET/PUT for objects |

### S3 Encryption

| Type | Key Managed By | Headers |
|------|----------------|---------|
| **SSE-S3** | AWS (AES-256) | Default since 2023 |
| **SSE-KMS** | AWS KMS (your CMK) | Audit via CloudTrail, key policies |
| **SSE-C** | Customer-provided key | You send key in every request |
| **DSSE-KMS** | Dual-layer KMS | Defense-grade compliance |
| **Client-Side** | You | Encrypted before upload |

> **Rule:** Server-side encryption is now **on by default** (SSE-S3).
> **Rule:** Enforce encryption-in-transit via bucket policy `aws:SecureTransport=false` deny.

### S3 Features

| Feature | What It Does |
|---------|--------------|
| **Versioning** | Keep multiple object versions; protects from delete/overwrite |
| **MFA Delete** | Require MFA to delete a version (root only enables) |
| **Lifecycle Policies** | Transition or expire objects on schedule |
| **Replication (CRR/SRR)** | Cross-Region or Same-Region async copy; requires versioning |
| **Object Lock** | WORM — write-once-read-many; Governance vs Compliance mode |
| **Transfer Acceleration** | Upload via CloudFront edge → bucket; long distances |
| **Multipart Upload** | Parallel chunks; required >5 GB, recommended >100 MB |
| **S3 Select / Glacier Select** | SQL on a single object (CSV/JSON/Parquet) |
| **Event Notifications** | → SQS / SNS / Lambda / EventBridge |
| **Requester Pays** | Requester (not bucket owner) pays for GET + egress |
| **Static Website Hosting** | Bucket as HTTP website (no HTTPS without CloudFront) |

> **Replication rules:** source + destination must have versioning; deletes NOT replicated by default; existing objects NOT replicated unless you use S3 Batch Replication.
> **Object Lock — Governance:** users with permission can override. **Compliance:** no one (not even root) can delete during retention.

### S3 Performance

- 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD **per prefix per second**.
- Use multiple prefixes to scale linearly.
- Multipart upload for large objects; use S3 Transfer Acceleration for long-distance uploads.

---

## PART 2: EBS (Elastic Block Store)

**One-liner:** Network-attached block storage for a single EC2 instance, AZ-scoped.

### EBS Volume Types

| Type | Class | Max IOPS | Max Throughput | Use Case |
|------|-------|----------|----------------|----------|
| **gp3** | SSD General | 16,000 | 1,000 MB/s | Default — boot, most workloads (IOPS & throughput decoupled from size) |
| **gp2** | SSD General | 16,000 | 250 MB/s | Legacy general purpose (IOPS = 3× GB) |
| **io2 / io2 Block Express** | SSD Provisioned IOPS | 64K / 256K | 1,000 / 4,000 MB/s | Mission-critical DBs (SAP HANA, Oracle) |
| **io1** | SSD Provisioned IOPS | 64,000 | 1,000 MB/s | Legacy IOPS-intensive |
| **st1** | HDD Throughput | 500 | 500 MB/s | Big data, logs, streaming (sequential) |
| **sc1** | HDD Cold | 250 | 250 MB/s | Infrequent access, lowest cost |

> **Rule:** Boot volume must be SSD (gp2/gp3/io1/io2). HDD (st1/sc1) cannot be boot.
> **Rule:** EBS volume is **AZ-locked**. To move → snapshot → restore in target AZ.
> **Rule:** Multi-Attach available on **io1/io2** — up to 16 Nitro instances **same AZ**, requires cluster-aware FS.
> **Rule:** Snapshots are stored in **S3** (region-scoped, incremental). Can be copied cross-region.

### EBS vs Instance Store

| | EBS | Instance Store |
|---|-----|----------------|
| Persistence | Persistent | Ephemeral (lost on stop/terminate) |
| Performance | Network-attached | Physically attached, highest IOPS |
| Stop instance | OK | Data lost |
| Use | Default | Buffers, caches, scratch |

---

## PART 3: EFS (Elastic File System)

**One-liner:** Fully managed **NFS v4** for Linux, multi-AZ, multi-instance shared file storage. Auto-scales.

| Fact | Detail |
|------|--------|
| Protocol | NFS v4.1 / v4.0 |
| OS | **Linux only** |
| Scope | Regional, mounts via per-AZ mount targets |
| Performance modes | **General Purpose** (default), **Max I/O** (higher throughput, higher latency) |
| Throughput modes | **Bursting** (default), **Provisioned**, **Elastic** |
| Storage classes | Standard, **EFS-IA** (lifecycle), Standard-One Zone, One Zone-IA |
| Encryption | At rest (KMS) + in transit (TLS) |

> **Keyword:** "shared file system across many Linux EC2 / Lambda / containers" → **EFS**.
> **Keyword:** "Windows file share" → **NOT EFS**, use **FSx for Windows**.

---

## PART 4: FSx Family

| Service | Protocol | Use Case | Key Trait |
|---------|----------|----------|-----------|
| **FSx for Windows File Server** | SMB / NTFS | Windows shares, AD integration | Multi-AZ option |
| **FSx for Lustre** | Lustre / POSIX | HPC, ML training, video processing | Sub-ms; S3 integration (data repository) |
| **FSx for NetApp ONTAP** | NFS/SMB/iSCSI | Hybrid lift-and-shift, multi-protocol | Snap­Mirror, dedupe, compression |
| **FSx for OpenZFS** | NFS | ZFS workloads, snapshots, clones | High IOPS, low latency |

> **Lustre + S3:** can link to an S3 bucket; lazy-load files; export results back.
> **Keyword:** "HPC + S3 data" → **FSx for Lustre**.
> **Keyword:** "Windows + AD + SMB" → **FSx for Windows**.

---

## PART 5: AWS Storage Gateway (Hybrid)

| Type | Protocol | Local Cache | Use Case |
|------|----------|-------------|----------|
| **S3 File Gateway** | NFS / SMB | Yes | Files stored as S3 objects |
| **FSx File Gateway** | SMB | Yes | Low-latency access to FSx for Windows |
| **Volume Gateway — Cached** | iSCSI | Yes (hot) | Primary in S3, hot data local |
| **Volume Gateway — Stored** | iSCSI | All local | Async backup to S3 (full copy on-prem) |
| **Tape Gateway (VTL)** | iSCSI VTL | Yes | Replace physical tape; backups to S3/Glacier |

> **Keyword:** "extend on-prem storage to cloud" → **Storage Gateway**.
> **Keyword:** "replace tape backup" → **Tape Gateway**.

---

## PART 6: AWS Snow Family (Offline Transfer)

| Device | Capacity | Use Case |
|--------|----------|----------|
| **Snowcone** | 8 TB HDD / 14 TB SSD | Small edge, ruggedized, 4.5 lbs |
| **Snowball Edge Storage Optimized** | ~80 TB | Bulk transfer |
| **Snowball Edge Compute Optimized** | 42 TB + GPU option | Edge compute + transfer |
| **Snowmobile** | 100 PB | Exabyte-scale; semi-truck (being retired) |

> **Rule of thumb:** If transfer over internet would take **>1 week**, use Snow.
> Snowball includes encryption (KMS), tamper-resistance, GPS tracking.

---

## PART 7: AWS Backup

Centralized, policy-based backup across: EBS, EFS, FSx, RDS, Aurora, DynamoDB, Storage Gateway, EC2 (via AMI), Neptune, DocumentDB, Redshift, S3.

| Feature | Notes |
|---------|-------|
| **Backup Plans** | Schedule + lifecycle (move to cold storage) |
| **Backup Vaults** | KMS-encrypted destinations |
| **Cross-Region / Cross-Account copy** | DR |
| **Vault Lock** | WORM compliance (immutable backups) |
| **Audit Manager integration** | Compliance reporting |

> **Keyword:** "centrally manage backups across services" → **AWS Backup**.

---

## Storage Decision Matrix

| Need | Pick |
|------|------|
| Object storage, web/app data | **S3** |
| Block storage attached to one EC2 | **EBS** |
| Shared Linux NFS | **EFS** |
| Shared Windows SMB | **FSx for Windows** |
| HPC / scratch / ML training | **FSx for Lustre** or Instance Store |
| Hybrid file extension | **Storage Gateway (S3 File)** |
| Offline PB transfer | **Snowball / Snowmobile** |
| Long-term compliance archive | **Glacier Deep Archive + Object Lock** |
| Centralized backup policy | **AWS Backup** |

---

## Self-Test

- Min storage duration for Standard-IA? Glacier Deep Archive?
- Which S3 class is 1 AZ only?
- Largest single S3 object? Largest single PUT?
- Can EBS volume be attached to instance in another AZ? How to move it?
- Multi-Attach EBS supported on which types?
- EFS vs FSx for Windows — when to pick which?
- Which storage class for unknown access pattern?
- Object Lock Governance vs Compliance — who can override?
