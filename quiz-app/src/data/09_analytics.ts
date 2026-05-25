import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic09: Topic = {
  id: "09-analytics",
  number: "09",
  title: "Analytics",
  weight: "Important",
  blurb:
    "Athena, Glue, EMR, Kinesis, MSK, OpenSearch, QuickSight, Lake Formation.",
  sections: [
    {
      id: "analytics-select",
      title: "Analytics Service Selection",
      questions: [
        match("09-sl-m1", "Match each use case.", [
          { left: "Ad-hoc SQL on S3", right: "Athena" },
          { left: "ETL / data catalog", right: "Glue" },
          { left: "Hadoop / Spark cluster", right: "EMR" },
          {
            left: "Real-time streaming",
            right: "Kinesis (Data Streams / Firehose / Analytics)",
          },
          { left: "Managed Kafka", right: "MSK" },
          { left: "Search / log analytics", right: "OpenSearch" },
          { left: "BI dashboards", right: "QuickSight" },
          { left: "Data lake governance", right: "Lake Formation" },
          { left: "Petabyte warehouse", right: "Redshift" },
        ]),
      ],
    },
    {
      id: "athena",
      title: "Amazon Athena",
      questions: [
        match("09-at-m1", "Match each Athena fact.", [
          { left: "Engine", right: "Serverless Presto (Trino)" },
          { left: "Data source", right: "S3 (and federated via connectors)" },
          { left: "Pricing", right: "Per TB scanned ($5/TB)" },
          {
            left: "Optimize cost",
            right: "Columnar (Parquet/ORC) + partition + compress",
          },
          { left: "Catalog", right: "Uses Glue Data Catalog" },
        ]),
        mcq(
          "09-at-1",
          "Best way to reduce Athena scan cost:",
          [
            "Use JSON",
            "Use CSV",
            "Use Parquet + partitioning",
            "Use uncompressed text",
          ],
          2,
          "Columnar + partitioning minimizes data scanned.",
        ),
      ],
    },
    {
      id: "glue",
      title: "AWS Glue",
      questions: [
        match("09-gl-m1", "Match each Glue component.", [
          { left: "Data Catalog", right: "Central metadata store" },
          { left: "Crawler", right: "Discover schema from S3/JDBC" },
          { left: "ETL Jobs", right: "PySpark/Scala serverless" },
          { left: "Glue Studio", right: "Visual ETL builder" },
          { left: "DataBrew", right: "No-code visual data prep" },
          { left: "Workflows", right: "Orchestrate crawlers + jobs" },
        ]),
        mcq(
          "09-gl-1",
          "Non-developer wants visual data prep:",
          ["Glue ETL", "EMR", "DataBrew", "Athena"],
          2,
          "DataBrew is no-code visual.",
        ),
      ],
    },
    {
      id: "emr-nodes",
      title: "EMR Node Types",
      questions: [
        match("09-en-m1", "Match each EMR node role.", [
          { left: "Master / Primary", right: "Coordinator, HDFS NameNode" },
          { left: "Core", right: "Run tasks + HDFS storage" },
          { left: "Task", right: "Compute only, no HDFS (great for Spot)" },
        ]),
        mcq(
          "09-en-1",
          "Reduce EMR costs without risking HDFS data:",
          [
            "Spot for Master",
            "Spot for Core",
            "Spot for Task",
            "On-Demand only",
          ],
          2,
          "Task nodes are stateless — safe to use Spot.",
        ),
      ],
    },
    {
      id: "emr-features",
      title: "EMR Features",
      questions: [
        match("09-ef-m1", "Match each EMR feature.", [
          {
            left: "Frameworks",
            right: "Hadoop, Spark, HBase, Presto, Hive, Flink",
          },
          { left: "EMR Serverless", right: "No cluster mgmt" },
          { left: "EMR on EKS", right: "Run Spark on Kubernetes" },
          { left: "EMR Notebooks", right: "Jupyter-style interactive" },
          { left: "EMRFS", right: "S3 as Hadoop filesystem" },
        ]),
      ],
    },
    {
      id: "kinesis",
      title: "Kinesis Family",
      questions: [
        match("09-ki-m1", "Match each Kinesis service.", [
          {
            left: "Kinesis Data Streams",
            right: "Real-time shards, custom consumer, 1d–365d retention",
          },
          {
            left: "Kinesis Data Firehose",
            right: "Managed delivery to S3/Redshift/OpenSearch (~60s)",
          },
          { left: "Kinesis Data Analytics", right: "SQL/Flink on streams" },
          {
            left: "Kinesis Video Streams",
            right: "Video ingestion + playback",
          },
        ]),
        mcq(
          "09-ki-1",
          "Stream logs to S3 with no infrastructure to manage:",
          ["KDS", "Firehose", "MSK", "EventBridge"],
          1,
          "Firehose is the simplest near-real-time delivery.",
        ),
        mcq(
          "09-ki-2",
          "Need replay / multiple independent consumers:",
          ["Firehose", "Kinesis Data Streams", "SQS", "SNS"],
          1,
          "KDS retains data and supports multi-consumer.",
        ),
      ],
    },
    {
      id: "kds-vs-fh",
      title: "KDS vs Firehose",
      questions: [
        match("09-kf-m1", "Match each trait.", [
          { left: "Real-time (<1s)", right: "KDS" },
          { left: "Near-real-time (~60s)", right: "Firehose" },
          { left: "Shard management", right: "KDS" },
          { left: "No shard mgmt", right: "Firehose" },
          { left: "Replay supported", right: "KDS" },
          { left: "Built-in S3/Redshift/OpenSearch sinks", right: "Firehose" },
        ]),
      ],
    },
    {
      id: "msk",
      title: "MSK (Managed Kafka)",
      questions: [
        match("09-mk-m1", "Match each MSK fact.", [
          { left: "Engine", right: "Apache Kafka, managed brokers" },
          { left: "MSK Serverless", right: "No capacity mgmt" },
          { left: "Authentication", right: "IAM, SASL/SCRAM, mTLS" },
          { left: "Use case", right: "Existing Kafka tooling" },
        ]),
        mcq(
          "09-mk-1",
          "Existing Kafka producers/consumers; want managed AWS:",
          ["KDS", "MSK", "SQS", "Firehose"],
          1,
          "MSK preserves Kafka API compatibility.",
        ),
      ],
    },
    {
      id: "opensearch",
      title: "OpenSearch Service",
      questions: [
        match("09-os-m1", "Match each OpenSearch fact.", [
          { left: "Use cases", right: "Logs, search, observability" },
          { left: "Engines", right: "OpenSearch + legacy Elasticsearch" },
          { left: "Visualization", ri