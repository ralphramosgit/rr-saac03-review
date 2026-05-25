# AWS SAA-C03 — 17 · Service Comparisons (Cross-Cutting)

> The make-or-break section. Most SAA questions are "which of these 4 services?". Drill these tables until automatic.

---

## 1. Storage Classes — S3

See [03_Storage.md](03_Storage.md). Key memorization order: **Standard → Intelligent-Tiering → Standard-IA → One Zone-IA → Glacier Instant → Glacier Flexible → Glacier Deep Archive.**

---

## 2. RDS Multi-AZ vs Read Replicas

| | Multi-AZ | Read Replica |
|---|---------|--------------|
| Purpose | HA / failover | Read scaling |
| Replication | **Sync** | **Async** |
| Reads from standby | No (legacy Multi-AZ); Yes (Multi-AZ cluster with caveats) | Yes |
| Failover | Automatic | Manual promotion |
| Cross-region | No (Aurora Global yes) | Yes |
| Max | 1 standby | 5 (RDS), 15 (Aurora) |

---

## 3. SQL vs NoSQL Choice

| Need | Pick |
|------|------|
| ACID, joins, complex queries, fixed schema | RDS / Aurora |
| Key-value at scale, ms latency | DynamoDB |
| Document (Mongo) | DocumentDB |
| Graph relationships | Neptune |
| Time-series | Timestream |
| Ledger / immutable | QLDB |
| Wide-column (Cassandra) | Keyspaces |
| Petabyte analytics | Redshift |

---

## 4. SQS vs SNS vs Kinesis vs EventBridge

| | SQS | SNS | Kinesis Data Streams | EventBridge |
|---|----|----|---------------------|-------------|
| Pattern | Pull queue | Push pub/sub | Stream | Event bus |
| Order | FIFO opt | FIFO opt | Per shard | No |
| Replay | No (delete after consume) | No | **Yes (retention)** | No (archive opt) |
| Consumers | 1 per msg | Many | Many w/ shards | Many via rules |
| Retention | 14d max | None | 24h–365d | — |
| Use | Decouple work | Fan-out notify | Real-time ingest | Pattern-match event-driven |

---

## 5. CloudFront vs Global Accelerator

| | CloudFront | Global Accelerator |
|---|-----------|---------------------|
| Layer | L7 | L4 |
| Caches | Yes | No |
| Protocols | HTTP/HTTPS, WebSocket | TCP / UDP |
| Static IPs | No (DNS) | Yes (anycast) |
| Use | Web acceleration | Non-HTTP fast failover, fixed IPs |

---

## 6. ALB vs NLB vs GWLB vs CLB

| | ALB | NLB | GWLB | CLB |
|---|----|----|------|----|
| Layer | 7 | 4 | 3/4 | 4/7 |
| Protocols | HTTP/HTTPS/gRPC/WS | TCP/UDP/TLS | GENEVE | HTTP/HTTPS/TCP/SSL |
| Static IP | No | Yes | (uses GWLB endpoints) | No |
| Targets | EC2, IP, Lambda, ALB | EC2, IP, ALB | Appliances | EC2 |
| SG on LB | Yes | No | Yes | Yes |
| Use | Modern HTTP apps | Extreme TCP/UDP perf | 3rd-party security appliances | Legacy |

---

## 7. ElastiCache Redis vs Memcached

| | Redis | Memcached |
|---|-------|-----------|
| Replication / Multi-AZ | Yes | No |
| Persistence | Snapshots, AOF | No |
| Data structures | Strings, Lists, Sets, Sorted Sets, Hashes, Streams | Strings only |
| Multi-threading | No (single thread per node) | Yes |
| Use | Session, leaderboard, pub/sub | Simple cache, shardable |

---

## 8. EBS Volume Types

| Type | Class | Max IOPS | Use |
|------|-------|----------|-----|
| gp3 | SSD | 16K | Default, boot |
| gp2 | SSD | 16K | Legacy |
| io2 BX | SSD PIOPS | 256K | Mission-critical |
| io1 | SSD PIOPS | 64K | High IOPS legacy |
| st1 | HDD throughput | 500 | Big data, logs |
| sc1 | HDD cold | 250 | Archive |

---

## 9. EFS vs FSx vs EBS vs S3

| | EBS | EFS | FSx Windows | FSx Lustre | S3 |
|---|----|----|-------------|-----------|----|
| Type | Block | NFS | SMB | Lustre/POSIX | Object |
| Multi-attach | io1/io2 only | Many EC2 | Many | Many | n/a |
| OS | All | **Linux** | **Windows** | Linux | n/a |
| Scope | AZ | Region (multi-AZ) | Single/Multi-AZ | Single-AZ | Region |
| Use | Single EC2 disk | Shared Linux files | Windows shares | HPC/ML | Objects |

---

## 10. S3 Encryption Options

See [03_Storage.md](03_Storage.md). SSE-S3 default, SSE-KMS for audit/key control, SSE-C for customer-provided keys, DSSE-KMS for dual-layer.

---

## 11. Direct Connect vs VPN vs Transit Gateway

| | Site-to-Site VPN | Direct Connect | Transit Gateway |
|---|------------------|----------------|-----------------|
| Encryption | Yes (IPsec) | No (use MACsec or VPN over DX) | Routes traffic |
| Speed | ~1.25 Gbps per tunnel | 1/10/100 Gbps dedicated | Up to 50 Gbps per VPC attachment |
| Setup | Minutes | Weeks | Minutes |
| Cost | $ | $$$ | $$ |
| Use | Quick hybrid | Persistent high-throughput | Hub-and-spoke many VPCs |

---

## 12. Route 53 Routing Policies — Quick Pick

| Need | Policy |
|------|--------|
| Single resource | Simple |
| A/B test / gradual shift | Weighted |
| Lowest latency region | Latency |
| Active-passive DR | Failover |
| User country | Geolocation |
| Bias toward a region | Geoproximity |
| 8 IPs for simple LB | Multivalue |
| By client IP CIDR | IP-based |

---

## 13. Secrets Manager vs Parameter Store

| | Secrets Manager | Parameter Store |
|---|-----------------|-----------------|
| Rotation | Built-in (RDS, etc.) | Manual / custom |
| Cost | $$/secret | Free (standard) |
| Size | 64 KB | 4 KB / 8 KB adv |
| Use | Rotating secrets | Config + small secrets |

---

## 14. CloudWatch vs CloudTrail vs Config

| | CloudWatch | CloudTrail | Config |
|---|-----------|-----------|--------|
| Watches | Metrics + logs | API calls | Resource configs + compliance |
| Q answered | Is it healthy? | Who did it? | Is it compliant? |

---

## 15. Compute Choice

| | EC2 | Lambda | Fargate | Beanstalk | Lightsail |
|---|----|--------|---------|-----------|-----------|
| You manage | OS + app | Code only | Container only | App + config | App (simplest) |
| Time limit | None | 15 min | None | None | None |
| Pricing | Per second | Per ms | Per second | Underlying | Flat monthly |
| Use | Full control | Event/short fn | Containers, no servers | PaaS web apps | Simple sites / dev |

---

## 16. Lambda vs Step Functions vs SWF

| | Lambda | Step Functions | SWF |
|---|--------|----------------|-----|
| Style | Single fn | State machine, serverless | Workflow (with deciders/workers, legacy) |
| Use | Event-driven | Modern orchestration | Legacy workflows |

> Default to **Step Functions**. SWF only if requirement explicitly demands deciders or older app continuity.

---

## 17. SES vs SNS vs Pinpoint

| | SES | SNS | Pinpoint |
|---|----|----|---------|
| Channels | Email | Email/SMS/push/SQS/Lambda/HTTP | Email/SMS/push/voice/in-app + campaigns |
| Targeting | No | Topic subs | Segments/campaigns/analytics |

---

## 18. Athena vs Redshift vs Redshift Spectrum vs EMR

| Need | Pick |
|------|------|
| Ad-hoc SQL on S3, no infra | **Athena** |
| Petabyte warehouse, complex BI | **Redshift** |
| Query S3 from existing Redshift | **Redshift Spectrum** |
| Hadoop/Spark/Hive cluster | **EMR** |

---

## 19. Migration Tools

| Need | Pick |
|------|------|
| Lift-and-shift servers | **MGN** |
| Migrate DBs (homogeneous) | **DMS** |
| Migrate DBs (heterogeneous) | **SCT + DMS** |
| Large offline transfer | **Snowball / Snowmobile** |
| Online file sync | **DataSync** |
| Hybrid ongoing | **Storage Gateway** |
| Managed SFTP → S3 | **Transfer Family** |

---

## 20. Decoupling Anti-Patterns (avoid on the exam)

- Don't use **Lambda** for >15 min jobs — use **Step Functions, ECS/Fargate, or EC2**.
- Don't use **SNS** when you need **ordering+replay** — use **Kinesis** or **SQS FIFO**.
- Don't use **CloudFront** for **non-HTTP** acceleration — use **Global Accelerator**.
- Don't use **NAT GW** for **S3/DynamoDB** access from private subnet — use **Gateway VPC Endpoint** (free).
- Don't use **Multi-AZ** to scale reads — use **Read Replicas**.
- Don't put **secrets in env vars/code** — use **Secrets Manager / Parameter Store**.
- Don't use **EBS** to share files between EC2 — use **EFS** (Linux) / **FSx** (Windows).

---

## Drill Tip

For each row in this file, cover one column and predict the other. Repeat daily for a week. These tables are ~70% of SAA-C03 question recognition.
