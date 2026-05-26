# Decoupling — Ultra Fast Learn

> Cram sheet. Read top-to-bottom in 5 minutes before the exam.

---

## THE BIG SIX

| Service            | Role                          | Push/Pull                           | Ordering       | Replay              |
| ------------------ | ----------------------------- | ----------------------------------- | -------------- | ------------------- |
| **SQS**            | Queue (1→1)                   | Pull                                | FIFO type only | ❌                  |
| **SNS**            | Pub/sub fan-out (1→many)      | Push                                | FIFO type only | ❌                  |
| **EventBridge**    | Event bus + rules + schedules | Push                                | ❌             | ✅ Archive & Replay |
| **Step Functions** | Workflow orchestrator         | n/a                                 | n/a            | n/a                 |
| **Kinesis**        | Streaming pipe                | Pull (KDS) / Push (Firehose target) | Per-shard      | ✅ up to 365 d      |
| **MQ / MSK**       | Legacy JMS / Managed Kafka    | both                                | per partition  | MSK: ✅             |

---

## INSTANT PICKS

| Need                                         | Pick                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------- |
| Decouple, retry, buffer spikes               | **SQS**                                                               |
| Fan-out to many                              | **SNS**                                                               |
| Fan-out to different queues by type          | **SNS + filter policy**                                               |
| Trigger on AWS service event                 | **EventBridge**                                                       |
| Cron-style schedule                          | **EventBridge Scheduler**                                             |
| Multi-step workflow / human approval         | **Step Functions** (Standard for long, Express for short/high-volume) |
| Real-time stream + replay                    | **Kinesis Data Streams**                                              |
| Deliver stream to S3 / Redshift / OpenSearch | **Kinesis Data Firehose**                                             |
| Strict order + exactly-once + low TPS        | **SQS FIFO**                                                          |
| Strict order + high throughput               | **Kinesis**                                                           |
| Migrate ActiveMQ / RabbitMQ                  | **Amazon MQ**                                                         |
| Managed Kafka                                | **MSK**                                                               |

---

## SQS NUMBERS

- **256 KB** msg (S3 extension for 2 GB)
- **14 days** max retention (4 d default)
- **12 h** max visibility (30 s default)
- **20 s** max long-poll wait
- **15 min** max delay
- **FIFO**: 300 / 3,000 batched → 3,000 / 30,000 high-throughput
- **DLQ** must match queue type (FIFO ↔ FIFO)

## SNS NUMBERS

- **256 KB** msg, **100 K** topics, **12.5 M** subs/topic
- **Filter policy** on message attributes
- Subscribers: SQS, Lambda, HTTP/S, Email, SMS, Firehose, Mobile push

## EventBridge

- Buses: **default + custom + partner**
- **Rules** match JSON pattern → up to **5 targets**
- **Schedules** + **EventBridge Scheduler**
- **Schema registry**, **Archive & Replay**, **Pipes**

## Step Functions

- **Standard**: ≤ 1 year, per state-transition $, retained 90 d
- **Express**: ≤ 5 min, per execution $
- States: Task, Choice, Wait, Parallel, **Map**, Pass, Succeed, Fail
- `waitForTaskToken` = pause for human/external callback

## Kinesis

- **Shard** = 1 MB/s in, 2 MB/s out (shared) or 2 MB/s per consumer **Enhanced Fan-Out**
- **Provisioned** or **On-Demand**
- **Retention** 24 h default → 365 d max
- **Firehose** = managed delivery, 60-s buffer min, **no replay**

---

## ONE-LINE TRAPS

- ❌ SQS does NOT do fan-out (use SNS or SNS→SQS).
- ❌ SNS does NOT buffer (target must be up or use SNS→SQS).
- ❌ Standard SQS = **at-least-once** → app must be idempotent.
- ❌ Visibility timeout < job runtime = duplicates.
- ❌ FIFO ordering is per **Message Group ID**, not per queue.
- ❌ Kinesis ordering is per **shard**, not global.
- ❌ Firehose has no replay; pick KDS if you need replay.
- ❌ Step Functions billed per **state transition** (Standard) — keep states lean.
- ❌ Amazon MQ if and only if **legacy protocol** required (JMS/AMQP/MQTT/STOMP).

---

## SQS vs SNS vs EventBridge — 10-Second Comparison

|                    | SQS   | SNS                  | EventBridge                      |
| ------------------ | ----- | -------------------- | -------------------------------- |
| Model              | Queue | Pub/Sub              | Event bus                        |
| Consumers          | Pull  | Push                 | Push                             |
| Routing            | None  | All subs (or filter) | Pattern matching, multiple buses |
| AWS service events | No    | Some                 | **Yes (native)**                 |
| Scheduling         | No    | No                   | **Yes**                          |
| Archive/Replay     | No    | No                   | **Yes**                          |
| Latency            | low   | very low             | slightly higher                  |

---

## FINAL EXAM REFLEXES

- "Decouple" → SQS
- "Fan-out" → SNS
- "Filter different messages to different queues" → SNS + filter policy
- "S3 / EC2 / AWS service event triggers Lambda" → EventBridge
- "Orchestrate" → Step Functions
- "Stream + replay" → Kinesis
- "Stream → S3/Redshift/OpenSearch" → Firehose
- "Exactly-once + order" → SQS FIFO (or Kinesis if streaming)
- "Legacy JMS/AMQP" → Amazon MQ
- "Managed Kafka" → MSK
