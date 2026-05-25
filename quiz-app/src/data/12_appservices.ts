import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic12: Topic = {
  id: "12-appservices",
  number: "12",
  title: "Application Integration",
  weight: "Critical",
  blurb: "SQS, SNS, EventBridge, Step Functions, API Gateway, AppSync, MQ.",
  sections: [
    {
      id: "svc-select",
      title: "Service Selection",
      questions: [
        match("12-sl-m1", "Match each scenario to service.", [
          { left: "Decoupled queue, async, retain msgs", right: "SQS" },
          { left: "Pub/sub fan-out push", right: "SNS" },
          { left: "Event routing on patterns", right: "EventBridge" },
          { left: "Workflow orchestration", right: "Step Functions" },
          { left: "REST/HTTP/WebSocket API", right: "API Gateway" },
          { left: "GraphQL API", right: "AppSync" },
          { left: "Existing RabbitMQ / ActiveMQ", right: "Amazon MQ" },
        ]),
      ],
    },
    {
      id: "sqs-standard-fifo",
      title: "SQS Standard vs FIFO",
      questions: [
        match("12-sq-m1", "Match each property.", [
          {
            left: "Standard ordering",
            right: "Best-effort, can be out-of-order",
          },
          { left: "FIFO ordering", right: "Strict in-order" },
          {
            left: "Standard duplicates",
            right: "At-least-once (possible dupes)",
          },
          {
            left: "FIFO duplicates",
            right: "Exactly-once within 5 min window",
          },
          { left: "Standard throughput", right: "Unlimited" },
          {
            left: "FIFO throughput",
            right: "300 TPS (3000 with batching, or high-throughput mode)",
          },
          { left: "FIFO suffix", right: ".fifo required" },
        ]),
        mcq(
          "12-sq-1",
          "Order-critical financial transactions:",
          ["SQS Standard", "SQS FIFO", "SNS Standard", "EventBridge"],
          1,
          "FIFO guarantees order + exactly-once.",
        ),
      ],
    },
    {
      id: "sqs-limits",
      title: "SQS Limits & Settings",
      questions: [
        match("12-sl2-m1", "Match each SQS setting.", [
          {
            left: "Default retention",
            right: "4 days (min 60 s, max 14 days)",
          },
          {
            left: "Max message size",
            right: "256 KB (or use Extended Library for S3)",
          },
          { left: "Visibility timeout", right: "Default 30 s; range 0 s–12 h" },
          { left: "Long polling", right: "1–20 s reduces empty receives" },
          { left: "DLQ", right: "After max-receives, send to DLQ" },
          { left: "Delay queue", right: "Up to 15 min delay before visible" },
        ]),
        mcq(
          "12-sl2-1",
          "Avoid duplicate processing when consumer crashes after receiving msg:",
          [
            "Lower visibility timeout",
            "Increase visibility timeout",
            "Use long polling",
            "Reduce retention",
          ],
          1,
          "Make visibility ≥ processing time so msg stays hidden.",
        ),
        mcq(
          "12-sl2-2",
          "Message size up to 2 GB needed:",
          [
            "Not possible",
            "Use Extended Client Library + S3",
            "Use SNS",
            "Use FIFO",
          ],
          1,
          "SQS Extended stores body in S3, pointer in queue.",
        ),
      ],
    },
    {
      id: "sns",
      title: "SNS",
      questions: [
        match("12-sn-m1", "Match each SNS feature.", [
          { left: "Pattern", right: "Pub/sub push, fan-out" },
          {
            left: "Subscribers",
            right: "SQS / Lambda / HTTP(S) / Email / SMS / Firehose / Mobile",
          },
          {
            left: "FIFO Topics",
            right: "Ordering + dedup (fan-out to FIFO queues)",
          },
          {
            left: "Filter policies",
            right: "Per-subscription message filtering",
          },
          { left: "Message attributes", right: "Used for filtering" },
        ]),
        mcq(
          "12-sn-1",
          "One event must trigger Lambda, email, and an SQS queue:",
          [
            "SQS only",
            "SNS with multiple subscribers",
            "EventBridge only",
            "Direct call",
          ],
          1,
          "SNS fan-out — one publish, multiple subscribers.",
        ),
      ],
    },
    {
      id: "eb",
      title: "EventBridge",
      questions: [
        match("12-eb-m1", "Match each EB concept.", [
          { left: "Event Bus", right: "Default / custom / partner buses" },
          { left: "Rules", right: "Pattern + targets" },
          {
            left: "Schema Registry",
            right: "Discover & version event schemas",
          },
          {
            left: "Pipes",
            right: "Source → enrich → target (replaces glue code)",
          },
          { left: "Scheduler", right: "Cron / one-time at scale" },
          {
            left: "SaaS partners",
            right: "Direct events from Datadog, Zendesk, etc.",
          },
        ]),
        mcq(
          "12-eb-1",
          "Trigger a Lambda when a SaaS partner sends an event:",
          ["SNS", "EventBridge partner event bus", "API Gateway", "SQS"],
          1,
          "EventBridge supports SaaS partner sources.",
        ),
      ],
    },
    {
      id: "eb-vs-sns",
      title: "EventBridge vs SNS",
      questions: [
        match("12-es-m1", "Match each trait.", [
          { left: "Throughput", right: "SNS higher; EB lower" },
          { left: "Latency", right: "SNS sub-100ms; EB ~0.5s" },
          { left: "Schema registry", right: "EventBridge" },
          { left: "SaaS integrations", right: "EventBridge" },
          { left: "Fan-out to SMS / mobile push", right: "SNS" },
          { left: "Rich filtering on JSON content", right: "EventBridge" },
        ]),
      ],
    },
    {
      id: "sf",
      title: "Step Functions",
      questions: [
        match("12-sf-m1", "Match each Step Functions workflow type.", [
          {
            left: "Standard",
            right: "Long-running (up to 1 year), exactly-once, audited",
          },
          {
            left: "Express",
            right: "Short (≤5 min), high-volume, at-least-once",
          },
        ]),
        mcq(
          "12-sf-1",
          "Coordinate 12-step ETL pipeline that runs for hours:",
          [
            "Lambda alone",
            "Step Functions Standard",
            "Step Functions Express",
            "SQS",
          ],
          1,
          "Long-running orchestration = Standard.",
        ),
      ],
    },
    {
      id: "apigw-types",
      title: "API Gateway Types",
      questions: [
        match("12-ag-m1", "Match each API Gateway type.", [
          {
            left: "REST API",
            right: "Full features (validation, caching, transforms)",
          },
          { left: "HTTP API", right: "Lower cost / lower latency; OIDC/JWT" },
          { left: "WebSocket API", right: "Real-time bidirectional" },
          { left: "Private API", right: "Only reachable inside VPC" },
        ]),
        mcq(
          "12-ag-1",
          "Simple JWT-authenticated low-cost API:",
          ["REST API", "HTTP API", "WebSocket", "AppSync"],
          1,
          "HTTP API is the lower-cost modern option.",
        ),
      ],
    },
    {
      id: "apigw-auth",
      title: "API Gateway Authentication",
      questions: [
        match("12-au-m1", "Match each auth method.", [
          { left: "IAM auth", right: "AWS SigV4 callers" },
          { left: "Cognito User Pool authorizer", right: "JWT from User Pool" },
          {
            left: "Lambda authorizer",
            right: "Custom token/identity validation",
          },
          { left: "API Keys + Usage Plans", right: "Rate-limit per consumer" },
          { left: "Mutual TLS", right: "Client cert auth" },
        ]),
      ],
    },
    {
      id: "appsync",
      title: "AppSync",
      questions: [
        match("12-ap-m1", "Match each AppSync fact.", [
          { left: "API style", right: 