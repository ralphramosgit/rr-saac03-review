# AWS SAA-C03 — 12 · Application Integration Services

> SQS, SNS, EventBridge, Step Functions, API Gateway, AppSync, MQ, SWF. **High weight — decoupling patterns.**

---

## SERVICE SELECTION — Decoupling

| Pattern | Service |
|---------|---------|
| Producer queues messages, **one consumer** processes (or competing consumers) | **SQS** |
| **Fan-out** one message to many subscribers (email/SMS/HTTP/SQS/Lambda) | **SNS** |
| Event-driven, **multi-source, schema, schedule, pattern match** | **EventBridge** |
| Orchestrate multi-step workflow with state | **Step Functions** |
| API front door (REST/HTTP/WebSocket) | **API Gateway** |
| GraphQL with realtime + offline | **AppSync** |
| Standards-based MQ (JMS, AMQP, MQTT, STOMP, OpenWire) — migrating from IBM/RabbitMQ | **Amazon MQ** |

---

## Amazon SQS

**One-liner:** Fully managed pull-based message queue. Decouples producers and consumers.

### Standard vs FIFO

| | Standard | FIFO |
|---|----------|------|
| Order | **Best-effort** | **Strict, per MessageGroupId** |
| Delivery | **At-least-once** | **Exactly-once** processing |
| Throughput | Unlimited | 300 TPS / 3000 TPS w/ batching; up to 70K with **high-throughput FIFO** |
| Name suffix | (any) | `.fifo` required |
| Dedup | App-level | 5-min content-based or explicit dedup ID |

### Limits / Rules

| Item | Detail |
|------|--------|
| Message size | **256 KB** (use **S3 + Extended Client Library** for up to 2 GB) |
| Retention | 1 min – **14 days** (default 4 days) |
| Visibility timeout | 0 s – 12 hr (default 30 s) — increase if processing > timeout |
| Long polling | `ReceiveMessageWaitTimeSeconds` 1–20 s — reduces empty responses |
| Delay queue | 0–15 min initial delay |
| Batch | 1–10 messages per send/receive/delete |
| DLQ | Send failed messages after `maxReceiveCount`; **same type** (Standard→Standard, FIFO→FIFO) |
| Encryption | KMS SSE, in-transit HTTPS |

> **Rule:** Increase **visibility timeout** if consumer is slow → prevents duplicate processing.
> **Keyword:** "decouple producer & consumer, retry on failure" → **SQS + DLQ**.
> **Keyword:** "strict order, no duplicates" → **SQS FIFO**.

---

## Amazon SNS

**One-liner:** Push-based pub/sub. Producer publishes once → all subscribers receive.

| Item | Detail |
|------|--------|
| **Subscribers** | SQS, Lambda, HTTP(S), email, SMS, mobile push, Firehose |
| **Standard topic** | High throughput, best-effort order, at-least-once |
| **FIFO topic** | Strict order, exactly-once; subscribers must be SQS FIFO |
| **Message filtering** | Subscription filter policies (JSON) → fan-out subset |
| **Fan-out pattern** | SNS → multiple SQS queues per service |
| **DLQ** | Per-subscription |
| **Encryption** | KMS at rest, HTTPS in transit |
| **Message size** | 256 KB |

> **Keyword:** "broadcast event to many systems" → **SNS fan-out**.
> **Keyword:** "send email + SMS notifications" → **SNS**.

---

## Amazon EventBridge

**One-liner:** Serverless event bus. Source → rule (event pattern) → target. Schema registry, scheduling, partners.

| Feature | Detail |
|---------|--------|
| **Default bus** | AWS service events |
| **Custom bus** | Your application events |
| **Partner bus** | SaaS partners (Zendesk, Datadog, etc.) |
| **Rules** | JSON pattern or schedule (cron/rate) |
| **Targets** | 30+ AWS services (Lambda, SF, SQS, SNS, Kinesis, ECS task, API destination) |
| **Schema Registry** | Discover & version event schemas |
| **Pipes** | Point-to-point with filter/enrich/target (replaces a lot of glue Lambdas) |
| **Scheduler** | Unified scheduled events (replacement for CWE-only scheduled rules) |

### EventBridge vs SNS

| | EventBridge | SNS |
|---|-------------|-----|
| Pattern matching | Rich JSON match | Simple subject/attribute filter |
| Targets | 30+ AWS | Limited list (SQS/Lambda/HTTP/Email/SMS/etc.) |
| Throughput / latency | Higher latency (~0.5 s) | Lower latency, higher throughput |
| Pricing | Per event | Per request |
| Schemas | Yes | No |

> **Keyword:** "react to AWS service events / schedule / SaaS events with pattern matching" → **EventBridge**.
> **Keyword:** "highest throughput pub/sub" → **SNS**.

---

## AWS Step Functions

**One-liner:** Serverless visual workflow / state machine. Orchestrates Lambda, ECS, SNS, SQS, EventBridge, Glue, SageMaker, etc.

| Workflow Type | Duration | Execution Model | Use |
|---------------|----------|-----------------|-----|
| **Standard** | Up to 1 year | At-most-once | Long, auditable workflows |
| **Express** | Up to 5 minutes | At-least-once or sync | High-volume, short, IoT/streaming |

States: Task, Choice, Parallel, Map, Wait, Pass, Succeed, Fail.

> **Keyword:** "coordinate Lambda + manual approvals + retries" → **Step Functions Standard**.
> **Keyword:** "high-throughput stream of short workflows" → **Step Functions Express**.

---

## API Gateway

**One-liner:** Managed front door for APIs.

| API Type | Use | Features |
|----------|-----|----------|
| **REST** | Full-feature | Caching, request validation, transformations, usage plans, API keys, WAF |
| **HTTP** | Cheaper, lower latency | JWT auth, OIDC, ~70% cheaper, no caching, no req transformation |
| **WebSocket** | Realtime bidirectional | Chat, notifications |

### Integrations
Lambda, HTTP, AWS services (e.g., direct DynamoDB PutItem), mock.

### Authentication & Authorization

| Method | Use |
|--------|-----|
| **IAM** | Internal service-to-service |
| **Cognito User Pools authorizer** | End-user auth (JWT) |
| **Lambda authorizer** | Custom (e.g., 3rd-party JWT) |
| **API keys + Usage Plans** | Rate limiting & metering (REST only) |

### Other features
- Throttling per stage, per key.
- Caching (REST): 0.5 GB–237 GB; TTL.
- Stages + canary deployments.
- Mutual TLS, custom domains, WAF (REST), edge-optimized / regional / private endpoints.

> **Keyword:** "lowest-cost REST API for Lambda" → **HTTP API**.
> **Keyword:** "rate-limit per customer with API keys" → **REST API + Usage Plans**.

---

## AppSync

Managed GraphQL. Realtime subscriptions, offline sync (Amplify DataStore). Sources: DynamoDB, RDS, Lambda, OpenSearch, HTTP.

> **Keyword:** "single GraphQL endpoint with realtime + offline" → **AppSync**.

---

## Amazon MQ

Managed Apache ActiveMQ / RabbitMQ. Use when migrating from on-prem messaging with **JMS, AMQP, MQTT, STOMP, OpenWire**. For new cloud-native, prefer SQS/SNS.

> **Keyword:** "migrate JMS app to AWS" → **Amazon MQ**.

---

## SQS vs SNS vs EventBridge vs Kinesis — Mental Model

| | SQS | SNS | EventBridge | Kinesis |
|---|----|----|-------------|---------|
| Style | Pull queue | Push pub/sub | Push event bus | Stream |
| Consumers | 1 (per message) | Many | Many | Many (replay) |
| Order | FIFO option | FIFO option | No | Per shard |
| Retention | 14 days max | None (delivered or DLQ) | 24h archive (opt) | 24h–365d |
| Use | Decouple work | Fan-out notify | Event-driven w/ pattern | Real-time streaming |

---

## Self-Test

- SQS max message size? How to send larger?
- Standard vs FIFO — when each?
- Default vs custom EventBridge bus?
- Standard vs Express Step Functions?
- HTTP vs REST API Gateway — which has caching & API keys?
- SNS fan-out pattern — what does it solve?
