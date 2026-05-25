import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic04: Topic = {
  id: "04-database",
  number: "04",
  title: "Database Services",
  weight: "Critical",
  blurb:
    "RDS, Aurora, DynamoDB, ElastiCache, DocumentDB, Neptune, Keyspaces, QLDB, Timestream, Redshift.",
  sections: [
    {
      id: "db-selection",
      title: "Database Selection",
      questions: [
        match("04-sel-m1", "Match each workload to the best database.", [
          { left: "Relational ACID", right: "RDS or Aurora" },
          { left: "Global scale relational", right: "Aurora Global Database" },
          { left: "Key-value at any scale", right: "DynamoDB" },
          { left: "In-memory cache", right: "ElastiCache (Redis/Memcached)" },
          { left: "Document (MongoDB-compatible)", right: "DocumentDB" },
          { left: "Graph", right: "Neptune" },
          { left: "Wide-column (Cassandra)", right: "Keyspaces" },
          { left: "Ledger / immutable", right: "QLDB" },
          { left: "Time-series", right: "Timestream" },
          { left: "Data warehouse", right: "Redshift" },
        ]),
      ],
    },
    {
      id: "rds-storage",
      title: "RDS Storage Types",
      questions: [
        match("04-rs-m1", "Match each RDS storage type.", [
          { left: "gp3 / gp2", right: "General SSD" },
          { left: "io1 / io2", right: "Provisioned IOPS SSD" },
          { left: "magnetic", right: "Legacy (not for new workloads)" },
        ]),
        mcq(
          "04-rs-1",
          "High-IOPS production OLTP on RDS:",
          ["gp2", "io2", "magnetic", "S3"],
          1,
          "io1/io2 = provisioned IOPS for predictable high perf.",
        ),
      ],
    },
    {
      id: "rds-backups",
      title: "RDS Backups & Snapshots",
      questions: [
        match("04-rb-m1", "Match each RDS backup concept.", [
          {
            left: "Automated Backups",
            right: "Daily + transaction logs, 0–35 day retention",
          },
          {
            left: "Manual Snapshots",
            right: "User-initiated, retained until deleted",
          },
          { left: "PITR", right: "Restore to any second in retention window" },
          { left: "Cross-region copy", right: "Snapshot can be copied for DR" },
        ]),
        tf(
          "04-rb-1",
          "You can restore an RDS instance to any second in the backup retention window.",
          true,
          "Point-in-time restore uses transaction logs.",
        ),
        tf(
          "04-rb-2",
          "Deleting an RDS instance always deletes its automated backups.",
          true,
          "Automated backups are deleted with the DB unless you create a final snapshot.",
        ),
      ],
    },
    {
      id: "multi-az-rr",
      title: "Multi-AZ vs Read Replica",
      questions: [
        match("04-mr-m1", "Match each property to Multi-AZ or Read Replica.", [
          { left: "HA / failover purpose", right: "Multi-AZ" },
          { left: "Read scaling purpose", right: "Read Replica" },
          { left: "Synchronous replication", right: "Multi-AZ" },
          { left: "Asynchronous replication", right: "Read Replica" },
          { left: "Same region only", right: "Multi-AZ" },
          { left: "Cross-region supported", right: "Read Replica" },
          { left: "Can be promoted to primary", right: "Read Replica" },
          { left: "Automatic failover", right: "Multi-AZ" },
        ]),
        mcq(
          "04-mr-1",
          "You need to offload SELECT-heavy reporting from production:",
          ["Multi-AZ", "Read Replica", "Standby", "Aurora Serverless"],
          1,
          "Read Replicas scale reads asynchronously.",
        ),
        mcq(
          "04-mr-2",
          "Disaster recovery requirement: another region:",
          [
            "Multi-AZ",
            "Cross-region Read Replica",
            "Snapshot only",
            "Aurora Serverless v1",
          ],
          1,
          "Multi-AZ is single-region; use Cross-region RR for DR.",
        ),
      ],
    },
    {
      id: "aurora",
      title: "Aurora Traits",
      questions: [
        match("04-au-m1", "Match each Aurora fact.", [
          { left: "Engines", right: "MySQL or PostgreSQL compatible" },
          {
            left: "Storage",
            right: "Auto-scales up to 128 TB, 6 copies / 3 AZs",
          },
          { left: "Read replicas", right: "Up to 15 (vs 5 RDS)" },
          { left: "Failover", right: "Under 30 seconds typically" },
          {
            left: "Global Database",
            right: "Cross-region, <1s replication, RPO <1s",
          },
          { left: "Serverless", right: "Auto pause/scale ACU" },
          {
            left: "Backtrack",
            right: "Rewind in-place without restore (MySQL)",
          },
          { left: "Performance", right: "~5x MySQL / ~3x PostgreSQL" },
        ]),
        mcq(
          "04-au-1",
          "How many storage copies does Aurora maintain?",
          [
            "2 across 1 AZ",
            "3 across 2 AZs",
            "6 across 3 AZs",
            "9 across 3 AZs",
          ],
          2,
          "6 copies across 3 AZs.",
        ),
        tf(
          "04-au-2",
          "Aurora storage auto-scales without manual intervention.",
          true,
          "Up to 128 TB; you do not provision.",
        ),
      ],
    },
    {
      id: "ddb-capacity",
      title: "DynamoDB Capacity Modes",
      questions: [
        match("04-dc-m1", "Match each capacity mode.", [
          {
            left: "On-Demand",
            right: "Pay per request, auto-scales, unpredictable workloads",
          },
          {
            left: "Provisioned",
            right: "Set RCU/WCU; cheaper if steady predictable",
          },
          { left: "Auto Scaling", right: "Adjusts provisioned within bounds" },
          {
            left: "Reserved Capacity",
            right: "Discount commitment on provisioned",
          },
        ]),
        mcq(
          "04-dc-1",
          "Spiky unpredictable workload, no capacity planning desired:",
          ["Provisioned", "On-Demand", "Reserved", "Auto Scaling provisioned"],
          1,
          "On-Demand auto-scales per request.",
        ),
      ],
    },
    {
      id: "ddb-keys",
      title: "DynamoDB Keys & Indexes",
      questions: [
        match("04-dk-m1", "Match each DDB term.", [
          { left: "Partition Key", right: "Determines partition (hash)" },
          { left: "Sort Key", right: "Orders items within partition" },
          { left: "GSI", right: "Alternative PK/SK, own throughput, any time" },
          { left: "LSI", right: "Same PK, alt SK, created with table only" },
        ]),
        mcq(
          "04-dk-1",
          "You need to query by a different attribute than the table PK, anytime:",
          ["LSI", "GSI", "Scan", "New table"],
          1,
          "GSI = different PK/SK, created any time.",
        ),
        tf(
          "04-dk-2",
          "LSIs can be added to an existing table.",
          false,
          "LSIs must be created at table creation time.",
        ),
      ],
    },
    {
      id: "ddb-consistency",
      title: "DynamoDB Consistency",
      questions: [
        match("04-co-m1", "Match each consistency option.", [
          {
            left: "Eventually Consistent (default)",
            right: "May return stale, half cost",
          },
          { left: "Strongly Consistent", right: "Latest data, costs 2x" },
          { left: "Transactional", right: "ACID across items, 4x cost" },
        ]),
        mcq(
          "04-co-1",
          "You need read-after-write guarantee on DDB:",
          ["Eventually Consistent", "Strongly Consistent", "No way", "Use S3"],
          1,
          "Strongly Consistent reads cost more but are accurate.",
        ),
      ],
    },
    {
      id: "ddb-features",
      title: "DynamoDB Features",
      questions: [
        match("04-df-m1", "Match each DDB feature.", [
          { left: "DAX", right: "Microsecond cache, fully managed" },
          { left: "Streams", right: "Item change log to Lambda/Kinesis" },
          { left: "Global Tables", right: "Multi-region active-active" },
          { left: "TTL", right: "Auto-delete items after timestamp" },
          { left: "PITR", right: "Restore to any second in last 35 days" },
          { left: "Encryption", right: "KMS at rest (default)" },
        ]),
        mcq(
          "04-df-1",
          "You need single-digit microsecond latency for read-heavy DDB workload:",
          ["GSI", "DAX", "Streams", "Multi-AZ"],
          1,
          "DAX = managed in-memory cache for DynamoDB.",
        ),
        mcq(
          "04-df-2",
          "Active-active multi-region replication for DynamoDB:",
          ["Streams", "DAX", "Global Tables", "GSI"],
          2,
          "Global Tables provide multi-region active-active.",
        ),
      ],
    },
    {
      id: "ddb-limits",
      title: "DynamoDB Limits",
      questions: [
        match("04-dl-m1", "Match each DDB limit.", [
          { left: "Max item size", right: "400 KB" },
          { left: "Max table size", right: "Unlimited" },
          { left: "Max items in BatchGetItem", right: "100" },
          { left: "Max BatchWriteItem", right: "25 items / 16 MB" },
        ]),
        mcq(
          "04-dl-1",
          "Max single DDB item size:",
          ["64 KB", "400 KB", "1 MB", "4 MB"],
          1,
          "400 KB hard limit per item.",
        ),
      ],
    },
    {
      id: "elasticache",
      title: "ElastiCache Engines",
      questions: [
        match("04-ec-m1", "Match each engine trait.", [
          {
            left: "Redis: data types",
            right: "Strings, lists, sets, hashes, streams, pub/sub",
          },
          { left: "Redis: persistence", right: "Yes (AOF/RDB)" },
          { left: "Redis: multi-AZ", right: "Yes (replication + failover)" },
          { left: "Memcached: data", right: "Simple key-value" },
          { left: "Memcached: persistence", right: "No (pure cache)" },
          { left: "Memcached: multi-thread", right: "Yes" },
        ]),
        mcq(
          "04-ec-1",
          "Need persistence, replication, pub/sub:",
          ["Memcached", "Redis", "DAX", "DocumentDB"],
          1,
          "Redis supports persistence and rich data structures.",
        ),
        mcq(
          "04-ec-2",
          "Simple multi-threaded cache, no persistence needed:",
          ["Redis", "Memcached", "DAX", "OpenSearch"],
          1,
          "Memcached is multi-threaded for simple caching.",
        ),
      ],
    },
    {
      id: "caching-strategies",
      title: "Caching Strategies",
      questions: [
        match("04-cs-m1", "Match each caching strategy.", [
          {
            left: "Lazy loading / cache-aside",
            right: "Load on miss, may serve stale",
          },
          {
            left: "Write-through",
            right: "Write to cache + DB, always fresh, adds latency",
          },
          { left: "Write-behind", right: "Write to cache, async to DB" },
          { left: "TTL", right: "Expire keys, mitigate staleness" },
        ]),
      ],
    },
    {
      id: "other-nosql",
      title: "Other NoSQL & Specialty DBs",
      questions: [
        match("04-on-m1", "Match each service to its use case.", [
          { left: "DocumentDB", right: "MongoDB-compatible documents" },
          { left: "Neptune", right: "Graph (Gremlin / SPARQL)" },
          { left: "Keyspaces", right: "Cassandra-compatible (wide-column)" },
          {
            left: "QLDB",
            right: "Immutable cryptographically-verifiable ledger",
          },
          { left: "Timestream", right: "Time-series (IoT, ops metrics)" },
          {
            left: "MemoryDB for Redis",
   