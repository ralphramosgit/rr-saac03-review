import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic02: Topic = {
  id: "02-compute",
  number: "02",
  title: "Compute Services",
  weight: "Critical",
  blurb:
    "EC2 (states, AMI, families, placement groups, pricing, storage, networking), Lambda, ECS, ECR, EKS, Fargate, Lightsail, Batch, Beanstalk, SAM, SAR, ParallelCluster.",
  sections: [
    {
      id: "ec2-states",
      title: "EC2 Instance States",
      questions: [
        match(
          "02-st-m1",
          "Match each EC2 state to whether you are billed for compute.",
          [
            { left: "Running", right: "Billed" },
            { left: "Rebooting", right: "Billed" },
            {
              left: "Stopped",
              right: "Not billed for compute (storage still billed)",
            },
            { left: "Pending", right: "Not billed" },
            { left: "Terminated", right: "Not billed" },
            {
              left: "Hibernating",
              right: "Not billed for compute (storage billed)",
            },
          ],
        ),
        mcq(
          "02-st-1",
          "An instance-store-backed EC2 instance can be:",
          [
            "Stopped and restarted",
            "Only terminated (not stopped)",
            "Hibernated",
            "Moved to another AZ via stop/start",
          ],
          1,
          "Instance-store-backed instances cannot be stopped — only terminated.",
        ),
        mcq(
          "02-st-2",
          "When an EBS-backed EC2 instance is STOPPED, what continues to bill?",
          [
            "Compute (vCPU hours)",
            "Attached EBS volumes",
            "Network egress",
            "Nothing",
          ],
          1,
          "Compute stops billing; attached EBS volumes still bill for storage.",
        ),
        tf(
          "02-st-3",
          "A rebooted EC2 instance is still billed during the reboot.",
          true,
          "Reboot = OS restart on same host. Billing continues.",
        ),
        tf(
          "02-st-4",
          "Hibernating preserves RAM contents to EBS so the instance can resume where it left off.",
          true,
          "RAM is saved to the root EBS volume on hibernate.",
        ),
      ],
    },
    {
      id: "root-volumes",
      title: "Root Device Volumes (EBS vs Instance Store)",
      questions: [
        match("02-rv-m1", "Match each root volume property to the type.", [
          { left: "Can stop and restart", right: "EBS-backed only" },
          {
            left: "Data lost on stop/terminate",
            right: "Instance Store-backed",
          },
          { left: "Snapshot to S3", right: "EBS-backed" },
          { left: "Ephemeral root", right: "Instance Store-backed" },
        ]),
        mcq(
          "02-rv-1",
          'Keyword: "persist data after stop" suggests:',
          ["Instance Store", "EBS-backed", "EFS", "S3 Standard"],
          1,
          "EBS-backed survives stop/start. Instance Store is ephemeral.",
        ),
        mcq(
          "02-rv-2",
          'Keyword: "temporary scratch space, highest IOPS, included in instance price":',
          ["EBS gp3", "EBS io2", "Instance Store", "EFS"],
          2,
          "Instance Store = NVMe SSD physically attached, very high IOPS, ephemeral.",
        ),
        tf(
          "02-rv-3",
          "If the underlying host fails, instance-store data is gone.",
          true,
          "Instance store is ephemeral and not replicated.",
        ),
      ],
    },
    {
      id: "ami",
      title: "AMI Types & Rules",
      questions: [
        match("02-ami-m1", "Match each AMI source to its description.", [
          { left: "Public", right: "Provided by AWS or community" },
          { left: "Private", right: "Owned by your account" },
          { left: "Marketplace", right: "Third-party commercial AMIs" },
          { left: "Shared", right: "AMI another account shared with you" },
        ]),
        mcq(
          "02-ami-1",
          "You need to launch an identical instance in another region. What must you do first?",
          [
            "Nothing — AMIs are global",
            "Copy the AMI to the target region",
            "Create a snapshot only",
            "Use VM Import/Export",
          ],
          1,
          "AMIs are region-specific; copy AMI to target region first.",
        ),
        mcq(
          "02-ami-2",
          "Encrypted AMIs can be shared across accounts only if:",
          [
            "The instance is stopped",
            "The KMS key is also shared",
            "Both accounts use the same region",
            "You convert to instance-store first",
          ],
          1,
          "Encrypted AMIs require the KMS key be shared with the target account.",
        ),
        tf(
          "02-ami-3",
          "AMIs are global resources by default.",
          false,
          "AMIs are region-specific. Use AMI copy across regions.",
        ),
      ],
    },
    {
      id: "ec2-families",
      title: "EC2 Instance Family Letters",
      questions: [
        match("02-fam-m1", "Match each EC2 family letter to its purpose.", [
          { left: "T / M", right: "General purpose (balanced)" },
          { left: "C", right: "Compute optimized (high CPU)" },
          { left: "R / X / Z", right: "Memory optimized" },
          {
            left: "I / D / H",
            right: "Storage optimized (high IOPS / throughput)",
          },
          {
            left: "P / G / Inf / Trn",
            right: "Accelerated computing (GPU / FPGA)",
          },
          { left: "Hpc", right: "HPC optimized" },
        ]),
        mcq(
          "02-fam-1",
          "You need to run SAP HANA (in-memory DB). Best instance family?",
          ["C family", "R or X family", "T family", "I family"],
          1,
          "Memory optimized (R/X/Z) for in-memory DBs.",
        ),
        mcq(
          "02-fam-2",
          "High CPU workload like batch processing or ML inference. Best family?",
          ["C", "T", "R", "D"],
          0,
          "C = compute optimized.",
        ),
        mcq(
          "02-fam-3",
          'In the name `m5.xlarge`, what does the "5" mean?',
          ["Number of vCPUs", "Memory in GB", "Generation", "Network speed"],
          2,
          "Format: Family(m) + Generation(5) + Size(xlarge).",
        ),
        tf(
          "02-fam-4",
          "T-series instances are burstable using CPU credits.",
          true,
          "T2/T3 burst beyond baseline using credits (or T2/T3 Unlimited).",
        ),
      ],
    },
    {
      id: "placement-groups",
      title: "EC2 Placement Groups",
      questions: [
        match("02-pg-m1", "Match each placement group type to its purpose.", [
          {
            left: "Cluster",
            right:
              "Packs instances close for low latency / high throughput (single AZ)",
          },
          {
            left: "Spread",
            right: "Distinct hardware racks; max 7 instances per AZ",
          },
          {
            left: "Partition",
            right: "Distributed fault isolation (Hadoop, Kafka, Cassandra)",
          },
        ]),
        mcq(
          "02-pg-1",
          "You need lowest network latency between HPC nodes inside one AZ:",
          ["Cluster", "Spread", "Partition", "No placement group"],
          0,
          "Cluster groups instances on the same rack for tight networking.",
        ),
        mcq(
          "02-pg-2",
          "A few critical EC2 instances must NOT share underlying hardware:",
          ["Cluster", "Spread", "Partition", "Dedicated Host"],
          1,
          "Spread = each instance on distinct hardware racks (max 7 per AZ).",
        ),
        mcq(
          "02-pg-3",
          "Running Cassandra/Hadoop where partition-aware fault isolation is needed:",
          ["Cluster", "Spread", "Partition", "Cluster + Spread"],
          2,
          "Partition groups split into logical partitions; each partition on separate racks.",
        ),
        tf(
          "02-pg-4",
          "Placement groups cost extra to use.",
          false,
          "No extra charge for placement groups.",
        ),
        tf(
          "02-pg-5",
          "You can move an existing (stopped) instance INTO a placement group.",
          true,
          "Instance must be stopped to move into a placement group.",
        ),
      ],
    },
    {
      id: "ec2-pricing",
      title: "EC2 Pricing Models",
      questions: [
        match(
          "02-pr-m1",
          "Match each pricing model to its discount vs On-Demand.",
          [
            { left: "On-Demand", right: "Baseline (0%)" },
            {
              left: "Standard Reserved Instance",
              right: "Up to 72% (locked to attrs)",
            },
            {
              left: "Convertible Reserved Instance",
              right: "Up to 66% (can change family)",
            },
            { left: "Spot Instance", right: "Up to 90% (interruptible)" },
            {
              left: "Compute Savings Plan",
              right: "Up to 66% (most flexible)",
            },
            {
              left: "Dedicated Host",
              right: "Most expensive (BYOL / compliance)",
            },
          ],
        ),
        mcq(
          "02-pr-1",
          "Stateless batch jobs, fault-tolerant. Cheapest model?",
          ["On-Demand", "Standard RI", "Spot", "Dedicated Instance"],
          2,
          "Spot can save up to 90% — perfect for batch/stateless.",
        ),
        mcq(
          "02-pr-2",
          "You need predictable steady-state workload, max savings, exact instance known. Best?",
          ["Convertible RI", "Standard RI", "On-Demand", "Spot"],
          1,
          "Standard RI = highest discount when attributes locked.",
        ),
        mcq(
          "02-pr-3",
          "You want savings that also apply to Lambda and Fargate. Use:",
          [
            "Standard RI",
            "EC2 Instance Savings Plan",
            "Compute Savings Plan",
            "Spot",
          ],
          2,
          "Compute Savings Plans apply to EC2 + Lambda + Fargate.",
        ),
        mcq(
          "02-pr-4",
          "How much warning does AWS give before reclaiming a Spot instance?",
          ["30 seconds", "2 minutes", "5 minutes", "No warning"],
          1,
          "2-minute interruption notice.",
        ),
        tf(
          "02-pr-5",
          "Spot instances are appropriate for production databases.",
          false,
          "NEVER use Spot for stateful/DB workloads — they can be reclaimed.",
        ),
        tf(
          "02-pr-6",
          "Standard RIs can be sold on the Reserved Instance Marketplace.",
          true,
          "Standard only — Convertible cannot be sold.",
        ),
      ],
    },
    {
      id: "ec2-security",
      title: "EC2 Security (SGs, Key Pairs, IAM Roles)",
      questions: [
        match("02-sec-m1", "Match each EC2 security concept.", [
          {
            left: "Security Group",
            right: "Stateful instance-level firewall, allow-only rules",
          },
          {
            left: "Key Pair",
            right: "SSH (Linux) / RDP password decryption (Windows)",
          },
          {
            left: "IAM Instance Role",
            right: "Grant AWS-service permissions to the EC2 instance",
          },
        ]),
        mcq(
          "02-sec-1",
          "You need to give EC2 access to read an S3 bucket. Best practice?",
          [
            "Store IAM access keys in environment variables",
            "Embed access keys in the AMI",
            "Attach an IAM instance role",
            "Use the root account",
          ],
          2,
          "Always use IAM roles — never embed access keys on instances.",
        ),
        mcq(
          "02-sec-2",
          "Default behavior of a new EC2 Security Group is:",
          [
            "Allow all inbound, allow all outbound",
            "Deny all inbound, allow all outbound",
            "Deny all inbound and outbound",
            "Allow all inbound, deny all outbound",
          ],
          1,
          "Default SG = deny inbound, allow outbound. Rules are ALLOW only.",
        ),
        tf(
          "02-sec-3",
          "Security Groups can include explicit DENY rules.",
          false,
          "SGs are allow-only. Use NACLs for DENY.",
        ),
        tf(
          "02-sec-4",
          "AWS stores a copy of your EC2 key pair private key.",
          false,
          "YOU store the private key. AWS does not retain it.",
        ),
      ],
    },
    {
      id: "ec2-networking",
      title: "EC2 Networking (ENI, ENA, EFA, IPs)",
      questions: [
        match("02-net-m1", "Match each networking concept.", [
          { left: "ENI", right: "Virtual NIC, attachable/detachable" },
          { left: "ENA", right: "High-performance up to 100 Gbps" },
          { left: "EFA", right: "Low-latency HPC/ML, bypass OS kernel" },
          {
            left: "Elastic IP",
            right: "Static public IPv4 (billed when unattached)",
          },
          { left: "Public IP", right: "Dynamic, changes on stop/start" },
          { left: "Private IP", right: "Persists across stop/start" },
        ]),
        mcq(
          "02-net-1",
          "You want a static public IPv4 that survives instance stop/start:",
          ["Public IP", "Private IP", "Elastic IP", "ENA"],
          2,
          "Elastic IP is the static public IPv4 you allocate.",
        ),
        mcq(
          "02-net-2",
          "Best fit for tightly-coupled MPI HPC workloads:",
          ["ENI", "ENA", "EFA", "Elastic IP"],
          2,
          "EFA bypasses OS kernel for low-latency HPC/ML.",
        ),
        tf(
          "02-net-3",
          "Elastic IPs are free when attached to a running instance.",
          true,
          "Billed only when unattached or attached to a stopped instance.",
        ),
      ],
    },
    {
      id: "ebs-vs-store",
      title: "EBS vs Instance Store",
      questions: [
        match("02-es-m1", "Match each property to EBS or Instance Store.", [
          { left: "Survives instance stop", right: "EBS" },
          { left: "Ephemeral (lost on stop)", right: "Instance Store" },
          { left: "Snapshot to S3", right: "EBS" },
          { left: "Network-attached", right: "EBS" },
          { left: "Physically attached to host", right: "Instance Store" },
        ]),
        mcq(
          "02-es-1",
          "EBS volume maximum size:",
          ["16 TiB", "32 TiB", "64 TiB", "256 TiB"],
          2,
          "Up to 64 TiB per EBS volume.",
        ),
        tf(
          "02-es-2",
          "Instance Store volumes can be snapshotted to S3.",
          false,
          "Instance Store cannot be snapshotted.",
        ),
      ],
    },
    {
      id: "ebs-types",
      title: "EBS Volume Types",
      questions: [
        match(
          "02-eb-m1",
          "Match each EBS volume type to its max IOPS / category.",
          [
            { left: "gp3", right: "SSD General, 16K IOPS, 1000 MiB/s" },
            { left: "gp2", right: "SSD General legacy, 16K IOPS, 250 MiB/s" },
            {
              left: "io2 (Block Express)",
              right: "SSD Provisioned, up to 256K IOPS, 4000 MiB/s",
            },
            { left: "io1", right: "SSD Provisioned, 64K IOPS" },
            { left: "st1", right: "HDD Throughput, 500 IOPS" },
            { left: "sc1", right: "HDD Cold, 250 IOPS (cheapest)" },
          ],
        ),
        mcq(
          "02-eb-1",
          "Default modern EBS type for boot volumes and most workloads:",
          ["gp2", "gp3", "io1", "st1"],
          1,
          "gp3 — cheaper and more flexible than gp2.",
        ),
        mcq(
          "02-eb-2",
          "Which EBS types support Multi-Attach?",
          ["gp2 / gp3", "io1 / io2", "st1 / sc1", "All SSD types"],
          1,
          "Multi-Attach only on io1/io2 (same AZ, Linux, up to 16 Nitro instances).",
        ),
        mcq(
          "02-eb-3",
          "Mission-critical database needing >100K IOPS sustained:",
          ["gp3", "io2 Block Express", "st1", "sc1"],
          1,
          "io2 Block Express reaches up to 256K IOPS.",
        ),
        mcq(
          "02-eb-4",
          "Cheapest EBS for infrequent access workloads:",
          ["sc1", "st1", "gp2", "io1"],
          0,
          "sc1 = HDD Cold, cheapest.",
        ),
        tf(
          "02-eb-5",
          "st1 (HDD throughput) is allowed as a boot volume.",
          false,
          "Boot must be SSD (gp2/gp3/io1/io2). HDD cannot boot.",
        ),
      ],
    },
    {
      id: "ec2-monitoring",
      title: "EC2 Monitoring",
      questions: [
        match("02-mon-m1", "Match each EC2 monitoring feature.", [
          { left: "CloudWatch Basic", right: "5-minute intervals, free" },
          { left: "CloudWatch Detailed", right: "1-minute intervals, paid" },
          { left: "EC2 Status Checks", right: "System + instance status" },
          {
            left: "CloudWatch Agent",
            right: "Push memory / disk / custom metrics",
          },
        ]),
        mcq(
          "02-mon-1",
          "You need to monitor RAM usage on EC2. How?",
          [
            "It is a default CloudWatch metric",
            "Install the CloudWatch Agent",
            "Read it from instance status checks",
            "Use Trusted Advisor",
          ],
          1,
          "Memory and disk-free are OS-level — require CloudWatch Agent.",
        ),
        tf(
          "02-mon-2",
          "CPU and network are default CloudWatch metrics for EC2.",
          true,
          "CPU, disk I/O, network, status checks are default. RAM/disk-free are NOT.",
        ),
      ],
    },
    {
      id: "metadata",
      title: "Instance Metadata & User Data",
      questions: [
        match("02-md-m1", "Match each EC2 metadata concept.", [
          {
            left: "Instance Metadata URL",
            right: "http://169.254.169.254/latest/meta-data/",
          },
          {
            left: "User Data URL",
            right: "http://169.254.169.254/latest/user-data/",
          },
          { left: "IMDSv2", right: "Token-based (PUT first), more secure" },
        ]),
        mcq(
          "02-md-1",
          "You need a bootstrap script to run when an EC2 launches:",
          ["AMI image only", "User Data", "Instance Metadata", "IAM Role"],
          1,
          "User Data runs at launch with root privileges.",
        ),
        mcq(
          "02-md-2",
          "The metadata IP address from inside an EC2 is:",
          ["127.0.0.1", "169.254.169.254", "10.0.0.1", "192.168.0.1"],
          1,
          "Link-local 169.254.169.254 for metadata.",
        ),
        tf(
          "02-md-3",
          "IMDSv2 requires a PUT request first to obtain a session token.",
          true,
          "IMDSv2 is the preferred more secure version.",
        ),
      ],
    },
    {
      id: "lambda-facts",
      title: "Lambda Key Facts",
      questions: [
        match("02-l-m1", "Match each Lambda limit / fact.", [
          { left: "Max timeout", right: "15 minutes" },
          { left: "Memory range", right: "128 MB to 10,240 MB" },
          { left: "/tmp default", right: "512 MB (up to 10 GB configurable)" },
          { left: "Container image limit", right: "10 GB" },
          { left: "Default concurrency / region", right: "1,000 (soft)" },
          { left: "Direct upload zip max", right: "50 MB zipped" },
        ]),
        mcq(
          "02-l-1",
          "You need a job that runs for 30 minutes. Best compute?",
          ["Lambda", "AWS Batch / Fargate / EC2", "API Gateway", "EventBridge"],
          1,
          "Lambda max is 15 min — use Batch/Fargate/EC2 for longer.",
        ),
        mcq(
          "02-l-2",
          "Lambda allocates CPU based on:",
          ["Number of triggers", "Memory setting", "Region", "Account tier"],
          1,
          "CPU scales proportionally with memory.",
        ),
        tf(
          "02-l-3",
          "Lambda execution environments use Firecracker micro-VMs.",
          true,
          "Each invocation isolated in a Firecracker micro-VM.",
        ),
      ],
    },
    {
      id: "lambda-triggers",
      title: "Lambda Triggers (Event Sources)",
      questions: [
        match("02-lt-m1", "Match each Lambda trigger category.", [
          { left: "API Gateway", right: "Synchronous" },
          { left: "ALB", right: "Synchronous" },
          { left: "S3 events", right: "Asynchronous" },
          { left: "SNS", right: "Asynchronous" },
          { left: "EventBridge", right: "Asynchronous" },
          { left: "SQS", right: "Poll-based" },
          { left: "Kinesis Data Streams", right: "Poll-based (stream)" },
          { left: "DynamoDB Streams", right: "Poll-based (stream)" },
        ]),
        mcq(
          "02-lt-1",
          "Lambda + SQS — how is the queue read?",
          [
            "SQS pushes to Lambda",
            "Lambda polls SQS",
            "Via EventBridge",
            "Through API Gateway",
          ],
          1,
          "Lambda polls SQS. Batch size 1–10,000 standard, 1–10 FIFO.",
        ),
        tf(
          "02-lt-2",
          "Lambda@Edge has a 30-second timeout for viewer-request triggers.",
          true,
          "Lambda@Edge has tight limits (30s viewer, 30s origin).",
        ),
      ],
    },
    {
      id: "lambda-use",
      title: "Lambda Use Cases vs Anti-Patterns",
      questions: [
        match(
          "02-lu-m1",
          'Match each scenario to "Use Lambda" or "Avoid Lambda".',
          [
            { left: "Event-driven microservice", right: "Use Lambda" },
            { left: "S3 → S3 data transform", right: "Use Lambda" },
            { left: "Scheduled cron task", right: "Use Lambda" },
            { left: "Long-running job >15 min", right: "Avoid Lambda" },
            { left: "Persistent DB connection pool", right: "Avoid Lambda" },
            {
              left: "High sustained compute, cost-sensitive",
              right: "Avoid Lambda",
            },
          ],
        ),
        tf(
          "02-lu-1",
          "Lambda is a good fit for a 20-minute video transcode job.",
          false,
          "Exceeds 15 minute limit; use Batch/Fargate/MediaConvert.",
        ),
      ],
    },
    {
      id: "ecs-concepts",
      title: "ECS Key Concepts",
      questions: [
        match("02-ec-m1", "Match each ECS concept.", [
          {
            left: "Task Definition",
            right: "Blueprint for container, CPU, memory, networking",
          },
          { left: "Task", right: "Running instance of a Task Definition" },
          {
            left: "Service",
            right: "Maintains desired task count + integrates with ELB",
          },
          {
            left: "Cluster",
            right: "Logical grouping of tasks/services and hosts",
          },
          {
            left: "Container Agent",
            right: "Runs on EC2 hosts, talks to ECS control plane",
          },
        ]),
        mcq(
          "02-ec-1",
          "In Kubernetes terms, what is an ECS Task closest to?",
          ["A Node", "A Pod", "A Cluster", "A Service"],
          1,
          "ECS Task ≈ Kubernetes Pod.",
        ),
      ],
    },
    {
      id: "ecs-launch",
      title: "ECS Launch Types",
      questions: [
        match("02-el-m1", "Match each ECS launch type to who manages hosts.", [
          { left: "EC2 launch type", right: "You manage EC2 instances" },
          {
            left: "Fargate launch type",
            right: "AWS manages all infrastructure",
          },
        ]),
        mcq(
          "02-el-1",
          "You want serverless containers (no EC2 to manage):",
          [
            "ECS on EC2",
            "ECS Fargate",
            "EKS self-managed nodes",
            "EC2 with Docker",
          ],
          1,
          "Fargate = no servers to manage; per vCPU/memory billing.",
        ),
      ],
    },
    {
      id: "ecs-networking",
      title: "ECS Networking Modes",
      questions: [
        match("02-en-m1", "Match each ECS networking mode.", [
          {
            left: "awsvpc",
            right: "Each task gets own ENI/IP (required for Fargate)",
          },
          {
            left: "bridge",
            right: "Docker virtual network on EC2 host (legacy)",
          },
          {
            left: "host",
            right: "Shares host network (max perf, no port remap)",
          },
          { left: "none", right: "No networking (batch with no net needs)" },
        ]),
        mcq(
          "02-en-1",
          "You need per-task security groups. Networking mode?",
          ["host", "bridge", "awsvpc", "none"],
          2,
          "awsvpc enables per-task SGs (and required for Fargate).",
        ),
      ],
    },
    {
      id: "ecr",
      title: "ECR (Container Registry)",
      questions: [
        match("02-ecr-m1", "Match each ECR feature.", [
          {
            left: "Registry types",
            right: "Private (per account) or Public Gallery",
          },
          { left: "Scanning", right: "Basic (on push) + Enhanced (Inspector)" },
          { left: "Encryption", right: "KMS at rest, TLS in transit" },
          {
            left: "Lifecycle Policies",
            right: "Auto-delete old/untagged images",
          },
          { left: "Cross-region replication", right: "Supported" },
        ]),
        mcq(
          "02-ecr-1",
          "Best way to prevent runaway ECR storage from untagged images:",
          [
            "Manually delete",
            "Use lifecycle policies",
            "Disable scanning",
            "Use Public ECR",
          ],
          1,
          "Lifecycle policies auto-delete old/untagged images.",
        ),
      ],
    },
    {
      id: "eks",
      title: "EKS vs ECS & EKS Node Types",
      questions: [
        match("02-eks-m1", "Match each EKS / ECS trait.", [
          {
            left: "ECS",
            right: "AWS-proprietary orchestrator, free control plane",
          },
          { left: "EKS", right: "Managed Kubernetes, $0.10/hr per cluster" },
          {
            left: "EKS Managed Node Groups",
            right: "AWS handles EC2 provisioning/patching",
          },
          { left: "EKS Self-managed Nodes", right: "You manage EC2 yourself" },
          { left: "EKS Fargate Profiles", right: "Serverless — no nodes" },
        ]),
        mcq(
          "02-eks-1",
          "Existing on-prem Kubernetes workloads — easiest port to AWS:",
          ["ECS Fargate", "EKS", "Beanstalk", "Lightsail"],
          1,
          "EKS = Kubernetes on AWS; multi-cloud portability.",
        ),
      ],
    },
    {
      id: "fargate",
      title: "AWS Fargate",
      questions: [
        match("02-far-m1", "Match each Fargate fact.", [
          { left: "Works with", right: "ECS and EKS" },
          { left: "Networking", right: "awsvpc only (ENI per task)" },
          { left: "Default ephemeral storage", right: "20 GB (up to 200 GB)" },
          { left: "Isolation", right: "Per-task micro-VM" },
        ]),
        mcq(
          "02-far-1",
          "Fargate vs Lambda — pick Fargate when:",
          [
            "Event-driven short function under 1 second",
            "Long-running stateful container service",
            "You want pay-per-invocation pricing only",
            "You need 128 MB of memory and nothing else",
          ],
          1,
          "Fargate: long-running containers; Lambda: short event-driven.",
        ),
      ],
    },
    {
      id: "lightsail",
      title: "Amazon Lightsail",
      questions: [
        match("02-ls-m1", "Match each Lightsail trait.", [
          { left: "Audience", right: "Simple web apps, dev/test, small biz" },
          { left: "Pricing", right: "Fixed monthly bundles (~$3.50+)" },
          { left: "Includes", right: "VM + SSD + transfer + DNS + static IP" },
          { left: "Managed DBs", right: "MySQL, PostgreSQL" },
        ]),
        mcq(
          "02-ls-1",
          'Keyword "simple, predictable pricing, managed VPS" maps to:',
          ["EC2", "Lightsail", "Beanstalk", "App Runner"],
          1,
          "Lightsail = simplified VPS for non-enterprise scenarios.",
        ),
      ],
    },
    {
      id: "batch",
      title: "AWS Batch",
      questions: [
        match("02-bt-m1", "Match each AWS Batch concept.", [
          {
            left: "Compute environment",
            right: "Managed or unmanaged (you provision)",
          },
          {
            left: "Compute types",
            right: "EC2, Spot EC2, Fargate, Fargate Spot",
          },
          {
            left: "Job Queues",
            right: "Where jobs are submitted; mapped to compute envs",
          },
          { left: "Job Definitions", right: "Docker container blueprint" },
        ]),
        mcq(
          "02-bt-1",
          "You need to run nightly genomics jobs that take hours. Best service?",
          ["Lambda", "AWS Batch", "API Gateway", "Step Functions only"],
          1,
          "Batch handles long-running batch jobs with auto-provisioning.",
        ),
      ],
    },
    {
      id: "beanstalk",
      title: "Elastic Beanstalk Concepts & Deployments",
      questions: [
        match("02-bs-m1", "Match each Beanstalk concept.", [
          {
            left: "Application",
            right: "Logical collection of envs/versions/configs",
          },
          {
            left: "Environment",
            right: "Running version (web or worker tier)",
          },
          { left: "Worker tier", right: "Processes SQS messages" },
          {
            left: "Application Version",
            right: "Labeled deployable code in S3",
          },
        ]),
        match(
          "02-bs-m2",
          "Match each Beanstalk deployment policy to its property.",
          [
            { left: "All at once", right: "Brief downtime, fastest" },
            {
              left: "Rolling",
              right: "No downtime, reduced capacity, moderate speed",
            },
            {
              left: "Rolling with additional batch",
              right: "No downtime, full capacity, slow",
            },
            { left: "Immutable", right: "No downtime, safest, slowest" },
            { left: "Blue/Green", right: "No downtime, swap CNAME" },
          ],
        ),
        mcq(
          "02-bs-1",
          "You need a Beanstalk deploy strategy with NO downtime and easy rollback by swapping URLs:",
          ["All at once", "Rolling", "Immutable", "Blue/Green"],
          3,
          "Blue/Green swaps CNAME — instant rollback.",
        ),
        tf(
          "02-bs-2",
          "Elastic Beanstalk has no extra charge — you pay only for underlying resources.",
          true,
          "Beanstalk itself is free; pay for EC2/RDS/ELB used.",
        ),
      ],
    },
    {
      id: "sam-sar",
      title: "SAM & Serverless Application Repository",
      questions: [
        match("02-sam-m1", "Match each.", [
          {
            left: "SAM",
            right: "CFN extension for serverless apps; sam build/deploy",
          },
          { left: "SAR", right: "Managed repo of pre-built serverless apps" },
          { left: "sam local", right: "Run Lambda locally for testing" },
        ]),
        mcq(
          "02-sam-1",
          'Keyword "deploy serverless app with local Lambda testing":',
          ["CDK", "SAM", "Terraform", "CodeDeploy"],
          1,
          "SAM provides local Lambda testing and serverless-focused CFN.",
        ),
      ],
    },
    {
      id: "parallelcluster",
      title: "AWS ParallelCluster",
      questions: [
        match("02-pc-m1", "Match each ParallelCluster detail.", [
          { left: "Purpose", right: "Traditional HPC clusters" },
          { left: "Schedulers", right: "AWS Batch, Slurm, SGE, Torque" },
          { left: "Networking for low-latency", right: "EFA" },
          { left: "Storage options", right: "EFS, FSx Lustre, EBS" },
        ]),
        mcq(
          "02-pc-1",
          'Keyword "MPI scientific simulation, tightly-coupled HPC cluster":',
          [
            "Batch only",
            "ParallelCluster + EFA",
            "Lambda fan-out",
            "Lightsail",
          ],
          1,
          "ParallelCluster with EFA networking for HPC.",
        ),
      ],
    },
    {
      id: "ri-reporting",
      title: "Reserved Instance Reporting",
      questions: [
        match("02-ri-m1", "Match each RI tool to its purpose.", [
          {
            left: "AWS Cost Explorer",
            right: "RI utilization & recommendations",
          },
          { left: "AWS Budgets", right: "Alert when RI coverage drops" },
          {
            left: "Cost & Usage Report (CUR)",
            right: "Detailed RI usage data",
          },
          { left: "Trusted Advisor", right: "Low-utilization RI checks" },
        ]),
        mcq(
          "02-ri-1",
          "RI Utilization target percentage to consider healthy:",
          [">40%", ">60%", ">80%", ">20%"],
          2,
          "Target >80% utilization to justify the RI commitment.",
        ),
      ],
    },
    {
      id: "compute-decision",
      title: "Compute Decision Tree",
      questions: [
        match("02-cd-m1", "Match each scenario to the best compute service.", [
          { left: "Full OS control, custom kernel", right: "EC2" },
          { left: "Containerized, AWS-managed", right: "ECS + Fargate" },
          { left: "Existing Kubernetes workloads", right: "EKS" },
          { left: "Event-driven code <15 min", right: "Lambda" },
          { left: "Long-running batch jobs", right: "AWS Batch" },
          { left: "PaaS upload-code-and-go", right: "Elastic Beanstalk" },
          { left: "Simple web app, flat fee", right: "Lightsail" },
          { left: "HPC / MPI workloads", right: "ParallelCluster + EFA" },
          { left: "Store container images", right: "ECR" },
          { left: "Serverless IaC", right: "SAM" },
        ]),
      ],
    },
    {
      id: "pricing-compare",
      title: "EC2 Pricing Quick Compare",
      questions: [
        match("02-pq-m1", "Match each model to its interrupt risk.", [
          { left: "On-Demand", right: "None" },
          { left: "Savings Plans", right: "None" },
          { left: "Standard RI", right: "None" },
          { left: "Convertible RI", right: "None" },
          { left: "Spot", right: "Yes (2-min warning)" },
          { left: "Dedicated Host", right: "None" },
        ]),
      ],
    },
    {
      id: "container-compare",
      title: "Container Services Comparison",
      questions: [
        match(
          "02-cc-m1",
          'Match each container option to "who manages servers".',
          [
            { left: "ECS EC2", right: "You manage" },
            { left: "ECS Fargate", right: "AWS manages" },
            { left: "EKS EC2", right: "You manage" },
            { left: "EKS Fargate", right: "AWS manages" },
          ],
        ),
      ],
    },
  ],
};
