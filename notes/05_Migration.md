# AWS SAA-C03 — 05 · Migration Services

> Move servers, databases, data, and schemas into AWS.

---

## Migration Strategies — 7 R's

| R | Meaning | Effort | Example |
|---|---------|--------|---------|
| **Retire** | Decommission | None | Legacy unused servers |
| **Retain** | Keep on-prem (for now) | None | Recently upgraded, compliance |
| **Rehost** | Lift-and-shift | Low | VM → EC2 via **MGN** |
| **Relocate** | VMware on AWS / hypervisor move | Low | VMware Cloud on AWS |
| **Repurchase** | Replace with SaaS | Medium | CRM → Salesforce |
| **Replatform** | Lift-tinker-shift | Medium | MySQL on EC2 → RDS |
| **Refactor / Re-architect** | Rewrite cloud-native | High | Monolith → microservices on Lambda |

---

## Server Migration

| Service | Purpose |
|---------|---------|
| **AWS Application Migration Service (MGN)** | **Successor of CloudEndure & SMS.** Block-level continuous replication; lift-and-shift to EC2. **Default rehost tool.** |
| **AWS Application Discovery Service** | Inventory on-prem servers (agent + agentless connector for VMware) — feeds into Migration Hub |
| **AWS Migration Hub** | Single pane of glass to track migration progress across services |
| **VM Import/Export** | Import VMDK/VHD/OVA as AMIs / export EC2 back |
| **AWS Server Migration Service (SMS)** | **DEPRECATED — use MGN** |

> **Keyword:** "lift-and-shift VMs to AWS" → **MGN**.
> **Keyword:** "inventory and dependency mapping of on-prem" → **Application Discovery Service**.

---

## Database Migration

| Service | Purpose |
|---------|---------|
| **AWS Database Migration Service (DMS)** | Migrate DBs with **minimal downtime** via continuous replication; source remains online |
| **AWS Schema Conversion Tool (SCT)** | Convert schema + code between **heterogeneous** engines (Oracle→Postgres, SQL Server→MySQL) |

### DMS Key Rules

- **Homogeneous** (Oracle→Oracle): DMS only.
- **Heterogeneous** (Oracle→Aurora Postgres): **SCT + DMS**.
- Sources: most relational, MongoDB, S3, Azure SQL, DynamoDB, etc.
- Targets: RDS, Aurora, Redshift, DynamoDB, S3, OpenSearch, Kinesis, Neptune, DocumentDB.
- Modes: **Full load**, **Full load + CDC**, **CDC only** (change data capture).
- DMS itself runs on an EC2 replication instance (you size it).

> **Keyword:** "migrate Oracle to Postgres, minimal downtime" → **SCT + DMS**.
> **Keyword:** "ongoing replication from on-prem DB to AWS" → **DMS CDC**.

---

## Data Transfer

| Service | Best For | Throughput / Cap |
|---------|---------|------------------|
| **Snowcone** | Edge / small (8/14 TB) | Mail-in |
| **Snowball Edge** | 80 TB bulk | Mail-in; can run Lambda / EC2 |
| **Snowmobile** | 100 PB exabyte (being retired) | Truck |
| **AWS DataSync** | Online migration NFS/SMB/HDFS/S3/EFS/FSx; scheduled or one-time; up to 10 Gbps per agent | Network |
| **AWS Transfer Family** | Managed SFTP/FTPS/FTP/AS2 into S3/EFS | Network |
| **AWS Direct Connect** | Dedicated network 1/10/100 Gbps | Network, persistent |
| **Storage Gateway** | Hybrid, ongoing | Network |

> **Rule of thumb:**
> - One-time, **> 1 week** over internet → **Snowball**
> - One-time, large but feasible network → **DataSync**
> - Ongoing hybrid → **Storage Gateway**
> - Partner/SFTP ingest → **Transfer Family**

### DataSync vs Storage Gateway

| | DataSync | Storage Gateway |
|---|----------|-----------------|
| Use | One-time / scheduled bulk transfer | Ongoing hybrid access |
| Direction | Bidirectional sync | Primarily caching/extending storage |
| Setup | Agent on-prem | Virtual appliance on-prem |

---

## Other Migration Helpers

| Service | Purpose |
|---------|---------|
| **AWS Application Discovery Service** | Catalog & dependency-map on-prem |
| **AWS Migration Evaluator** (formerly TSO Logic) | Cost & TCO analysis pre-migration |
| **AWS Mainframe Modernization** | Migrate/modernize mainframe apps |
| **AWS Application Discovery Agent / Agentless Collector** | Data collectors |

---

## Self-Test

- 7 R's — which is "replatform" and example?
- Heterogeneous DB migration tool combo?
- Lift-and-shift VMs — current AWS service?
- Snowball vs DataSync — when each?
- DMS modes — what is CDC?
