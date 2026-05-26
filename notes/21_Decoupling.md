# AWS SAA-C03 — Decoupling Cheat Sheet (Concise)

> One-page recap of the AWS decoupling stack: **SQS, SNS, EventBridge, Step Functions, Kinesis, MSK, MQ**. Pick by coupling style + delivery semantics + scale.

---

## THE 5-AXIS DECISION MODEL

| Axis | Ask… | Likely service |
|------|------|----------------|
| **Coupling** | Sync vs async? | Sync → API GW/ALB · Async → SQS/SNS/EventBridge |
| **Pattern** | 1→1, 1→many, many→many? | 1→1 = SQS · 1→many = SNS · many→many = EventBridge |
| **Ordering** | FIFO required? | SQS FIFO, SNS FIFO, Kinesis (per shard) |
| **Replay / history** | Can later consumers replay? | **Kinesis, MSK** (yes) · SQS/SNS (no) |
| **Workflow / state** | Multi-step orchestration? | **Step Functions** |

---

## SERVICE ONE-LINERS

| Service | One-liner |
|---------|-----------|
| **SQS Standard** | Pull-based, at-least-once, best-effort order, near-unlimited throughput |
| **SQS FIFO** | Exactly-once + strict order, 300 msg/s (3000 with batching), 3000 with high-throughput mode |
| **SNS** | Push-based pub/sub fan-out to many subscribers |
| **SNS FIFO** | Ordered fan-out to SQS FIFO subscribers |
| **EventBridge** | Serverless event bus with rules, schema registry, SaaS partner sources, schedules |
| **Step Functions** | Visual JSON-defined workflow (Standard or Express) |
| **Kinesis Data Streams** | Real-time streaming, shard-based, replay up to 365 days |
| **Kinesis Data Firehose** | Managed delivery to S3 / Redshift / OpenSearch / Splunk; near-real-time |
| **MSK** | Managed Apache Kafka |
| **Amazon MQ** | Managed ActiveMQ / RabbitMQ for legacy JMS/AMQP/MQTT/STOMP apps |

---

## SQS — KEY FACTS

| Item | Value |
|------|-------|
| Message size | **256 KB** (use **S3 Extended Client** for up to 2 GB) |
| Retention | 1 min – **14 days** (default 4 days) |
| Visibility timeout | 0s – **12 hours** (default 30s) |
| Receive long-poll | 0 – **20 seconds** |
| Delivery delay | 0 – **15 minutes** |
| Max in-flight | **120K** (Standard), **20K** (FIFO) |
| Throughput Standard | Unlimited |
| Throughput FIFO | 300 / 3,000 batched (default) → **3,000 / 30,000** with high-throughput mode |
| Delivery | **At-least-once** (Standard) · **Exactly-once** (FIFO) |
| Pull or push | **Pull only** (consumers poll) |
| Encryption | SSE-SQS (default) / SSE-KMS |

### Patterns to remember
- **Dead-Letter Queue (DLQ)** = after N receives, move to a DLQ for later inspection. DLQ must be **same type** (FIFO ↔ FIFO).
- **Visibility timeout > task time** else duplicate processing.
- **ASG with SQS** = scale on `ApproximateNumberOfMessagesVisible` (backlog-per-instance custom metric).
- **Message Group ID** in FIFO = ordering scope; parallel consumers across groups.
- **Deduplication ID** in FIFO = window of 5 min for dedupe.

---

## SNS — KEY FACTS

- **Push** pub/sub. Up to **12.5M subscriptions per topic**, **100K topics per account**.
- Subscribers: SQS, Lambda, HTTP/S, Email, SMS, Kinesis Firehose, mobile push, in-app.
- **Filter policies** on message attributes → route different messages to different SQS queues from **one** topic.
- **SNS FIFO** → fan-out ordered to **SQS FIFO** subscribers.
- **Message size 256 KB.**

### Fan-out pattern
```
Producer ──► SNS Topic ──┬── filter:type=order  ──► SQS-orders
                         ├── filter:type=refund ──► SQS-refunds
                         └── Lambda
```

---

## EventBridge — KEY FACTS

- Successor of CloudWatch Events. **Default bus** + **custom buses** + **partner buses**.
- **Event Patterns** match JSON → trigger up to 5 targets per rule.
- **Schedules** (cron / rate) + new **EventBridge Scheduler** for 1-time / recurring at scale.
- **Schema Registry & Discovery** (auto-infer event schemas → typed code bindings).
- **Archive + Replay** events (great for testing, audit, recovery).
- **Pipes**: source (SQS/Kinesis/DynamoDB Streams/MSK/MQ) → optional filter/enrich → target.

> **SNS vs EventBridge**: SNS = fast pub/sub fan-out, simple. EventBridge = richer matching, AWS-service events, SaaS partners, schedules, archive/replay.

---

## STEP FUNCTIONS — KEY FACTS

| Workflow type | Use | Duration | Pricing | Execution history |
|--------------|-----|----------|---------|-------------------|
| **Standard** | Long-running, durable workflows | up to **1 year** | per state transition | retained 90 days |
| **Express** | High-volume, short-lived event processing | up to **5 min** | per execution + duration | via CloudWatch Logs |

- States: Task, Choice, Wait, Parallel, **Map** (iteration), Pass, Succeed, Fail.
- **Service integrations**: Optimized (Lambda, ECS, SNS, SQS, DynamoDB, EMR, Glue, etc.) + AWS SDK (200+ services).
- **Wait-for-callback** (`waitForTaskToken`) — pause until a human/system returns the token.
- **Error handling** with `Retry` / `Catch` blocks.

---

## KINESIS — KEY FACTS

| Service | Use |
|---------|-----|
| **Kinesis Data Streams (KDS)** | Real-time ingest, per-record processing, **shard-based**, custom consumers |
| **Kinesis Data Firehose** | Managed near-real-time delivery to S3/Redshift/OpenSearch/Splunk/HTTP, optional transform via Lambda |
| **Kinesis Data Analytics** / **Managed Service for Apache Flink** | SQL or Flink on streams |
| **Kinesis Video Streams** | Video ingest |

### KDS facts
- **Shard** = 1 MB/s in or 1,000 msg/s in; **2 MB/s out** shared (or **2 MB/s per consumer** with Enhanced Fan-Out).
- **Provisioned** or **On-Demand** capacity.
- **Retention 24h default → up to 365 days** (replay window).
- Partition key → hashed → shard. Hot key = hot shard.

### Firehose facts
- **Near-real-time** (60s+ buffer or 1 MB+ buffer).
- **No replay**, no shards, no consumers — just delivery.
- **Conversion** to Parquet/ORC, dynamic partitioning to S3.

---

## MSK & AMAZON MQ

| | MSK (Kafka) | Amazon MQ |
|---|-------------|-----------|
| Use | Cloud-native streaming, replace self-managed Kafka | Lift-and-shift legacy apps using **JMS / AMQP 1.0 / MQTT / STOMP / OpenWire** |
| Replay | Yes (Kafka log) | Limited |
| Throughput | Very high | Moderate |
| Pick when… | Already on Kafka, ecosystem (Connect/Streams) | Existing JMS/RabbitMQ apps |

---

## DELIVERY / ORDERING / DEDUP MATRIX

| Service | Delivery | Order | Dedup |
|---------|----------|-------|-------|
| **SQS Standard** | At-least-once | Best-effort | App-level |
| **SQS FIFO** | Exactly-once (in 5-min window) | Strict per Group ID | Built-in (Dedup ID) |
| **SNS Standard** | At-least-once | None | App-level |
| **SNS FIFO** | Exactly-once | Strict per Group ID | Built-in |
| **EventBridge** | At-least-once | No global order | App-level |
| **Kinesis (per shard)** | At-least-once | **Strict per shard** | App-level |
| **MSK / Kafka** | At-least-once (configurable up to exactly-once) | Per partition | App-level |

---

## KEYWORD TRIGGERS

| Question says… | Pick |
|----------------|------|
| "Decouple producers from slow consumers" | **SQS** |
| "Buffer / retry / spike absorb" | **SQS** |
| "Fan-out to many subscribers" | **SNS** |
| "One topic, different SQS per message type" | **SNS + filter policies** |
| "Trigger on AWS service event (S3 upload, EC2 state)" | **EventBridge** |
| "Cron / scheduled invocation, serverless" | **EventBridge Scheduler** |
| "Audit + replay events later" | **EventBridge Archive & Replay** or **Kinesis** |
| "Orchestrate multi-step workflow with retries" | **Step Functions** |
| "Long-running (hours/days) workflow w/ human approval" | **Step Functions Standard** + `waitForTaskToken` |
| "High-volume short events" | **Step Functions Express** |
| "Real-time streaming with replay" | **Kinesis Data Streams** |
| "Stream to S3/Redshift/OpenSearch with no code" | **Kinesis Data Firehose** |
| "Strict ordering + exactly-once + low TPS" | **SQS FIFO** |
| "Strict ordering + high throughput streaming" | **Kinesis** (per shard) |
| "Migrate JMS / RabbitMQ legacy app to AWS" | **Amazon MQ** |
| "Managed Apache Kafka" | **MSK** |

---

## ANTI-PATTERNS

- ❌ **SQS for pub/sub fan-out** — use SNS (or SNS→SQS) instead.
- ❌ **SNS for buffering/retry** — SNS is push; if a target is down, no buffer. Use SNS → SQS so the queue absorbs.
- ❌ **Kinesis for simple queueing** — overkill unless you need replay / multiple parallel consumers / high throughput.
- ❌ **Step Functions to glue two Lambdas** — direct Lambda invocation is simpler; use SF when you have ≥ 3 steps, branching, retries, or human steps.
- ❌ **EventBridge when SNS suffices** — EB has higher latency; SNS is faster pub/sub.
- ❌ **SQS visibility timeout < job time** — guarantees duplicates.

---

## SELF-TEST PROMPTS

1. SQS vs SNS — which is push?
2. Which decoupling service preserves a replay window of up to 365 days?
3. One SNS topic → 3 SQS queues per event type — what feature?
4. Long-running approval workflow with human input — service + pattern?
5. SQS FIFO ordering boundary — what's the key called?
6. Firehose vs Kinesis Data Streams — which has replay?
7. Right service to react to "S3 ObjectCreated" in another account?
8. SQS visibility timeout default and max?
9. Difference between Step Functions Standard and Express?
10. Amazon MQ — when do you pick it over SNS/SQS?

> Answers: (1) SNS push, SQS pull. (2) Kinesis Data Streams (or MSK). (3) SNS subscription **filter policies** on attributes. (4) Step Functions Standard + `waitForTaskToken`. (5) **Message Group ID**. (6) KDS (Firehose has none). (7) EventBridge (cross-account event bus). (8) 30s default, **12 h** max. (9) Standard: long-running (≤1 year), durable, per state-transition pricing. Express: high-volume short (≤5 min), per execution + duration. (10) When migrating **legacy JMS/AMQP/MQTT/STOMP** apps — protocol compatibility matters more than cloud-native.
