# AWS Decoupling — Deep Dive

> Comprehensive reference for the application-integration / decoupling stack on AWS. Covers theory, every service, configuration limits, design patterns, and exam scenarios.

---

## TABLE OF CONTENTS

1. [Why Decouple?](#1-why-decouple)
2. [Coupling Patterns & Trade-offs](#2-coupling-patterns--trade-offs)
3. [SQS — Simple Queue Service](#3-sqs--simple-queue-service)
4. [SNS — Simple Notification Service](#4-sns--simple-notification-service)
5. [EventBridge](#5-eventbridge)
6. [Step Functions](#6-step-functions)
7. [Kinesis Family](#7-kinesis-family)
8. [Amazon MSK](#8-amazon-msk-managed-kafka)
9. [Amazon MQ](#9-amazon-mq)
10. [AppFlow & AppSync (briefly)](#10-appflow--appsync-briefly)
11. [Cross-Service Comparison Matrix](#11-cross-service-comparison-matrix)
12. [Design Patterns](#12-design-patterns)
13. [Security, Monitoring, Cost](#13-security-monitoring-cost)
14. [Exam Scenarios & Keyword Triggers](#14-exam-scenarios--keyword-triggers)
15. [Self-Test](#15-self-test)

---

## 1. WHY DECOUPLE?

**Tight coupling** means components call each other directly and synchronously. The whole system fails if any one component fails or slows down. Scaling one tier requires scaling all of them.

**Loose coupling** inserts an **intermediary** (queue, topic, bus, stream) between producers and consumers so that:

- **Failure isolation** — if a consumer dies, messages sit in the queue.
- **Independent scaling** — producers and consumers scale independently (different ASGs, different metrics).
- **Burst absorption** — queues smooth out spiky load.
- **Asynchronous processing** — producers don't block waiting on slow work.
- **Polyglot** — different teams / languages / runtimes on each side of the broker.
- **Replay** (with streams) — late-arriving consumers can re-process history.

**Core trade-offs**

| Gain                           | Pay with                                            |
| ------------------------------ | --------------------------------------------------- |
| Resilience to consumer outages | Eventual consistency, retries, idempotency required |
| Spike absorption               | Storage cost; visibility into backlog               |
| Multiple consumers             | Ordering/exactly-once complexity                    |
| Workflow orchestration         | Operational complexity, state-machine debugging     |

---

## 2. COUPLING PATTERNS & TRADE-OFFS

### Synchronous (Request/Response)

- HTTP via **API Gateway** → Lambda / ALB / NLB → backend.
- Caller waits. Failure of the backend is immediately visible.
- Good for: user-facing APIs requiring an answer now.

### Asynchronous Queueing (Point-to-Point)

- Producer puts a message on **SQS**; one or more consumers pull and process.
- 1 producer → 1 consumer (one consumer per message).
- Decouples timing; supports retries and DLQs.

### Pub/Sub Fan-Out

- Producer publishes to **SNS** or **EventBridge**.
- All subscribers / matching rules receive a copy.
- 1 producer → N consumers.

### Streaming (Append-Only Log)

- Producer writes records into **Kinesis / MSK**; multiple consumers replay independently.
- Strict per-partition ordering, replay window, parallel processing.

### Workflow Orchestration

- **Step Functions** coordinates many services with state, retries, timeouts, branching.

### Choreography vs Orchestration

- **Choreography**: each service reacts to events (EventBridge / SNS / SQS). Loose, decentralized.
- **Orchestration**: a central controller (Step Functions) directs the flow. Easier to reason about; single point of change.

---

## 3. SQS — Simple Queue Service

Fully managed message queue. **Pull**-based.

### Queue Types

| Feature    | **Standard**                     | **FIFO**                                                                         |
| ---------- | -------------------------------- | -------------------------------------------------------------------------------- |
| Delivery   | At-least-once                    | **Exactly-once** (within 5-min dedup window)                                     |
| Order      | Best-effort                      | **Strict** per Message Group ID                                                  |
| Throughput | Nearly unlimited                 | 300 msg/s (3,000 batched) → **3,000 / 30,000 batched** with high-throughput mode |
| Name       | `Q.fifo`?                        | Suffix `.fifo` required                                                          |
| Use        | Decouple workers, max throughput | Financial/inventory/event ordering                                               |

### Limits & Defaults

| Parameter          | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| Message size       | **256 KB** (extended client up to 2 GB via S3 pointer) |
| Retention          | 1 min – **14 days** (default 4 days)                   |
| Visibility timeout | 0 – **12 h** (default 30 s)                            |
| Long polling wait  | 0 – **20 s**                                           |
| Delay seconds      | 0 – **15 min** (per-queue or per-message)              |
| Max in-flight      | 120 K (Standard), 20 K (FIFO)                          |
| Message attributes | 10                                                     |
| Receive batch      | 1 – 10 messages                                        |

### Key Concepts

- **Visibility Timeout** — period during which a received message is hidden from other consumers. Extend with `ChangeMessageVisibility` if processing takes longer than expected; otherwise duplicate processing will occur.
- **Long Polling** — `WaitTimeSeconds` up to 20 s; reduces empty receives and cost.
- **Short Polling** — returns immediately even if no messages; higher API cost.
- **Dead-Letter Queue (DLQ)** — after `maxReceiveCount` failed receives, message moves to a DLQ. DLQ must match queue type (FIFO ↔ FIFO). Inspect with CloudWatch metrics + redrive policy.
- **Redrive** — replay DLQ messages back to source queue via console or API.
- **Delay Queues** vs **Per-Message Delay** — per-queue default delay vs per-message override.
- **Message Group ID (FIFO)** — partitions ordering. Same group = strict order. Different groups process in parallel.
- **Deduplication ID (FIFO)** — exactly-once within 5-minute window. Content-based dedup possible (SHA-256 of body).
- **At-least-once delivery (Standard)** — design consumers to be **idempotent**.

### Scaling Workers with SQS

- Custom CloudWatch metric: **backlog per instance** = `ApproximateNumberOfMessagesVisible / desiredCapacity`.
- ASG target tracking on that metric keeps queue depth steady.

### Encryption / Security

- **SSE-SQS** (AWS-owned key, default since 2022).
- **SSE-KMS** (CMK).
- Queue policies (resource-based) + IAM (identity-based) — cross-account access via queue policy.
- VPC endpoint (Interface) for private access.

### Pricing

- Per request (1 receive can return up to 10 messages = 1 request).
- Data transfer + KMS calls billed separately.
- First 1 M requests/month free.

---

## 4. SNS — Simple Notification Service

Push-based pub/sub. Producers publish to a **topic**; SNS pushes to all subscribers.

### Subscriber Types

- **Amazon SQS** (most common — SNS→SQS fan-out pattern)
- **AWS Lambda**
- **HTTP / HTTPS endpoints** (with retry policies & DLQ)
- **Email / Email-JSON**
- **SMS** (per-message attributes for transactional vs promotional, sender ID)
- **Mobile Push** (APNS, FCM, ADM, Baidu, WNS, MPNS)
- **Kinesis Data Firehose** (route SNS messages to S3/Redshift/OpenSearch/HTTP)
- **In-app messaging via Pinpoint** (separate service)

### Topic Types

|             | Standard    | FIFO                                                        |
| ----------- | ----------- | ----------------------------------------------------------- |
| Throughput  | Very high   | 300 msg/s (3,000 batched) — high-throughput mode 3 K / 30 K |
| Order       | Best-effort | Strict per Group ID                                         |
| Dedup       | None        | 5-min window                                                |
| Subscribers | All types   | **SQS FIFO** and **Firehose** only                          |

### Filter Policies

- JSON attached to each subscription matches **message attributes** (or message body — opt-in via payload-based filtering).
- Routes only matching events to that subscriber.
- Example:

```json
{ "type": ["order"], "region": ["us-east-1", "us-west-2"] }
```

### Limits

- 256 KB message size.
- 100 K topics / account, 12.5 M subscriptions / topic.
- Message attributes (10) for filtering.
- Retry policy (default 3 retries) + per-subscription DLQ.

### Cross-Region / Cross-Account

- Topic policy enables cross-account publish/subscribe.
- For cross-region fan-out, publish to topics in each region or use EventBridge bus replication.

### Encryption

- SSE with KMS CMK.
- HTTPS endpoints recommended; AWS verifies the TLS cert.

### SNS → SQS Fan-Out (Canonical Pattern)

```
                    ┌─► SQS-orders   ─► OrderWorker
Producer ──► SNS ───┼─► SQS-shipping ─► ShipWorker
                    └─► SQS-audit    ─► S3
```

- Subscriber **SQS queues** decouple buffering from publishing.
- One topic, many independent consumers, each with its own retention / DLQ / throughput.

---

## 5. EventBridge

Serverless event bus. Successor to CloudWatch Events; superset of SNS for **event-driven** architectures.

### Event Sources

- **AWS services** (native events for S3, EC2, ECS, CodePipeline, …).
- **Custom applications** (`PutEvents` API).
- **SaaS partners** (Zendesk, Datadog, MongoDB Atlas, Auth0, etc.) via partner event buses.

### Buses

- **Default bus** — receives AWS service events.
- **Custom buses** — application or domain events.
- **Partner buses** — one per SaaS source.

### Rules

- Match JSON **event pattern** (very expressive: prefix, suffix, exists, anything-but, numeric, IP).
- Each rule has up to **5 targets** (Lambda, Step Functions, SQS, SNS, Kinesis, ECS Task, Firehose, API destination, etc.).
- Targets can include an **input transformer** (reshape the event).

### Schedules

- **Cron** (`cron(0 10 * * ? *)`) or **rate** (`rate(5 minutes)`) expressions.
- **EventBridge Scheduler** (newer, separate service) — better quotas, time zones, one-time schedules, flexible time windows.

### Schema Registry & Discovery

- Auto-discover schemas of events on a bus.
- Generate **code bindings** (TypeScript, Python, Java, Go) for typed handlers.

### Archive & Replay

- **Archive** matching events on a bus into EventBridge-managed storage (configurable retention).
- **Replay** to the same or different bus — great for testing changes, recovering missed events, audits.

### EventBridge Pipes

- Point-to-point integration:
  ```
  Source ─► Filter ─► Enrich ─► Target
  ```
- Sources: SQS, Kinesis, DynamoDB Streams, MSK, Amazon MQ, self-managed Kafka.
- Filter (event-pattern), Enrich (Lambda / Step Functions / API GW / API destination), Target (any EventBridge target).

### Limits

- 256 KB event size.
- Throughput scales automatically.
- Up to 100 event buses / region, 300 rules / bus.

### SNS vs EventBridge

|                               | SNS                 | EventBridge        |
| ----------------------------- | ------------------- | ------------------ |
| Latency                       | Lower               | Slightly higher    |
| Throughput per topic/bus      | Very high           | High               |
| Pub/sub fan-out               | ✅                  | ✅                 |
| AWS service event integration | Partial             | **Native, broad**  |
| SaaS partner sources          | ❌                  | ✅                 |
| Scheduling                    | ❌                  | ✅                 |
| Archive & Replay              | ❌                  | ✅                 |
| Schema registry               | ❌                  | ✅                 |
| Cost                          | Cheaper per message | Higher per message |

> Use **SNS** when you want raw fan-out speed and simple subscribers. Use **EventBridge** when you need event matching, AWS-service event integration, scheduling, replay, or partner sources.

---

## 6. Step Functions

Serverless orchestration. Workflows defined in **Amazon States Language (ASL)** JSON.

### Workflow Types

|                               | **Standard**                                      | **Express**                                          |
| ----------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| Duration                      | up to **1 year**                                  | up to **5 min**                                      |
| Pricing model                 | per **state transition**                          | per execution + duration (GB-s)                      |
| Execution history             | 90 days (built-in)                                | via CloudWatch Logs                                  |
| At-least-once vs exactly-once | **Exactly-once**                                  | **At-least-once** (async) or **At-most-once** (sync) |
| Best for                      | Long workflows, human approval, durable processes | High-volume short event processing                   |

### States

| State              | Purpose                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| **Task**           | Call a service (Lambda, ECS, DynamoDB, SNS, SQS, EMR, Glue, …)                |
| **Choice**         | Branch on JSON path conditions                                                |
| **Wait**           | Pause N seconds / until timestamp                                             |
| **Parallel**       | Run multiple branches concurrently                                            |
| **Map**            | Iterate over an array (Inline or **Distributed Map** for very large datasets) |
| **Pass**           | Transform and pass-through                                                    |
| **Succeed / Fail** | Terminal states                                                               |

### Service Integrations

- **Optimized** — purpose-built for Lambda, ECS, SNS, SQS, DynamoDB, EMR, Glue, Batch, EKS, SageMaker, EventBridge.
- **AWS SDK** — 200+ AWS services as Task targets directly without Lambda.
- **HTTP Endpoint** — call external REST APIs.

### Patterns

- **Wait for callback** (`waitForTaskToken`) — task issues a token; workflow pauses until external system calls `SendTaskSuccess` / `SendTaskFailure`. Use for human approvals, async batch jobs.
- **Retry / Catch** — declarative error handling with exponential backoff, jitter, max attempts.
- **Express + Distributed Map** — process millions of S3 objects in parallel with rate control.

### Observability

- Visual execution graph in console.
- CloudWatch Logs + Metrics + X-Ray integration.

### Pricing

- Standard: $0.025 per 1,000 state transitions (varies by region).
- Express: $1 per million executions + $0.00001667/GB-s.

> **Tip:** If your workflow runs millions of times/day and is short — Express. Long-running, low-volume, or needing durable history — Standard.

---

## 7. Kinesis Family

Real-time streaming.

### 7a. Kinesis Data Streams (KDS)

- Shard-based **append-only log**.
- **Shard** capacity:
  - Ingress: 1 MB/s or 1,000 records/s.
  - Egress (shared): 2 MB/s aggregate across all standard consumers.
  - Egress (per consumer with Enhanced Fan-Out): 2 MB/s **per consumer**.
- **Capacity modes**:
  - **Provisioned** — you set the shard count. Predictable cost.
  - **On-Demand** — auto-scales, pay per GB. Up to 4 GB/s ingress (lift on request). Best for unknown patterns.
- **Partition Key** — hashed to pick a shard. Records with the same partition key go to the same shard → **strict per-shard ordering**.
- **Retention** — 24 h default; up to **365 days** (extra cost). Enables **replay** of historical data.
- **Producers**: KPL (Kinesis Producer Library), AWS SDK, Kinesis Agent, Firehose, IoT, CloudWatch Logs.
- **Consumers**: KCL (Kinesis Client Library), Lambda (event-source mapping), Flink / Kinesis Data Analytics, Firehose.
- **Enhanced Fan-Out (EFO)** — HTTP/2 push, 2 MB/s per consumer per shard, ~70 ms latency. Costs more, but enables many parallel consumers without throughput contention.
- **Resharding** — split (hot shard) or merge (cold shards). On-Demand handles automatically.

### 7b. Kinesis Data Firehose

- **Fully managed delivery** of streaming data to **S3 / Redshift / OpenSearch / Splunk / HTTP endpoint / Datadog / New Relic / MongoDB / Coralogix**.
- **No shards / no consumers** — fire-and-forget.
- **Near-real-time**: buffer 60+ s **or** 1+ MB triggers flush (configurable up to 15 min / 128 MB).
- **Transform with Lambda** — modify records inline before delivery.
- **Convert** to Parquet / ORC for analytics workloads.
- **Dynamic partitioning** to S3 (`/year=…/month=…/day=…/`).
- **No replay** — data leaves Firehose after delivery.

### 7c. Kinesis Data Analytics / Managed Service for Apache Flink

- Run SQL or Flink applications against KDS / MSK streams.
- Stateful real-time analytics, joins, windowed aggregations, anomaly detection (`RANDOM_CUT_FOREST`).

### 7d. Kinesis Video Streams

- Ingest video & audio from cameras / devices for analytics with Rekognition Video / SageMaker.

### KDS vs Firehose

|                  | KDS                 | Firehose                        |
| ---------------- | ------------------- | ------------------------------- |
| Real-time        | Yes (~200 ms)       | Near-real-time (60 s+)          |
| Replay           | Yes (24 h – 365 d)  | No                              |
| Custom consumers | Yes                 | No (only built-in destinations) |
| Scale unit       | Shard               | Auto                            |
| Pricing          | per shard-hour + GB | per GB ingested                 |

---

## 8. Amazon MSK (Managed Kafka)

- Fully managed Apache Kafka clusters.
- **MSK Provisioned** — choose broker instance type, EBS, partitions.
- **MSK Serverless** — auto scales, you pay per usage.
- **MSK Connect** — managed Kafka Connect for connectors (Debezium, S3, JDBC, etc.).
- **Replay** via Kafka log retention (size-based or time-based, can be days/weeks).
- **Per-partition ordering**; consumers track offsets independently.
- Security: TLS in transit, KMS at rest, IAM auth (`SASL/AWS_MSK_IAM`), SASL/SCRAM, mTLS.
- Use when: existing Kafka apps, Kafka ecosystem (Streams, Connect), >10s of MB/s throughput, very large event histories.

### Kinesis vs MSK

|                               | KDS                              | MSK                               |
| ----------------------------- | -------------------------------- | --------------------------------- |
| API                           | AWS-native                       | Kafka API                         |
| Records per shard / partition | 1 MB/s in                        | depends on broker                 |
| Retention                     | up to 365 d                      | hours → unlimited (size-based)    |
| Ordering                      | per shard                        | per partition                     |
| Ecosystem                     | KCL, Lambda, Firehose, Flink     | Kafka Connect, Streams, ksqlDB    |
| Pick when                     | new on AWS, want full management | existing Kafka, ecosystem matters |

---

## 9. Amazon MQ

- Managed **ActiveMQ** or **RabbitMQ** brokers.
- Supports legacy protocols: **JMS, AMQP 0.9.1 / 1.0, MQTT, STOMP, OpenWire, WebSocket**.
- Single-instance or active/standby HA broker pair.
- VPC-deployed, IP-based access (no native serverless integration).
- **Pick MQ over SQS/SNS only when migrating an existing app that relies on these protocols.** Otherwise cloud-native SQS/SNS/EventBridge are simpler and cheaper.

---

## 10. AppFlow & AppSync (briefly)

- **AppFlow** — managed data integration between SaaS apps (Salesforce, ServiceNow, Slack, Marketo) and AWS data stores (S3, Redshift). Schedule, filter, transform.
- **AppSync** — managed GraphQL backend with real-time **subscriptions** (decoupled push to clients), backed by DynamoDB / Lambda / RDS / OpenSearch / HTTP. Useful for client-facing decoupling.

---

## 11. CROSS-SERVICE COMPARISON MATRIX

### Coupling & Delivery

| Service          | Model     | Delivery                  | Order             | Replay             | Push/Pull                 |
| ---------------- | --------- | ------------------------- | ----------------- | ------------------ | ------------------------- |
| SQS Standard     | Queue     | At-least-once             | Best-effort       | ❌                 | Pull                      |
| SQS FIFO         | Queue     | Exactly-once (5-min)      | Strict / Group ID | ❌                 | Pull                      |
| SNS Standard     | Pub/Sub   | At-least-once             | None              | ❌                 | Push                      |
| SNS FIFO         | Pub/Sub   | Exactly-once              | Strict            | ❌                 | Push                      |
| EventBridge      | Event bus | At-least-once             | None              | **Archive/Replay** | Push                      |
| Kinesis KDS      | Stream    | At-least-once             | Per shard         | **24h – 365d**     | Pull (or Lambda/EFO push) |
| Kinesis Firehose | Pipe      | At-least-once             | per delivery      | ❌                 | n/a                       |
| MSK              | Stream    | configurable              | Per partition     | log retention      | Pull                      |
| Amazon MQ        | Broker    | configurable per protocol | per queue/topic   | broker dep.        | both                      |

### Sizing & Quotas

| Service     | Max msg/event size       | Retention             | Max throughput                         |
| ----------- | ------------------------ | --------------------- | -------------------------------------- |
| SQS         | 256 KB (2 GB w/ S3 ext.) | 14 d                  | Standard unlimited; FIFO 3 K / 30 K HT |
| SNS         | 256 KB                   | n/a                   | Very high                              |
| EventBridge | 256 KB                   | Archive: configurable | Auto-scaled                            |
| KDS shard   | 1 MB record / 1 MB-s     | 24 h – 365 d          | per-shard limits                       |
| Firehose    | 1 MB record              | n/a                   | Auto-scaled                            |
| MSK         | configurable             | log size/time         | Cluster-bound                          |

---

## 12. DESIGN PATTERNS

### Pattern A — Web Tier → Async Workers

```
Client → API GW → Lambda (enqueue) → SQS → ASG of EC2 workers (or Lambda)
```

- API responds 202 + job ID immediately.
- Workers idempotent (Standard SQS = at-least-once).
- DLQ for poison messages.

### Pattern B — Pub/Sub Fan-Out with Filtering

```
Service ─► SNS ─┬─► SQS-orders   (filter: type=order)
                ├─► SQS-shipping (filter: type=ship)
                └─► Lambda-audit
```

### Pattern C — Event-Driven Microservices on EventBridge

```
Many producers ─► Custom EventBridge bus
                  ├─ rule: orders.created     → SQS-orders → service A
                  ├─ rule: orders.cancelled   → Step Functions
                  └─ rule: payments.failed    → SNS alerts → on-call
```

### Pattern D — Streaming Pipeline

```
Producers → KDS → ┬─► Lambda (per-record processing)
                  ├─► Flink (windowed aggregations)
                  └─► Firehose → S3 (data lake) → Athena / Redshift Spectrum
```

### Pattern E — Saga / Long-Running Workflow

```
Step Functions Standard
  Task: Reserve inventory  ── on fail ─► Compensation
  Task: Charge payment     ── on fail ─► Refund inventory
  Task: Ship order         ── on fail ─► Refund + restock
```

### Pattern F — Human-in-the-Loop Approval

- Step Functions Task with `waitForTaskToken` → sends approval link → user clicks → API GW → `SendTaskSuccess`.

### Pattern G — Backpressure with Lambda + SQS

- Lambda event-source mapping pulls from SQS.
- Set **Reserved Concurrency** on Lambda to cap throughput so downstream (e.g., RDS) isn't overwhelmed.
- Batch size & batching window control efficiency.

### Pattern H — Cross-Account / Cross-Region Decoupling

- SNS topic in account A with topic policy allowing account B to subscribe (or vice versa).
- EventBridge: cross-account event bus + rule that forwards events to bus in target account/region.
- Kinesis: producers from multiple accounts via IAM roles; cross-region via custom replication or `EnhancedFanOutConsumer` subscribers.

### Pattern I — Replay for Recovery

- EventBridge Archive enabled → if a downstream service had a bug, replay last X hours.
- KDS retention 7+ days → reprocess analytics.

---

## 13. SECURITY, MONITORING, COST

### Security

- **Encryption at rest** — KMS-managed keys on SQS, SNS, EventBridge, KDS, MSK, Firehose, MQ.
- **Encryption in transit** — TLS for all; mTLS optional for MSK, MQ.
- **Resource policies** — queue/topic/bus policies for cross-account access.
- **IAM** — fine-grained actions (`sqs:SendMessage`, `events:PutEvents`, `kinesis:PutRecord`).
- **VPC Endpoints (Interface)** — private connectivity for SQS, SNS, EventBridge, Kinesis, Step Functions.

### Monitoring

- **CloudWatch metrics**:
  - SQS: `ApproximateNumberOfMessagesVisible`, `Age of Oldest Message`, `NumberOfEmptyReceives`.
  - SNS: `NumberOfMessagesPublished`, `NumberOfNotificationsFailed`, per-subscription delivery.
  - EventBridge: `Invocations`, `FailedInvocations`, `TriggeredRules`.
  - KDS: `IncomingRecords`, `WriteProvisionedThroughputExceeded`, `IteratorAge` (consumer lag).
  - Step Functions: `ExecutionsStarted`, `ExecutionsFailed`, `ExecutionTime`.
- **X-Ray** — distributed tracing across Lambda, Step Functions, SQS, SNS.
- **CloudTrail** — control-plane API audit.

### Cost Tips

- **Use long polling** on SQS to cut request count.
- **Batch** API calls (`SendMessageBatch`, `PutRecords`).
- **Right-size Kinesis** — On-Demand for unpredictable, Provisioned for steady.
- **EventBridge** is cheaper than dedicated 3rd-party event routers, but **SNS is even cheaper** per message — pick by feature need, not just price.
- **Firehose** charges per GB ingested + per format conversion.
- **Step Functions Express** is dramatically cheaper than Standard for short, high-volume flows.

---

## 14. EXAM SCENARIOS & KEYWORD TRIGGERS

### Hot Triggers

| Question phrase                                           | Service                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| "decouple, buffer spikes, retry on failure"               | **SQS**                                                                        |
| "one publisher, many subscribers"                         | **SNS**                                                                        |
| "fan-out to different queues per message type"            | **SNS + filter policy**                                                        |
| "trigger Lambda on S3 / EC2 / Config / CodeDeploy event"  | **EventBridge**                                                                |
| "cron / scheduled task without managing servers"          | **EventBridge Scheduler**                                                      |
| "react to SaaS provider events (Zendesk, Datadog, Auth0)" | **EventBridge partner bus**                                                    |
| "real-time analytics on click-stream / IoT"               | **Kinesis Data Streams**                                                       |
| "land streaming data in S3 / Redshift / OpenSearch"       | **Kinesis Data Firehose**                                                      |
| "manage existing Kafka workload on AWS"                   | **MSK**                                                                        |
| "lift-and-shift JMS / AMQP / MQTT app"                    | **Amazon MQ**                                                                  |
| "orchestrate multiple Lambdas with retries and branching" | **Step Functions Standard**                                                    |
| "millions of short workflow executions / IoT events"      | **Step Functions Express**                                                     |
| "human approval as part of the workflow"                  | **Step Functions + `waitForTaskToken`**                                        |
| "exactly-once delivery and strict ordering"               | **SQS FIFO** (or **Kinesis** if streaming)                                     |
| "replay last 24 hours of events to fix a bug downstream"  | **EventBridge Archive & Replay** or **KDS retention replay**                   |
| "high-throughput strict order per customer"               | **Kinesis with customer-ID partition key** or **SQS FIFO Group ID = customer** |
| "process messages but consumer is offline sometimes"      | **SQS** (messages persist)                                                     |
| "API responds immediately; processing later"              | **SQS** behind API GW + Lambda                                                 |
| "DLQ for failed messages"                                 | **SQS Redrive** + DLQ                                                          |
| "Lambda fanout with batching"                             | **SNS → SQS → Lambda** (control batch & concurrency)                           |
| "broker between on-prem (JMS) and AWS apps"               | **Amazon MQ**                                                                  |
| "send the same event to multiple AWS accounts"            | **EventBridge cross-account bus**                                              |

### Anti-Patterns

- ❌ SQS for fan-out → use SNS (or SNS→SQS).
- ❌ SNS as a buffer (no retention) → use SNS→SQS.
- ❌ Kinesis Firehose when replay is required → use KDS (Firehose has none).
- ❌ Step Functions Standard for high-volume short events → use Express.
- ❌ Amazon MQ if no legacy protocol requirement → use cloud-native services.
- ❌ Visibility timeout less than expected processing time → duplicate processing.
- ❌ Using a low-cardinality SQS FIFO Group ID → no parallelism, throughput capped.

---

## 15. SELF-TEST

1. **Buffer & retry vs fan-out** — which is which service?
2. SQS FIFO TPS in high-throughput mode (batched)?
3. EventBridge Archive — does it work cross-region?
4. Difference between **Standard** and **Express** Step Functions in delivery semantics.
5. Kinesis Data Streams shard egress with vs without Enhanced Fan-Out.
6. Which service is needed when migrating an app that uses **JMS**?
7. How do you scale workers behind an SQS queue with an ASG?
8. SNS subscription filter policies — match against what?
9. Aurora-style "multi-active multi-Region" equivalent for a streaming workload?
10. Which decoupling service supports **SaaS partner events natively**?
11. When would you choose **Kinesis** over **SQS FIFO** for strict ordering?
12. How does **Step Functions** handle a step that must wait for a human approval?

> Answers
>
> 1. SQS = decouple/retry/buffer; SNS = fan-out.
> 2. **30,000 msg/s batched** (3,000 unbatched) with high-throughput mode.
> 3. Archive is per-bus; you can replay to any bus in the same region. Cross-region replication requires bus-to-bus rule forwarding.
> 4. Standard = **exactly-once**; Express = **at-least-once** (async) or **at-most-once** (sync).
> 5. Standard consumers share 2 MB/s per shard total; EFO gives 2 MB/s **per consumer** with HTTP/2 push.
> 6. **Amazon MQ** (ActiveMQ supports JMS natively).
> 7. ASG target tracking on a **custom CloudWatch metric** = `BacklogPerInstance = MessagesVisible / InstanceCount`.
> 8. Message **attributes** (default) or **payload** (opt-in, payload-based filtering).
> 9. **MSK with MirrorMaker / replicator**, or **Kinesis cross-region replication** via consumer→producer. Kinesis itself is single-Region; multi-Region requires custom.
> 10. **EventBridge** (Partner Event Sources).
> 11. **Streaming throughput** above SQS FIFO limits, or multiple parallel consumers each needing the full event log with replay.
> 12. **`waitForTaskToken`** integration — the task issues a token, the workflow pauses, and an external system (e.g., human via UI) calls `SendTaskSuccess`/`SendTaskFailure` to resume.
