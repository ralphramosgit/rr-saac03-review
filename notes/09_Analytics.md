# AWS SAA-C03 — 09 · Analytics Services

> Athena, Glue, EMR, Kinesis, MSK, QuickSight, Data Pipeline, Lake Formation, OpenSearch, Redshift (see DB notes).

---

## Service Selection Quick Map

| Need | Service |
|------|---------|
| Ad-hoc SQL on S3, serverless | **Athena** |
| ETL, data catalog, serverless | **Glue** |
| Big data Hadoop/Spark cluster | **EMR** |
| Real-time streaming ingest | **Kinesis Data Streams** |
| Stream → S3/Redshift/OpenSearch | **Kinesis Data Firehose** |
| Stream analytics (SQL/Flink) | **Kinesis Data Analytics** (now **Managed Service for Apache Flink**) |
| Live video ingest + processing | **Kinesis Video Streams** |
| Managed Apache Kafka | **MSK** |
| Search / log analytics | **OpenSearch Service** |
| Data warehouse OLAP | **Redshift** (see DB notes) |
| BI dashboards | **QuickSight** |
| Data lake permissions | **Lake Formation** |
| Workflow orchestration (legacy) | **Data Pipeline** |
| Workflow orchestration (modern) | **Step Functions / MWAA (Airflow)** |

---

## Amazon Athena

**One-liner:** Serverless SQL query engine on S3 (Presto/Trino-based). Pay per TB scanned.

| Fact | Detail |
|------|--------|
| Source | S3 (CSV, JSON, ORC, Parquet, Avro, Apache logs) |
| Schema | Defined via Glue Data Catalog |
| Cost optimization | **Use columnar formats (Parquet/ORC), compress, partition** |
| Federated Query | Query RDS/DynamoDB/etc. via connectors |
| Workgroups | Cost limits, isolation |

> **Rule:** Athena cost ∝ data **scanned**. Parquet+partitioning can cut cost 10–100×.
> **Keyword:** "query S3 logs with SQL, no infrastructure" → **Athena**.

---

## AWS Glue

| Component | Purpose |
|-----------|---------|
| **Crawlers** | Auto-discover schema in S3/JDBC → populate Data Catalog |
| **Data Catalog** | Central metastore (Athena, EMR, Redshift Spectrum use it) |
| **ETL Jobs** | Spark or Python shell; serverless |
| **Glue Studio** | Visual ETL author |
| **Glue DataBrew** | No-code data prep |
| **Glue Streaming ETL** | Real-time from Kinesis/Kafka |
| **Workflows / Triggers** | Orchestrate jobs |
| **Glue Schema Registry** | Centralized schemas for streams |

> **Keyword:** "serverless ETL, catalog S3 data" → **Glue**.

---

## Amazon EMR (Elastic MapReduce)

Managed Hadoop/Spark/Hive/HBase/Presto/Flink cluster.

| Node | Role |
|------|------|
| **Master** | Cluster mgmt (1) |
| **Core** | Run tasks + store HDFS |
| **Task** | Run tasks only (great for Spot) |

| Feature | Detail |
|---------|--------|
| **EMR on EC2** | Default |
| **EMR on EKS** | Run Spark in Kubernetes |
| **EMR Serverless** | No cluster mgmt |
| **EMRFS** | Use S3 instead of HDFS (recommended) |

> **Keyword:** "Hadoop / Spark cluster" → **EMR**.
> **Keyword:** "petabyte ad-hoc SQL with cluster mgmt" → **EMR (Hive/Presto)** or **Redshift**.

---

## Kinesis Family — **CRITICAL DIFFERENTIATION**

| Service | Purpose | Latency | Retention |
|---------|---------|---------|-----------|
| **Data Streams (KDS)** | Real-time stream ingest; consumers (Lambda/KCL/Firehose) | ~200 ms | 24h → 365 days |
| **Data Firehose** | Stream → S3/Redshift/OpenSearch/Splunk; **no code** | ~60 s buffer | None (managed) |
| **Data Analytics / Managed Flink** | SQL or Apache Flink on streams | Real-time | — |
| **Video Streams** | Video ingest for playback/ML | Real-time | Configurable |

### KDS vs Firehose

| | KDS | Firehose |
|---|----|----------|
| Code required | Yes (consumer) | **No** |
| Latency | Sub-second | ~1 min buffer |
| Replay | Yes (retention) | No |
| Scaling | Manual shards / On-demand | Auto |
| Targets | Your code | S3/Redshift/OpenSearch/Splunk/HTTP |

> **Keyword:** "deliver clickstream to S3 with no code" → **Firehose**.
> **Keyword:** "real-time process with multiple consumers + replay" → **KDS**.

### Shards & Throughput (KDS provisioned mode)
- Each shard: **1 MB/s in**, **2 MB/s out**, 1000 records/s in.
- Use **on-demand** mode for unpredictable.
- **Enhanced fan-out** = 2 MB/s per consumer (push, no shard polling contention).

---

## Amazon MSK (Managed Streaming for Kafka)

| | MSK | Kinesis Data Streams |
|---|-----|---------------------|
| API | Kafka | Kinesis |
| Retention | Unlimited (disk-bound) | 24h–365d |
| Message size | Default 1 MB (configurable) | 1 MB |
| Use | Existing Kafka apps, ecosystem | AWS-native |

MSK Serverless option available.

---

## OpenSearch Service (formerly Elasticsearch Service)

Managed OpenSearch / Elasticsearch + Kibana/OpenSearch Dashboards.

- Use cases: log analytics, full-text search, observability.
- **UltraWarm** + **Cold storage** tiers for low-cost.
- Integrates with Kinesis Firehose, CloudWatch Logs, S3.

> **Keyword:** "log search & dashboards" → **OpenSearch**.

---

## QuickSight

Serverless BI. **SPICE** in-memory engine. ML Insights, anomaly detection, embedded analytics, paginated reports.

> **Keyword:** "BI dashboards, embedded in app, pay per session" → **QuickSight**.

---

## Lake Formation

Build secure data lakes on S3 in days. Centralized fine-grained permissions (row/column/cell) over Glue Catalog. Permissions enforced for Athena, Redshift Spectrum, EMR, QuickSight.

> **Keyword:** "fine-grained access to data lake across analytics services" → **Lake Formation**.

---

## AWS Data Exchange
Subscribe to third-party data sets directly into S3.

## AWS Data Pipeline (legacy)
Orchestrate data movement. Prefer **Step Functions** or **MWAA (Managed Airflow)**.

## MWAA — Managed Workflows for Apache Airflow
Managed Airflow for DAG orchestration of pipelines.

---

## Self-Test

- KDS vs Firehose — which buffers and writes to S3 with no code?
- How to drastically cut Athena cost?
- EMR core vs task node?
- Lake Formation main benefit?
- OpenSearch use case?
