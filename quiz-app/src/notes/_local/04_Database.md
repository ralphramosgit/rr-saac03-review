# AWS SAA-C03 — 04 · Database Services

> RDS, Aurora, DynamoDB, ElastiCache, DocumentDB, Neptune, Keyspaces, QLDB, Timestream, Redshift. **High-weight.**

---

## DB Service Selection Cheat (master this first)

| Workload | Service |
|----------|---------|
| Relational, managed, standard engines (MySQL/Postgres/Oracle/SQL Server/MariaDB) | **RDS** |
| Cloud-native relational, high perf, 5× MySQL / 3× Postgres | **Aurora** |
| Key-value / document, single-digit ms, serverless scale | **DynamoDB** |
| In-memory cache (ms→μs) | **ElastiCache** (Redis / Memcached) |
| In-memory primary DB w/ durability | **MemoryDB for Redis** |
| MongoDB-compatible document | **DocumentDB** |
| Graph (social, fraud, knowledge) | **Neptune** |
| Cassandra-compatible wide-column | **Keyspaces** |
| Ledger, immutable, cryptographically verifiable | **QLDB** |
| Time-series (IoT, DevOps) | **Timestream** |
| Data warehouse, OLAP, columnar | **Redshift** |

---

## PART 1: AMAZON RDS

**One-liner:** Managed relational database — AWS handles OS, patching, backups, failover. You manage schema + queries.

### Engines
MySQL · MariaDB · PostgreSQL · Oracle · SQL Server · Aurora (separate)

### RDS Storage Types

| Type | Use |
|------|-----|
| **General Purpose SSD (gp2/gp3)** | Default |
| **Provisioned IOPS (io1/io2)** | High-throughput / latency-sensitive OLTP |
| **Magnetic** | Legacy only |

### Backups & Recovery

| Feature | Detail |
|---------|--------|
| **Automated backups** | Daily full + transaction logs every 5 min; retention 1–35 days; **deleted with DB** |
| **Manual snapshots** | User-triggered; **persist until you delete them** |
| **Point-in-Time Recovery (PITR)** | To any second within retention (creates new DB instance) |
| **Snapshot copy / share** | Cross-region, cross-account (KMS key sharing rules apply) |

### Multi-AZ vs Read Replicas — **CRITICAL DISTINCTION**

| | Multi-AZ | Read Replica |
|---|----------|--------------|
| **Purpose** | HA / failover | Scale reads |
| **Replication** | **Synchronous** | **Asynchronous** |
| **Endpoint** | Same (DNS flip) | Separate endpoint per replica |
| **Reads from standby?** | **NO** (Multi-AZ cluster: yes, with caveats) | Yes (replicas serve reads) |
| **Promote to primary?** | Auto on failure | Manual; breaks replication |
| **Cross-region?** | Same region only (multi-AZ); Aurora Global is cross-region | Yes (cross-region RR supported) |
| **Use case** | Production HA | Reporting, BI, read scaling |

> **Rule:** Multi-AZ ≠ scaling reads. It's an HA failover standby.
> **Rule:** RDS Multi-AZ failover takes ~60–120 seconds.
> **Rule:** Up to **5 Read Replicas per source** (15 for Aurora).

### Encryption

- Enable **at creation** (cannot enable on existing unencrypted DB — must snapshot → copy with encryption → restore).
- KMS-based at rest; SSL/TLS in transit.
- Read replicas inherit encryption; cross-region RR of encrypted DB requires KMS key in target region.

### RDS Proxy
Connection pooling + failover; reduces failover time to seconds; helps Lambda/serverless.

> **Keyword:** "many short connections from Lambda" → **RDS Proxy**.
> **Keyword:** "automatic failover < 60s, fully managed" → **Multi-AZ + Proxy**.

---

## PART 2: AURORA

**One-liner:** AWS's cloud-native relational engine, MySQL/Postgres-compatible, 5×/3× faster, separates compute and storage.

| Trait | Detail |
|-------|--------|
| **Storage** | Shared cluster volume, auto-grows to 128 TB, 6 copies across 3 AZs |
| **Replicas** | Up to **15 Aurora Replicas**; failover in ~30 s; same storage |
| **Endpoints** | **Cluster** (writer), **Reader** (load-balanced reads), **Custom**, **Instance** |
| **Aurora Global Database** | Cross-region replication, <1 s lag, RPO ~1 s, RTO <1 min |
| **Aurora Serverless v2** | Auto-scales fine-grained ACUs; instant scale; production OLTP |
| **Backtrack** (MySQL) | Rewind cluster up to 72 hr without restore |
| **Parallel Query** | Push processing into storage layer (analytics on OLTP) |
| **Aurora Machine Learning** | Invoke SageMaker/Comprehend from SQL |

> **Keyword:** "MySQL/Postgres with global DR" → **Aurora Global**.
> **Keyword:** "intermittent / unpredictable relational workload" → **Aurora Serverless v2**.
> **Rule:** Aurora storage is fault-tolerant — survives loss of 2 AZ copies (read) / 3 AZ copies still OK overall.

---

## PART 3: DYNAMODB

**One-liner:** Serverless, managed NoSQL key-value + document; single-digit ms; auto-scales; multi-AZ.

### Capacity Modes

| Mode | When |
|------|------|
| **On-Demand** | Unpredictable / spiky traffic; pay per request |
| **Provisioned** | Predictable; cheaper if utilized; supports Auto Scaling |

### Keys & Indexes

| Item | Detail |
|------|--------|
| **Partition Key (HASH)** | Required; spreads data across partitions |
| **Sort Key (RANGE)** | Optional; composite uniqueness |
| **LSI** | Same partition key, alt sort key. **Create at table creation only.** Max 5/table. |
| **GSI** | Different partition + sort key. Create/delete anytime. Eventually consistent. |

### Read Consistency

| Type | Latency | Cost |
|------|--------|------|
| **Eventually consistent** (default) | Lowest | 0.5 RCU |
| **Strongly consistent** | Slightly higher | 1 RCU |
| **Transactional** | Higher | 2 RCU/WCU |

### DynamoDB Features

| Feature | Use Case |
|---------|----------|
| **DAX** | μs read cache for DynamoDB |
| **Global Tables** | Multi-region, multi-active replication |
| **Streams** | Item-level change capture → Lambda trigger |
| **TTL** | Auto-expire items |
| **PITR** | 35-day point-in-time recovery |
| **On-demand backup** | Full backup, retained until deleted |
| **Export to S3** | No RCU consumed; for analytics |
| **Contributor Insights** | Find hot keys |

### Sizes & Limits

| Item | Limit |
|------|-------|
| Item max size | **400 KB** |
| Partition key max | 2 KB |
| Sort key max | 1 KB |
| Tables per region per account | 2,500 (soft) |

> **Keyword:** "millisecond key-value at any scale, serverless" → **DynamoDB**.
> **Keyword:** "microsecond cache for DynamoDB" → **DAX**.
> **Keyword:** "multi-region active-active" → **DynamoDB Global Tables**.

---

## PART 4: ELASTICACHE

| Engine | Trait | Use Case |
|--------|-------|----------|
| **Redis** | Multi-AZ, replication, persistence, pub/sub, sorted sets, streams, transactions, snapshot | Session store, leaderboard, real-time analytics, chat |
| **Memcached** | Multi-node sharding, multi-threaded, no replication, no persistence | Simple cache, ephemeral |

### Caching Strategies

| Strategy | How |
|----------|-----|
| **Lazy Loading (cache-aside)** | App reads cache → miss → reads DB → writes cache. Stale data possible. |
| **Write-Through** | App writes DB + cache simultaneously. Cache always fresh; write penalty. |
| **TTL** | Expire keys to bound staleness. |

> **Rule:** ElastiCache is **NOT** a primary durable database (unless using **MemoryDB**).
> **Keyword:** "session storage for web app behind ELB" → **ElastiCache Redis**.
> **Keyword:** "Redis-compatible durable primary DB" → **MemoryDB for Redis**.

---

## PART 5: OTHER NoSQL & SPECIALTY

| Service | Compat / Model | When |
|---------|----------------|------|
| **DocumentDB** | MongoDB-compatible | Migrating MongoDB workloads, managed |
| **Neptune** | Graph (Gremlin, SPARQL, openCypher) | Social, fraud detection, knowledge graphs, recs |
| **Keyspaces** | Cassandra (CQL) compatible | Wide-column at scale, serverless |
| **QLDB** | Ledger DB | Immutable, cryptographically verifiable history (audit, supply chain) |
| **Timestream** | Time-series | IoT telemetry, DevOps metrics, real-time analytics |

> **QLDB vs Blockchain (Managed Blockchain):** QLDB = **central** trusted ledger. Blockchain = **decentralized** multi-party trust.

---

## PART 6: REDSHIFT (Data Warehouse)

**One-liner:** Petabyte-scale columnar OLAP warehouse; SQL; cluster of leader + compute nodes.

| Feature | Detail |
|---------|--------|
| **Columnar storage + MPP** | Optimized for analytic queries |
| **Distribution styles** | AUTO, EVEN, KEY, ALL |
| **Sort keys** | Compound or interleaved |
| **Redshift Spectrum** | Query S3 directly without loading |
| **Concurrency Scaling** | Auto-add transient capacity for read spikes |
| **Redshift Serverless** | No cluster mgmt; pay per RPU |
| **Cross-region snapshots** | DR |
| **Federated Query** | Query RDS/Aurora live from Redshift |
| **Data sharing** | Share data across clusters/accounts |
| **AQUA** | Hardware-accelerated cache (in some node types) |

> **Keyword:** "petabyte data warehouse, complex SQL analytics" → **Redshift**.
> **Keyword:** "ad-hoc SQL on S3, no infrastructure" → **Athena** (not Redshift).
> **Rule:** Redshift = OLAP, NOT OLTP. RDS/Aurora = OLTP.

---

## Decision Tree — Quick

```
Relational?
 ├─ Standard engine, managed → RDS
 ├─ MySQL/Postgres + perf/scale/global → Aurora
 └─ Petabyte analytics → Redshift

NoSQL?
 ├─ Key-value/document, ms, scale → DynamoDB
 ├─ MongoDB-compat → DocumentDB
 ├─ Cassandra-compat → Keyspaces
 ├─ Graph → Neptune
 ├─ Time-series → Timestream
 └─ Ledger / immutable → QLDB

Cache?
 ├─ Simple, multi-threaded → Memcached
 ├─ Rich data types, multi-AZ → Redis (ElastiCache)
 └─ Primary durable in-memory → MemoryDB

Cache in front of DynamoDB? → DAX
```

---

## Self-Test

- Multi-AZ vs Read Replica — which gives HA? Which gives read scale?
- Max item size in DynamoDB?
- Difference between LSI and GSI?
- Aurora Global Database RPO/RTO targets?
- Redis vs Memcached — which supports replication & persistence?
- When do you pick Aurora Serverless v2 over provisioned?
- Difference between PITR retention for RDS vs DynamoDB?
- Athena vs Redshift Spectrum vs Redshift — when each?
