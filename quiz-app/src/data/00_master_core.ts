import type { Topic } from "../types";
import { match } from "./_helpers";

// MASTER CORE CONCEPTS
// Pure matching drills. Baseline service / feature / use-case pairings.
// Fixed authored order (noShuffle) – meant to be repeated until automatic.
export const topicMasterCore: Topic = {
  id: "00-master-core",
  number: "★",
  title: "MASTER CORE CONCEPTS",
  weight: "Critical",
  blurb:
    "Pure matching drills across the seven exam domains. Service → attribute / description / primary use case. Repeat until automatic.",
  noShuffle: true,
  sections: [
    // =============================================================== COMPUTE
    {
      id: "core-compute",
      title: "Compute",
      questions: [
        match("mc-cmp-1", "EC2 instance families — match family letter to its specialty:", [
          { left: "C", right: "Compute-optimized (CPU-intensive workloads)" },
          { left: "R", right: "RAM / memory-optimized (in-memory DBs, big data)" },
          { left: "M", right: "General-purpose (balanced CPU / memory)" },
          { left: "T", right: "Burstable CPU (uses CPU credits)" },
          { left: "I", right: "I/O-optimized (NoSQL, high-IOPS storage)" },
          { left: "D", right: "Dense HDD storage (data warehousing)" },
          { left: "G / P", right: "GPU (graphics / ML training)" },
        ]),
        match("mc-cmp-2", "EC2 pricing models — match to characteristic:", [
          { left: "On-Demand", right: "Pay per second, no commitment, no discount" },
          { left: "Reserved Instance (1 / 3 yr)", right: "Up to 72% off, steady-state workloads" },
          { left: "Savings Plan", right: "Flexible commitment across EC2 / Fargate / Lambda" },
          { left: "Spot", right: "Up to 90% off, 2-minute interruption notice" },
          { left: "Dedicated Host", right: "Physical server, BYOL & compliance" },
          { left: "Dedicated Instance", right: "Hardware isolation, no socket visibility" },
        ]),
        match("mc-cmp-3", "Load balancer types — match to layer / use case:", [
          { left: "ALB (Application LB)", right: "Layer 7 — HTTP/HTTPS, path & host routing, WebSockets" },
          { left: "NLB (Network LB)", right: "Layer 4 — TCP/UDP, static IP, ultra-high throughput" },
          { left: "GWLB (Gateway LB)", right: "Layer 3 — deploy firewalls/IDS via GENEVE" },
          { left: "CLB (Classic LB)", right: "Legacy L4/L7, deprecated" },
        ]),
        match("mc-cmp-4", "Auto Scaling policies — match to behavior:", [
          { left: "Target Tracking", right: "Keep a metric at a target value (e.g., CPU 50%)" },
          { left: "Step Scaling", right: "Add/remove capacity based on alarm thresholds" },
          { left: "Simple Scaling", right: "Single adjustment then cooldown" },
          { left: "Scheduled Scaling", right: "Scale at a known time/recurrence" },
          { left: "Predictive Scaling", right: "ML forecasts demand and pre-scales" },
        ]),
        match("mc-cmp-5", "Placement groups — match to purpose:", [
          { left: "Cluster", right: "Same AZ, lowest latency, HPC" },
          { left: "Spread", right: "Distinct hardware, max 7/AZ, critical apps" },
          { left: "Partition", right: "Logical partitions on distinct racks (Hadoop/Kafka)" },
        ]),
        match("mc-cmp-6", "Container & serverless compute — match to description:", [
          { left: "ECS on EC2", right: "AWS container orchestrator, you manage the EC2 hosts" },
          { left: "ECS on Fargate", right: "Serverless containers, no EC2 to manage" },
          { left: "EKS", right: "Managed Kubernetes control plane" },
          { left: "Lambda", right: "Serverless functions, 15-min max, event-driven" },
          { left: "Elastic Beanstalk", right: "PaaS — upload code, AWS provisions environment" },
          { left: "Batch", right: "Managed batch jobs, EC2/Spot provisioning" },
        ]),
      ],
    },

    // =============================================================== STORAGE
    {
      id: "core-storage",
      title: "Storage",
      questions: [
        match("mc-sto-1", "S3 storage classes — match to typical use case:", [
          { left: "S3 Standard", right: "Frequent access, default" },
          { left: "S3 Intelligent-Tiering", right: "Unknown / changing access patterns" },
          { left: "S3 Standard-IA", right: "Infrequent access, multi-AZ" },
          { left: "S3 One Zone-IA", right: "Infrequent, non-critical (single AZ)" },
          { left: "S3 Glacier Instant Retrieval", right: "Archive needing ms retrieval" },
          { left: "S3 Glacier Flexible Retrieval", right: "Archive, minutes-to-hours retrieval" },
          { left: "S3 Glacier Deep Archive", right: "Cheapest archive, 12–48 hr retrieval" },
        ]),
        match("mc-sto-2", "EBS volume types — match to workload:", [
          { left: "gp3 / gp2 (SSD)", right: "General-purpose, balanced price/perf" },
          { left: "io2 / io1 (Provisioned IOPS SSD)", right: "High-performance / mission-critical DB" },
          { left: "st1 (Throughput HDD)", right: "Big data, log processing, sequential" },
          { left: "sc1 (Cold HDD)", right: "Cheapest, infrequently accessed cold data" },
        ]),
        match("mc-sto-3", "File storage services — match to description:", [
          { left: "EFS", right: "Managed NFS, multi-AZ, Linux only" },
          { left: "FSx for Windows", right: "SMB / NTFS, Active Directory integration" },
          { left: "FSx for Lustre", right: "HPC / ML, 100+ GB/s throughput" },
          { left: "FSx for NetApp ONTAP", right: "NFS + SMB + iSCSI, ONTAP features" },
          { left: "FSx for OpenZFS", right: "NFS, up to 1M IOPS, ZFS snapshots" },
        ]),
        match("mc-sto-4", "Storage Gateway types — match to protocol/use:", [
          { left: "File Gateway", right: "S3 exposed as NFS / SMB share" },
          { left: "Volume Gateway (Cached)", right: "Hot data on-prem, primary in S3 (iSCSI)" },
          { left: "Volume Gateway (Stored)", right: "Primary on-prem, async backup to S3 (iSCSI)" },
          { left: "Tape Gateway", right: "Virtual tape library backed by S3/Glacier" },
        ]),
        match("mc-sto-5", "Snow family — match to scale / role:", [
          { left: "Snowcone", right: "8 TB, rugged edge device, portable" },
          { left: "Snowball Edge Storage Optimized", right: "80 TB transfer, basic compute" },
          { left: "Snowball Edge Compute Optimized", right: "42 TB + heavy compute / optional GPU" },
          { left: "Snowmobile", right: "100 PB physical truck, datacenter migration" },
        ]),
        match("mc-sto-6", "Storage core attributes — match service to property:", [
          { left: "S3", right: "Object storage, 11 nines durability, unlimited" },
          { left: "EBS", right: "Block storage, AZ-locked, attached to one EC2 (mostly)" },
          { left: "Instance Store", right: "Ephemeral block storage, lost on stop/terminate" },
          { left: "EFS", right: "Shared file system across many EC2 / AZs" },
        ]),
      ],
    },

    // =============================================================== DATABASE
    {
      id: "core-database",
      title: "Database",
      questions: [
        match("mc-db-1", "AWS database services — match to category:", [
          { left: "RDS", right: "Managed relational DB (MySQL, Postgres, Oracle, etc.)" },
          { left: "Aurora", right: "AWS-built MySQL/Postgres compatible relational, 6× storage replication" },
          { left: "DynamoDB", right: "Serverless NoSQL key-value / document, single-digit ms" },
          { left: "ElastiCache", right: "In-memory cache (Redis / Memcached)" },
          { left: "Redshift", right: "Petabyte-scale columnar data warehouse (OLAP)" },
          { left: "DocumentDB", right: "MongoDB-compatible document DB" },
          { left: "Neptune", right: "Graph database (social / fraud / knowledge graphs)" },
          { left: "QLDB", right: "Immutable, cryptographically verifiable ledger" },
          { left: "Timestream", right: "Time-series DB (IoT / ops metrics)" },
        ]),
        match("mc-db-2", "RDS Multi-AZ vs Read Replicas — match feature to mechanism:", [
          { left: "Multi-AZ", right: "Synchronous standby, automatic failover (HA, not reads)" },
          { left: "Read Replica", right: "Asynchronous, serves read traffic, can be cross-region" },
          { left: "Automated Backup", right: "Daily snapshot + 5-min tx logs, 1–35 days retention" },
          { left: "Manual Snapshot", right: "User-triggered, retained until you delete" },
        ]),
        match("mc-db-3", "Aurora architecture — match concept to value:", [
          { left: "Storage replication", right: "6 copies across 3 AZs (auto self-healing)" },
          { left: "Max read replicas", right: "15" },
          { left: "Storage growth", right: "10 GB → 128 TB, auto-grows in 10 GB chunks" },
          { left: "Aurora Global DB lag", right: "< 1 second cross-region" },
          { left: "Aurora Serverless", right: "Auto-scaling per second, intermittent workloads" },
        ]),
        match("mc-db-4", "DynamoDB features — match to purpose:", [
          { left: "Global Tables", right: "Multi-region, multi-active replication" },
          { left: "DynamoDB Streams", right: "Ordered change log (24 hr) for triggers" },
          { left: "TTL", right: "Auto-delete expired items at no cost" },
          { left: "DAX", right: "In-memory cache, microsecond reads" },
          { left: "LSI", right: "Same partition key, alt sort key, defined at table creation" },
          { left: "GSI", right: "Different partition/sort key, added anytime" },
        ]),
        match("mc-db-5", "ElastiCache — Redis vs Memcached — match feature to engine:", [
          { left: "Persistence + backups", right: "Redis" },
          { left: "Multi-AZ with replication", right: "Redis" },
          { left: "Pub/Sub messaging", right: "Redis" },
          { left: "Multi-threaded simple cache", right: "Memcached" },
          { left: "No persistence, sharded", right: "Memcached" },
        ]),
      ],
    },

    // =============================================================== NETWORKING (VPC)
    {
      id: "core-networking",
      title: "Networking (VPC)",
      questions: [
        match("mc-net-1", "VPC building blocks — match to purpose:", [
          { left: "VPC", right: "Regional isolated virtual network (CIDR /16–/28)" },
          { left: "Subnet", right: "AZ-scoped slice of the VPC CIDR" },
          { left: "Route Table", right: "Decides where subnet traffic goes" },
          { left: "Internet Gateway (IGW)", right: "Public internet access for the VPC" },
          { left: "NAT Gateway", right: "Outbound-only internet from private subnets" },
          { left: "Elastic IP", right: "Static public IPv4 owned by your account" },
        ]),
        match("mc-net-2", "Security Groups vs NACLs — match property to control:", [
          { left: "Stateful, allow-only, instance level", right: "Security Group" },
          { left: "Stateless, allow + deny, subnet level", right: "Network ACL (NACL)" },
          { left: "Rules numbered, lowest first", right: "Network ACL (NACL)" },
          { left: "Can reference other SGs as source", right: "Security Group" },
        ]),
        match("mc-net-3", "VPC connectivity options — match to scenario:", [
          { left: "VPC Peering", right: "Two VPCs, point-to-point, non-transitive" },
          { left: "Transit Gateway", right: "Hub-and-spoke for thousands of VPCs, transitive" },
          { left: "Site-to-Site VPN", right: "Encrypted IPsec over the internet to on-prem" },
          { left: "Direct Connect", right: "Dedicated private fiber, consistent performance" },
          { left: "PrivateLink / Interface Endpoint", right: "Private access to AWS or partner services via ENI" },
          { left: "Gateway Endpoint", right: "Free private route to S3 / DynamoDB only" },
        ]),
        match("mc-net-4", "Route 53 routing policies — match to use case:", [
          { left: "Simple", right: "One record, no health checks" },
          { left: "Weighted", right: "Split traffic by % (A/B testing, canary)" },
          { left: "Latency", right: "Send to lowest-latency region for the user" },
          { left: "Failover", right: "Primary / secondary DR with health checks" },
          { left: "Geolocation", right: "Route by user's country/continent" },
          { left: "Geoproximity", right: "Route by resource location with bias" },
          { left: "Multi-value Answer", right: "Up to 8 healthy records returned" },
        ]),
        match("mc-net-5", "CloudFront / edge features — match to purpose:", [
          { left: "CloudFront", right: "Global CDN, 400+ edge locations" },
          { left: "OAI / OAC", right: "Restrict S3 origin so only CloudFront can read" },
          { left: "Signed URL / Cookie", right: "Limit who can access cached content" },
          { left: "Global Accelerator", right: "Anycast static IPs over AWS backbone" },
        ]),
      ],
    },

    // =============================================================== ANALYTICS
    {
      id: "core-analytics",
      title: "Analytics",
      questions: [
        match("mc-an-1", "Analytics services — match to category:", [
          { left: "Athena", right: "Serverless SQL on S3 data ($5/TB scanned)" },
          { left: "Glue", right: "Serverless ETL + Data Catalog (crawlers)" },
          { left: "Redshift", right: "Petabyte-scale columnar data warehouse" },
          { left: "EMR", right: "Managed Hadoop / Spark / Presto big-data clusters" },
          { left: "QuickSight", right: "Serverless BI dashboards (SPICE in-memory)" },
          { left: "OpenSearch", right: "Search + log analytics with Kibana/Dashboards" },
          { left: "Lake Formation", right: "Build & govern a data lake (fine-grained perms)" },
          { left: "MSK", right: "Managed Apache Kafka clusters" },
          { left: "Data Pipeline", right: "Legacy orchestration of data movement (use Glue/SF)" },
        ]),
        match("mc-an-2", "Kinesis family — match to role:", [
          { left: "Kinesis Data Streams", right: "Real-time stream, shards, replay, multi-consumer" },
          { left: "Kinesis Data Firehose", right: "Near real-time load to S3/Redshift/OpenSearch (no shards)" },
          { left: "Kinesis Data Analytics", right: "SQL/Flink on streaming data" },
          { left: "Kinesis Video Streams", right: "Ingest device video for ML / playback" },
        ]),
        match("mc-an-3", "Streaming vs queueing — match property to service:", [
          { left: "Multiple independent consumers, replay 1–365 days", right: "Kinesis Data Streams" },
          { left: "One consumer per message, retention up to 14 days", right: "SQS" },
          { left: "Pub/Sub fan-out, push-based, multiple subscribers", right: "SNS" },
          { left: "Workflow orchestration / state machines", right: "Step Functions" },
        ]),
        match("mc-an-4", "Athena cost optimizations — match technique to effect:", [
          { left: "Convert CSV → Parquet/ORC", right: "Columnar + compressed → far less data scanned" },
          { left: "Partition data (year/month/day)", right: "Scan only relevant partitions" },
          { left: "Compress (gzip/snappy/zstd)", right: "Reduce scanned bytes" },
          { left: "Combine small files (>128 MB)", right: "Reduce per-file overhead" },
        ]),
      ],
    },

    // =============================================================== SECURITY
    {
      id: "core-security",
      title: "Security",
      questions: [
        match("mc-sec-1", "Identity, secrets, & encryption — match service to role:", [
          { left: "IAM", right: "Identities, policies, permissions" },
          { left: "Cognito", right: "End-user identity for web/mobile apps" },
          { left: "KMS", right: "Managed encryption keys (symmetric/asymmetric)" },
          { left: "CloudHSM", right: "Single-tenant FIPS 140-2 Level 3 HSM in your VPC" },
          { left: "Secrets Manager", right: "Secrets with automatic rotation" },
          { left: "SSM Parameter Store", right: "Free config/secret store, hierarchical" },
          { left: "ACM", right: "Free public TLS certs for AWS services" },
        ]),
        match("mc-sec-2", "Threat detection & data protection — match service to focus:", [
          { left: "GuardDuty", right: "ML threat detection on CloudTrail / VPC Flow / DNS" },
          { left: "Macie", right: "Discover & protect PII / sensitive data in S3" },
          { left: "Inspector", right: "Vulnerability scans of EC2 / ECR images / Lambda" },
          { left: "Detective", right: "Investigate & root-cause security findings (ML)" },
          { left: "Security Hub", right: "Central dashboard aggregating findings & compliance" },
          { left: "Firewall Manager", right: "Centrally manage WAF / Shield / SGs across accounts" },
        ]),
        match("mc-sec-3", "Network / edge protection — match service to layer:", [
          { left: "Security Group", right: "Instance-level stateful firewall" },
          { left: "NACL", right: "Subnet-level stateless firewall (allow + deny)" },
          { left: "AWS WAF", right: "Layer 7 protection (SQLi, XSS, rate-based)" },
          { left: "AWS Shield Standard", right: "Free DDoS protection at L3/L4 (automatic)" },
          { left: "AWS Shield Advanced", right: "Paid enhanced DDoS, DRT, cost protection" },
          { left: "AWS Network Firewall", right: "Managed stateful VPC firewall (IDS/IPS)" },
        ]),
        match("mc-sec-4", "KMS concepts — match term to meaning:", [
          { left: "Symmetric key (AES-256)", right: "Single key, never leaves KMS, most common" },
          { left: "Asymmetric key (RSA/ECC)", right: "Public/private pair, public can be exported" },
          { left: "Customer Managed Key", right: "You create & control, $1/month, rotation optional" },
          { left: "AWS Managed Key", right: "Free, auto-rotated yearly, AWS service-owned" },
          { left: "Envelope Encryption", right: "Encrypt large data with a DEK, then encrypt the DEK with KMS" },
        ]),
      ],
    },

    // =============================================================== MANAGEMENT & GOVERNANCE
    {
      id: "core-mgmt",
      title: "Management & Governance",
      questions: [
        match("mc-mgmt-1", "Monitor / audit / compliance — match service to job:", [
          { left: "CloudWatch", right: "Metrics, logs, alarms, dashboards" },
          { left: "CloudTrail", right: "Records WHO did WHAT API call, WHEN, from WHERE" },
          { left: "AWS Config", right: "Resource configuration history & compliance rules" },
          { left: "X-Ray", right: "Distributed tracing across microservices" },
          { left: "Trusted Advisor", right: "Best-practice checks (cost, perf, sec, FT, limits)" },
          { left: "Personal Health Dashboard", right: "Account-specific service health & maintenance" },
        ]),
        match("mc-mgmt-2", "Multi-account governance — match service to job:", [
          { left: "AWS Organizations", right: "Multi-account container + consolidated billing" },
          { left: "Service Control Policies (SCPs)", right: "Maximum permissions for member accounts" },
          { left: "AWS Control Tower", right: "Automated landing zone + guardrails on Organizations" },
          { left: "Resource Access Manager (RAM)", right: "Share resources (subnets, TGW) across accounts" },
          { left: "IAM Identity Center (SSO)", right: "Single sign-on across AWS accounts and apps" },
        ]),
        match("mc-mgmt-3", "Systems Manager (SSM) components — match feature to purpose:", [
          { left: "Session Manager", right: "Shell to EC2 with no SSH / bastion / open ports" },
          { left: "Run Command", right: "Execute commands on fleets of instances" },
          { left: "Patch Manager", right: "Automated OS patching with baselines & windows" },
          { left: "Parameter Store", right: "Free hierarchical config / secret storage" },
          { left: "Automation", right: "Runbooks for routine maintenance tasks" },
          { left: "State Manager", right: "Maintain a desired configuration state" },
          { left: "Inventory", right: "Collect software & metadata from instances" },
        ]),
        match("mc-mgmt-4", "Cost & billing tools — match tool to job:", [
          { left: "AWS Cost Explorer", right: "Visualize spend, forecast, get RI/SP recommendations" },
          { left: "AWS Budgets", right: "Set spend/usage limits with SNS alerts" },
          { left: "Cost & Usage Report (CUR)", right: "Most granular billing data, stored in S3 (query w/ Athena)" },
          { left: "Cost Anomaly Detection", right: "ML detects unusual cost spikes" },
          { left: "Compute Optimizer", right: "ML right-sizing for EC2 / EBS / ASG / Lambda" },
          { left: "Pricing Calculator", right: "Estimate costs before deploying" },
        ]),
        match("mc-mgmt-5", "CloudWatch vs CloudTrail vs Config — match question to service:", [
          { left: "“Is this resource over/under-utilized?”", right: "CloudWatch (metrics)" },
          { left: "“Who deleted that S3 bucket?”", right: "CloudTrail (API audit)" },
          { left: "“When did this SG become non-compliant?”", right: "AWS Config (config history)" },
        ]),
      ],
    },
  ],
};
