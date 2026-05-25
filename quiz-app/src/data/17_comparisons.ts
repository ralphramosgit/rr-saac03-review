import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic17: Topic = {
  id: "17-comparisons",
  number: "17",
  title: "Cross-Cutting Comparisons",
  weight: "Critical",
  blurb: "Side-by-side comparison drills for the exam.",
  sections: [
    {
      id: "s3-classes-compare",
      title: "S3 Storage Classes Compare",
      questions: [
        match("17-s3-m1", "Match each class to availability / use case.", [
          { left: "Standard", right: "99.99%, frequent access" },
          { left: "Intelligent-Tiering", right: "Unknown / changing patterns" },
          { left: "Standard-IA", right: "99.9%, infrequent multi-AZ" },
          { left: "One Zone-IA", right: "99.5%, single AZ" },
          { left: "Glacier Instant", right: "Archive, ms retrieval" },
          { left: "Glacier Flexible", right: "Min/hours retrieval" },
          { left: "Glacier Deep Archive", right: "Cheapest, 12-hr retrieval" },
        ]),
      ],
    },
    {
      id: "multiaz-vs-rr",
      title: "Multi-AZ vs Read Replica",
      questions: [
        match("17-mr-m1", "Match each property.", [
          { left: "Purpose", right: "Multi-AZ HA / RR scale reads" },
          { left: "Replication", right: "Multi-AZ sync / RR async" },
          { left: "Region", right: "Multi-AZ same / RR same+cross" },
          { left: "Failover", right: "Multi-AZ auto / RR manual promote" },
        ]),
      ],
    },
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL",
      questions: [
        match("17-sn-m1", "Match each.", [
          { left: "Schema", right: "SQL fixed / NoSQL flexible" },
          { left: "Scale", right: "SQL vertical / NoSQL horizontal" },
          { left: "Joins", right: "SQL yes / NoSQL limited" },
          { left: "Examples", right: "RDS / Aurora vs DynamoDB" },
        ]),
      ],
    },
    {
      id: "integration-compare",
      title: "SQS vs SNS vs Kinesis vs EventBridge",
      questions: [
        match("17-int-m1", "Match each property.", [
          { left: "Pull queue", right: "SQS" },
          { left: "Push topic", right: "SNS" },
          { left: "Streaming + replay", right: "Kinesis Data Streams" },
          { left: "Event router + SaaS", right: "EventBridge" },
          { left: "Ordering supported", right: "SQS FIFO / SNS FIFO / KDS" },
          { left: "Real-time push to SMS", right: "SNS" },
        ]),
      ],
    },
    {
      id: "cf-vs-ga",
      title: "CloudFront vs Global Accelerator",
      questions: [
        match("17-cg-m1", "Match each property.", [
          { left: "Layer", right: "CF 7 / GA 4" },
          { left: "Caching", right: "CloudFront only" },
          { left: "Static IPs", right: "GA only" },
          { left: "Non-HTTP", right: "GA" },
          { left: "Edge functions", right: "CloudFront" },
        ]),
      ],
    },
    {
      id: "elb-compare",
      title: "ALB vs NLB vs GWLB",
      questions: [
        match("17-lb-m1", "Match each.", [
          { left: "L7 HTTP routing", right: "ALB" },
          { left: "L4 ultra-low latency, static IPs", right: "NLB" },
          { left: "L3 appliance insertion", right: "GWLB" },
          { left: "WebSocket", right: "ALB / NLB" },
          { left: "Preserve source IP", right: "NLB (direct)" },
        ]),
      ],
    },
    {
      id: "redis-memcached",
      title: "Redis vs Memcached",
      questions: [
        match("17-rm-m1", "Match each property.", [
          { left: "Data types", right: "Redis rich / Memcached simple KV" },
          { left: "Persistence", right: "Redis yes / Memcached no" },
          { left: "Multi-AZ + failover", right: "Redis" },
          { left: "Multi-threaded", right: "Memcached" },
          { left: "Pub/sub", right: "Redis" },
        ]),
      ],
    },
    {
      id: "ebs-compare",
      title: "EBS Volume Types Compare",
      questions: [
        match("17-eb-m1", "Match each.", [
          { left: "gp3", right: "SSD general, default" },
          { left: "io2 BE", right: "SSD highest perf 256K IOPS" },
          { left: "st1", right: "HDD throughput, big sequential" },
          { left: "sc1", right: "HDD cold, cheapest" },
        ]),
      ],
    },
    {
      id: "storage-compare",
      title: "EFS vs FSx vs EBS vs S3",
      questions: [
        match("17-sc-m1", "Match each storage to its model.", [
          { left: "EBS", right: "Block, AZ-bound, single-EC2" },
          { left: "EFS", right: "NFS file, multi-AZ, Linux" },
          { left: "FSx Windows", right: "SMB / AD" },
          { left: "FSx Lustre", right: "HPC / ML, S3 integration" },
          { left: "S3", right: "Object, durable, internet API" },
        ]),
      ],
    },
    {
      id: "dx-vpn-tgw",
      title: "DX vs VPN vs TGW",
      questions: [
        match("17-dv-m1", "Match each.", [
          { left: "Site-to-Site VPN", right: "IPsec over internet, quick" },
          { left: "Direct Connect", right: "Dedicated private, takes weeks" },
          { left: "Transit Gateway", right: "Hub for many VPCs / on-prem" },
          { left: "DX + VPN", right: "Private + encrypted" },
        ]),
      ],
    },
    {
      id: "r53-policies-compare",
      title: "Route 53 Routing Policies Compare",
      questions: [
        match("17-r-m1", "Match each.", [
          { left: "Weighted", right: "% split / A/B testing" },
          { left: "Latency", right: "Closest by latency" },
          { left: "Geolocation", right: "By user country" },
          { left: "Geoproximity", right: "Bias / distance" },
          { left: "Failover", right: "Active/passive health check" },
          { left: "Multi-Value", right: "Multiple healthy IPs" },
        ]),
      ],
    },
    {
      id: "secrets-vs-ps",
      title: "Secrets Manager vs Parameter Store",
      questions: [
        match("17-sps-m1", "Match each.", [
          { left: "Cost", right: "PS free standard / SM paid" },
          { left: "Auto rotation", right: "SM native; PS needs Lambda" },
          { left: "Replication", right: "SM cross-region/account" },
          { left: "Best for DB passwords", right: "Secrets Manager" },
          { left: "Best for non-secret config", right: "Parameter Store" },
        ]),
      ],
    },
    {
      id: "cw-ct-cfg",
      title: "CloudWatch vs CloudTrail vs Config",
      questions: [
        match("17-3ws-m1", "Match each.", [
          { left: "CloudWatch", right: "Performance metrics & logs" },
          { left: "CloudTrail", right: "API audit (who/what/when)" },
          { left: "Config", right: "Resource state & compliance" },
        ]),
      ],
    },
    {
      id: "compute-choice",
      title: "Compute Choice",
      questions: [
        match("17-cc-m1", "Match each scenario to compute.", [
          { left: "Full OS control", right: "EC2" },
          { left: "Managed containers, no servers", right: "ECS/EKS Fargate" },
          { left: "Event-driven function < 15 min", right: "Lambda" },
          { left: "Long batch jobs", right: "AWS Batch" },
          { left: "Upload code, AWS runs it (PaaS)", right: "Beanstalk" },
          { left: "Simple VPS", right: "Lightsail" },
        ]),
      ],
    },
    {
      id: "lambda-vs-sf",
      title: "Lambda vs Step Functions",
      questions: [
        match("17-ls-m1", "Match each.", [
          { left: "Single short function", right: "Lambda" },
          {
            left: "Multi-step workflow w/ retries/branching",
            right: "Step Functions",
          },
          { left: "Up to 15 min", right: "Lambda" },
          { left: "Up to 1 year (Standard)", right: "Step Functions" },
        ]),
      ],
    },
    {
      id: "ses-sns-pinpoint",
      title: "SES vs SNS vs Pinpoint",
      questions: [
        match("17-spp-m1", "Match each.", [
          { left: "SES", right: "Bulk transactional email" },
          { left: "SNS", right: "Notifications + SMS + push" },
          { left: "Pinpoint", right: "Campaigns / segmentation / analytics" },
        ]),
      ],
    },
    {
      id: "athena-vs-redshift",
      title: "Athena vs Redshift",
      questions: [
        match("17-ar-m1", "Match each.", [
          { left: "Athena", right: "Serverless SQL on S3, per-TB" },
          { left: "Redshift", right: "Managed MPP DW, sustained perf" },
          { left: "Redshift Spectrum", right: "Query S3 from Redshift" },
        ]),
      ],
    },
    {
      id: "migration-tools",
      title: "Migration Tool Picker",
      questions: [
        match("17-mt-m1", "Match each scenario.", [
          { left: "Lift & shift servers", right: "MGN" },
          { left: "Heterogeneous DB migration", right: "DMS + SCT" },
          { left: "Online file sync", right: "DataSync" },
          { left: "Offline bulk transfer", right: "Snowball Edge" },
          { left: "Hybrid file access", right: "Storage Gateway" },
          { left: "SFTP into S3", right: "Transfer Family" },
        ]),
      ],
    },
    {
      id: "anti-patterns",
      title: "Common Anti-Patterns",
      questions: [
        match("17-ap-m1", "Match each bad design to better choice.", [
          { left: "Lambda for 30 min job", right: "Use Batch / Fargate" },
          { left: "Spot for production DB", right: "Use On-Demand / RI" },
          { left: "CNAME at root domain", right: "Use Route 53 Alias" },
          { left: "EBS for shared multi-EC2 storage", right: "Use EFS" },
          { left: "Public RDS endpoint", right: "Place in private subnet" },
          { left: "Hardcoded IAM keys on EC2", right: "Use IAM Instance Role" },
          {
            left: "Storing secrets in SSM Standard plaintext",
            right: "Use Secrets Manager / SSM SecureString",
          },
        ]),
      ],
    },
  ],
};
