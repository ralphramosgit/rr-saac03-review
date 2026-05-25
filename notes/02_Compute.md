# AWS SAA-C03 — Compute Services Cheat Sheet
> Study guide with rules, tables, keywords, use cases & self-test prompts

---

## PART 1: AMAZON EC2

### What Is EC2?
**Elastic Compute Cloud** — Resizable virtual machines (instances) in the cloud. You choose OS, CPU, RAM, storage, and networking. You pay for what you use.

**One-liner for the exam:** EC2 = virtual server in AWS cloud. You manage the OS and above.

---

### EC2 Instance States

| State | Description | Billed? |
|-------|-------------|---------|
| **Pending** | Instance is starting up | No |
| **Running** | Instance is active and running | ✅ Yes |
| **Stopping** | Instance is preparing to stop | No (unless Hibernate) |
| **Stopped** | Instance is off (EBS-backed only) | No (storage still billed) |
| **Shutting-down** | Instance is terminating | No |
| **Terminated** | Instance is deleted permanently | No |
| **Rebooting** | OS restart, same host | ✅ Yes |
| **Hibernating** | RAM saved to EBS, then stopped | No (storage billed) |

> **Rule:** Stopped instances do NOT charge for compute but DO charge for attached EBS volumes.
> **Rule:** Instance Store-backed instances CANNOT be stopped — only terminated.

---

### Root Device Volumes

| Type | Description | Stop/Start? | Persist After Terminate? |
|------|-------------|-------------|--------------------------|
| **EBS-backed** | Root volume on EBS | ✅ Yes | Optional (default: delete on terminate) |
| **Instance Store-backed** | Root on ephemeral disk | ❌ No (terminate only) | ❌ No — data lost on stop/terminate |

> **Rule:** Only EBS-backed instances can be stopped and restarted.
> **Rule:** Instance store = ephemeral. If host fails → data is GONE.
> **Keyword trigger:** "persist data after stop" → use EBS-backed.
> **Keyword trigger:** "temporary scratch space, high IOPS" → Instance Store.

---

### AMI (Amazon Machine Image)

**What it is:** A snapshot/template used to launch EC2 instances. Contains OS, application server, apps.

| AMI Type | Description |
|----------|-------------|
| **Public** | Provided by AWS or community |
| **Private** | Owned by your account |
| **Marketplace** | Third-party commercial AMIs |
| **Shared** | Another AWS account shared with you |

**AMI Rules:**
- AMIs are **region-specific** — must copy to another region to use there
- EBS-backed AMIs: created from EBS snapshots
- Instance Store AMIs: created using S3-stored templates
- You can share AMIs across accounts (not cross-region by default)
- Encrypted AMIs can only be shared if the KMS key is also shared

> **Keyword trigger:** "launch identical instance in another region" → copy AMI to target region first.
> **Keyword trigger:** "standardize fleet configuration" → create custom AMI.

---

### EC2 Instance Types — Family Summary

| Family | Letter | Purpose | Keyword Triggers |
|--------|--------|---------|-----------------|
| **General Purpose** | T, M | Balanced CPU/memory | Web servers, dev environments |
| **Compute Optimized** | C | High CPU | Batch, gaming, HPC, ML inference |
| **Memory Optimized** | R, X, Z | Large RAM | In-memory DBs, SAP HANA, Redis |
| **Storage Optimized** | I, D, H | High IOPS / throughput | NoSQL DBs, data warehouses, MapReduce |
| **Accelerated Computing** | P, G, Inf, Trn | GPU/FPGA | ML training, video rendering, deep learning |
| **HPC Optimized** | Hpc | High-performance compute | Tightly coupled HPC workloads |

**Naming convention:** `m5.xlarge` = Family(m) + Generation(5) + Size(xlarge)

> **Burstable (T instances):** Use CPU credits. T2/T3 Unlimited = burst beyond baseline for extra charge.

---

### EC2 Placement Groups

| Type | What It Does | Use When | Limitation |
|------|-------------|----------|------------|
| **Cluster** | Packs instances close together on same rack | Low latency, high throughput (HPC, ML) | Single AZ only; if rack fails, all fail |
| **Spread** | Places instances on distinct hardware racks | High availability, minimize correlated failures | Max 7 instances per AZ per group |
| **Partition** | Groups into partitions, each on separate racks | Large distributed systems (Hadoop, Kafka, Cassandra) | Max 7 partitions per AZ |

> **Rules:**
> - Cluster = performance (tight networking)
> - Spread = resilience (small critical instances)
> - Partition = distributed fault isolation (big data)
> - You can move an existing instance INTO a placement group (must be stopped)
> - No extra charge for placement groups

---

### EC2 Pricing Models

| Model | How It Works | Discount vs On-Demand | Best For |
|-------|-------------|----------------------|----------|
| **On-Demand** | Pay per second/hour, no commitment | Baseline (0%) | Short-term, unpredictable, dev/test |
| **Reserved (Standard)** | 1 or 3 year commitment | Up to 72% | Steady-state predictable workloads |
| **Reserved (Convertible)** | Like Standard but can change instance type | Up to 66% | Steady-state, need flexibility |
| **Savings Plans (Compute)** | $ per hour commitment, any instance type/region | Up to 66% | Flexible, applies to Lambda & Fargate too |
| **Savings Plans (Instance)** | $ commitment, specific instance family+region | Up to 72% | Steady-state, same family |
| **Spot** | Bid on spare capacity | Up to 90% | Fault-tolerant, batch, stateless |
| **Dedicated Instance** | Physical isolation from other accounts | More expensive | Compliance/licensing |
| **Dedicated Host** | You control the physical server | Most expensive | BYOL, regulatory requirements |

> **Spot Instance Rules:**
> - AWS can reclaim with 2-minute warning
> - Use for: batch jobs, CI/CD, stateless web, big data
> - NEVER use for: databases, critical stateful workloads
> - Spot Blocks: 1–6 hours, won't be interrupted
> - Spot Fleet: mix of instance types to meet target capacity

> **Reserved Instance Rules:**
> - Can be sold on Reserved Instance Marketplace (Standard only, not Convertible)
> - Scope: Regional (flexible) or Zonal (capacity reservation)
> - Scheduled RIs: deprecated — use Savings Plans instead

---

### EC2 Security

#### Security Groups
- **Stateful** firewall at the instance level
- Default: deny all inbound, allow all outbound
- Rules are ALLOW only (no explicit deny)
- Changes take effect immediately
- Can reference other security groups (not IP ranges only)
- Up to 5 SGs per instance

#### Key Pairs
- Used for SSH (Linux) or RDP password decryption (Windows)
- Private key stored by YOU — AWS does not store it
- If lost → create new key pair, update instance (or use Session Manager)

#### IAM Instance Roles
- Attach IAM role to EC2 to grant AWS service permissions
- NEVER store access keys on EC2 — use IAM roles instead
- Role can be attached/replaced without stopping the instance

> **Rule:** Always prefer IAM roles over hardcoded credentials.

---

### EC2 Networking

| Concept | Description |
|---------|-------------|
| **ENI** (Elastic Network Interface) | Virtual NIC. Can be attached/detached. Carries security groups, private IP, MAC |
| **ENA** (Elastic Network Adapter) | High-performance networking up to 100 Gbps |
| **EFA** (Elastic Fabric Adapter) | Low-latency for HPC/ML. Bypass OS kernel |
| **Elastic IP** | Static public IPv4 address. Billed when NOT attached to running instance |
| **Public IP** | Dynamic, changes on stop/start |
| **Private IP** | Persists across stop/start |

> **ENI Use Cases:** Dual-homed instances, management network, low-budget HA failover (move ENI to standby)
> **EFA Use Cases:** Tightly-coupled HPC, MPI workloads
> **Rule:** Elastic IPs are free when attached to a running instance. Billed when unattached or attached to stopped instance.

---

### EBS vs Instance Store

| Feature | EBS (Elastic Block Store) | Instance Store |
|---------|--------------------------|----------------|
| **Type** | Network-attached block storage | Physically attached to host |
| **Persistence** | Persists independently of instance | Lost on stop/terminate/failure |
| **Performance** | Up to 256,000 IOPS (io2 Block Express) | Very high (NVMe SSD), but ephemeral |
| **Snapshot** | ✅ Yes (to S3) | ❌ No |
| **Root volume** | ✅ Yes | ✅ Yes (AMI must be instance store) |
| **Encryption** | ✅ Yes (KMS) | ✅ Yes |
| **Max size** | Up to 64 TiB | Varies by instance type |
| **Cost** | Separate charge | Included in instance price |
| **Stop/Start** | ✅ Survives | ❌ Data lost on stop |

#### EBS Volume Types

| Type | Category | Max IOPS | Max Throughput | Best For |
|------|----------|----------|----------------|----------|
| **gp3** | SSD General | 16,000 | 1,000 MiB/s | Default, most workloads |
| **gp2** | SSD General | 16,000 | 250 MiB/s | Legacy general purpose |
| **io2** | SSD Provisioned | 64,000 (256K w/ Block Express) | 4,000 MiB/s | Mission-critical DBs |
| **io1** | SSD Provisioned | 64,000 | 1,000 MiB/s | High-performance DBs |
| **st1** | HDD Throughput | 500 | 500 MiB/s | Big data, log processing |
| **sc1** | HDD Cold | 250 | 250 MiB/s | Infrequent access, cheapest |

> **Rules:**
> - Only SSD types (gp2, gp3, io1, io2) can be used as boot volumes
> - gp3 is cheaper AND more flexible than gp2 — prefer gp3
> - Multi-Attach: io1/io2 only, same AZ, Linux only
> - EBS volumes are AZ-specific — to move, snapshot → create in new AZ

---

### EC2 Monitoring

| Feature | Details |
|---------|---------|
| **CloudWatch Basic** | 5-minute intervals, free |
| **CloudWatch Detailed** | 1-minute intervals, paid |
| **EC2 Status Checks** | System status (AWS infrastructure) + Instance status (OS) |
| **CloudWatch Agent** | Pushes memory, disk, custom metrics (not default EC2 metrics) |
| **CloudWatch Logs** | Send OS/app logs to CloudWatch |

> **Rule:** RAM utilization is NOT a default CloudWatch metric — requires CloudWatch Agent.

---

### Instance Metadata & User Data

| Feature | URL | Purpose |
|---------|-----|---------|
| **Instance Metadata** | `http://169.254.169.254/latest/meta-data/` | Get instance info (IP, IAM role credentials, AZ, etc.) |
| **User Data** | `http://169.254.169.254/latest/user-data/` | Bootstrap script run at launch (root privileges) |
| **IMDSv2** | Same URL, requires session token | More secure version (PUT request to get token first) |

> **Rule:** IMDSv2 is preferred/required for security. Enforced by disabling IMDSv1.
> **Use case:** User data = install software, configure settings at first boot.

---

## PART 2: SERVERLESS & CONTAINERS

---

## AWS LAMBDA

### What Is Lambda?
**Serverless compute** — Run code without provisioning servers. You upload code; AWS runs it in response to triggers.

**One-liner:** Lambda = run code on-demand, pay per invocation + duration. No servers to manage.

### Lambda Key Facts

| Feature | Detail |
|---------|--------|
| **Timeout** | Max 15 minutes per invocation |
| **Memory** | 128 MB to 10,240 MB (scales CPU proportionally) |
| **Temp storage** | /tmp = 512 MB (up to 10 GB configurable) |
| **Package size** | 50 MB zipped direct upload; 250 MB unzipped; use S3 for larger |
| **Deployment** | Zip file or container image (up to 10 GB) |
| **Concurrency** | 1,000 default per region (soft limit, can increase) |
| **Execution env** | Micro-VM (Firecracker), isolated |

### Lambda Triggers (Event Sources)

| Category | Services |
|----------|---------|
| **Synchronous** | API Gateway, ALB, Cognito, Lex, Alexa, CloudFront (Lambda@Edge) |
| **Asynchronous** | S3, SNS, SES, CloudFormation, CloudWatch Events/EventBridge, CodeCommit |
| **Poll-based (stream)** | Kinesis Data Streams, DynamoDB Streams, SQS, Amazon MQ, Kafka |

> **Rule:** SQS + Lambda = Lambda polls the queue. Batch size configurable (1–10,000 for standard, 1–10 for FIFO).
> **Rule:** Lambda@Edge runs at CloudFront edge locations. Timeout max 30s (viewer) or 30s (origin). Good for A/B testing, auth at edge.

### Lambda Pricing

| Dimension | Rate |
|-----------|------|
| **Requests** | $0.20 per 1M requests (first 1M/month free) |
| **Duration** | $0.0000166667 per GB-second (400,000 GB-seconds free/month) |

### Lambda Use Cases vs Anti-Patterns

| Use Lambda | Avoid Lambda |
|------------|-------------|
| Event-driven microservices | Long-running jobs (>15 min) |
| Data transformation (S3→S3) | Persistent connections (DBs with many open connections) |
| API backends (stateless) | Large local state / file system needs |
| Scheduled tasks (cron) | Cost-sensitive very high sustained compute |
| Real-time stream processing | |

---

## AMAZON ECS (Elastic Container Service)

### What Is ECS?
AWS-managed **container orchestration** service. Run Docker containers without managing Kubernetes.

**One-liner:** ECS = AWS-native Docker container management. Use Fargate (serverless) or EC2 (you manage hosts).

### ECS Key Concepts

| Concept | Description |
|---------|-------------|
| **Task Definition** | Blueprint — defines container image, CPU, memory, networking, volumes |
| **Task** | Running instance of a Task Definition (like a Pod in Kubernetes) |
| **Service** | Maintains desired count of running tasks, integrates with load balancers |
| **Cluster** | Logical grouping of tasks/services and EC2 instances (or Fargate) |
| **Container Agent** | Runs on EC2 hosts to communicate with ECS control plane |

### ECS Launch Types

| Launch Type | Who Manages Hosts | Pricing | Use When |
|-------------|------------------|---------|----------|
| **EC2** | You manage EC2 instances | EC2 cost + ECS (free) | Need full control, custom AMIs, GPU, cost optimization at scale |
| **Fargate** | AWS manages all infrastructure | Pay per vCPU/memory used | Don't want to manage servers, variable workloads |

### ECS Networking Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **awsvpc** | Each task gets its own ENI and private IP | Recommended; required for Fargate |
| **bridge** | Docker's virtual network on EC2 host | Legacy EC2 launch type |
| **host** | Shares EC2 host network | Max performance, no port remapping |
| **none** | No networking | Batch jobs with no network needs |

> **Rule:** awsvpc mode allows security groups per task (not per host). Recommended for all new workloads.

---

## AMAZON ECR (Elastic Container Registry)

### What Is ECR?
**Managed Docker container registry** — store, manage, and deploy container images.

| Feature | Detail |
|---------|--------|
| **Type** | Private (per account) or Public (ECR Public Gallery) |
| **Integration** | ECS, EKS, Lambda container images, App Runner |
| **Scanning** | Basic scanning (on push) and Enhanced scanning (continuous, Amazon Inspector) |
| **Encryption** | At rest with KMS, in transit with TLS |
| **Lifecycle Policies** | Auto-delete old/untagged images to save cost |
| **Cross-region replication** | ✅ Yes |
| **Cross-account** | ✅ Yes via resource-based policies |

> **Pricing:** $0.10 per GB/month storage. Data transfer to AWS services in same region is free.
> **Rule:** Use ECR lifecycle policies to prevent runaway storage costs from untagged images.

---

## AMAZON EKS (Elastic Kubernetes Service)

### What Is EKS?
**Managed Kubernetes** — AWS runs the Kubernetes control plane. You manage worker nodes (or use Fargate).

**One-liner:** EKS = Kubernetes on AWS. Use when you need Kubernetes-native features or multi-cloud portability.

### EKS vs ECS

| Feature | ECS | EKS |
|---------|-----|-----|
| **Orchestrator** | AWS-proprietary | Kubernetes (open-source) |
| **Learning curve** | Low | High (Kubernetes knowledge needed) |
| **Portability** | AWS only | Multi-cloud / on-prem |
| **Use case** | Simple container workloads on AWS | Complex orchestration, existing K8s workloads |
| **Pricing** | Control plane free | $0.10/hour per cluster |

### EKS Node Types

| Node Type | Description |
|-----------|-------------|
| **Managed Node Groups** | AWS handles EC2 provisioning, patching, scaling |
| **Self-managed Nodes** | You manage EC2 instances yourself |
| **Fargate Profiles** | Serverless — no nodes to manage |

> **EKS Anywhere:** Run EKS on your on-premises hardware using VMware.
> **EKS Distro:** AWS-curated Kubernetes distribution you can run yourself.

---

## AWS FARGATE

### What Is Fargate?
**Serverless container compute engine** for ECS and EKS. You define CPU/memory; AWS handles the rest.

| Feature | Detail |
|---------|--------|
| **Works with** | ECS and EKS |
| **No servers** | No EC2 instances to provision or manage |
| **Isolation** | Each task runs in its own micro-VM (strong isolation) |
| **Networking** | awsvpc mode only (each task gets ENI) |
| **Storage** | 20 GB ephemeral storage included, up to 200 GB |

### Fargate Pricing

| Dimension | Rate |
|-----------|------|
| **vCPU** | ~$0.04048 per vCPU-hour |
| **Memory** | ~$0.004445 per GB-hour |

> **Fargate vs Lambda:**
> - Lambda: event-driven, max 15 min, stateless
> - Fargate: containerized, long-running, stateful services possible

---

## AMAZON LIGHTSAIL

### What Is Lightsail?
**Simplified VPS** — Easy-to-use virtual private servers with predictable pricing. For developers new to AWS.

| Feature | Detail |
|---------|--------|
| **Target audience** | Simple web apps, dev/test, small business |
| **Includes** | VM, SSD storage, data transfer, DNS, static IP |
| **Pricing** | Fixed monthly bundles starting at ~$3.50/month |
| **OS** | Linux, Windows |
| **Managed DBs** | MySQL, PostgreSQL (separate from EC2 RDS) |
| **Containers** | Lightsail Container Services |
| **Load Balancer** | Available within Lightsail |

> **Rule:** Lightsail is NOT exam-critical for SAA-C03 beyond knowing: "simple, predictable pricing, VPS, NOT enterprise-scale."
> **Keyword trigger:** "simple web hosting, low budget, managed VPS" → Lightsail.

---

## AWS BATCH

### What Is Batch?
**Fully managed batch computing** — runs hundreds of thousands of batch jobs automatically. You define jobs; AWS provisions compute.

| Feature | Detail |
|---------|--------|
| **Compute environments** | Managed (AWS provisions/scales) or Unmanaged (you provision) |
| **Compute types** | EC2, Spot EC2, Fargate, Fargate Spot |
| **Job Queues** | Jobs submitted to queues, mapped to compute environments |
| **Job Definitions** | Docker container definition (image, vCPU, memory, env vars) |
| **Scheduling** | Priority-based, FIFO within same priority |
| **Integration** | EventBridge, Step Functions, Lambda triggers |

> **Batch vs Lambda:**
> - Lambda max 15 min, limited memory → short functions
> - Batch: no time limit, large compute → long-running batch jobs

> **Keyword triggers:** "ETL pipelines, genomics, financial risk models, rendering jobs, nightly batch processing" → AWS Batch

---

## AWS ELASTIC BEANSTALK

### What Is Elastic Beanstalk?
**Platform-as-a-Service (PaaS)** — Upload code; Elastic Beanstalk handles deployment, capacity, load balancing, auto scaling, and health monitoring.

**One-liner:** Beanstalk = deploy app without managing infrastructure. You keep full control if needed.

### Supported Platforms

Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker (single/multi-container)

### Beanstalk Key Concepts

| Concept | Description |
|---------|-------------|
| **Application** | Logical collection of environments, versions, configs |
| **Environment** | Running version of your app (web server or worker tier) |
| **Environment Tier** | Web Server (handles HTTP) or Worker (processes SQS messages) |
| **Application Version** | Labeled iteration of deployable code stored in S3 |
| **Configuration** | Settings for environment (instance type, scaling, etc.) |

### Beanstalk Deployment Policies

| Policy | Downtime? | Speed | Rollback |
|--------|-----------|-------|---------|
| **All at once** | ✅ Brief outage | Fastest | Redeploy |
| **Rolling** | ❌ No (reduced capacity) | Moderate | Manual |
| **Rolling with additional batch** | ❌ No (full capacity) | Slow | Manual |
| **Immutable** | ❌ No | Slowest but safest | Terminate new fleet |
| **Blue/Green** | ❌ No | Swap URL (CNAME) | Swap back |

> **Rule:** Beanstalk is FREE — you only pay for underlying resources (EC2, RDS, ELB, etc.)
> **Rule:** Beanstalk retains old application versions in S3 — set lifecycle policies to delete old versions.

---

## AWS LAMBDA — SERVERLESS APPLICATION MODEL (SAM)

### What Is SAM?
**Open-source framework** to build and deploy serverless applications. Extension of CloudFormation.

| Feature | Detail |
|---------|--------|
| **Template** | YAML/JSON extension of CloudFormation |
| **Resources** | `AWS::Serverless::Function`, `AWS::Serverless::Api`, `AWS::Serverless::Table` |
| **CLI** | `sam build`, `sam local invoke`, `sam deploy` |
| **Local testing** | Run Lambda locally with `sam local` |
| **Purpose** | Simplifies serverless app deployment vs raw CloudFormation |

> **SAM vs CloudFormation:** SAM is a superset — SAM templates transform into CloudFormation templates.
> **Keyword trigger:** "deploy serverless app, local Lambda testing, IaC for Lambda" → SAM.

---

## AWS SERVERLESS APPLICATION REPOSITORY (SAR)

### What Is SAR?
**Managed repository** of pre-built serverless applications. Discover, deploy, and share serverless apps.

| Feature | Detail |
|---------|--------|
| **Discovery** | Find applications in the AWS Console or CLI |
| **Deploy** | One-click deploy serverless apps from SAR |
| **Publish** | Share your own serverless apps publicly or privately |
| **Built on** | SAM templates |

> **Keyword trigger:** "reuse serverless patterns, deploy pre-built Lambda applications" → SAR.

---

## AWS PARALLELCLUSTER

### What Is ParallelCluster?
**Open-source HPC cluster management tool** — deploy and manage High Performance Computing clusters on AWS.

| Feature | Detail |
|---------|--------|
| **Purpose** | Traditional HPC workloads (scientific computing, simulation) |
| **Scheduler** | AWS Batch, Slurm, SGE, Torque |
| **Networking** | EFA (Elastic Fabric Adapter) for low-latency inter-node |
| **Storage** | EFS, FSx for Lustre, EBS |
| **Auto-scaling** | Scales compute nodes up/down based on job queue |

> **Keyword triggers:** "MPI workloads, scientific simulation, genomics, computational fluid dynamics, HPC cluster" → ParallelCluster + EFA.

---

## RESERVED INSTANCE REPORTING

### What Is RI Reporting?
Tools to track Reserved Instance **utilization** and **coverage** to optimize costs.

| Tool | Purpose |
|------|---------|
| **AWS Cost Explorer** | RI utilization reports, RI recommendations |
| **AWS Budgets** | Alert when RI coverage drops below threshold |
| **Cost and Usage Report (CUR)** | Detailed RI usage data |
| **Trusted Advisor** | Low utilization RI checks |

### Key Metrics

| Metric | Description |
|--------|-------------|
| **RI Utilization** | % of RI hours actually used (target: >80%) |
| **RI Coverage** | % of instance hours covered by RIs vs On-Demand |

> **Rule:** Unused RIs still incur charges. Sell on Marketplace (Standard RIs) or convert to Savings Plans.
> **Keyword trigger:** "optimize Reserved Instance spend, check if RIs are being used" → Cost Explorer RI reporting.

---

## PART 3: QUICK-REFERENCE COMPARISON TABLES

### Compute Service Decision Tree

| Scenario | Best Service |
|----------|-------------|
| Full control over OS, custom kernel | EC2 |
| Containerized app, AWS-managed | ECS + Fargate |
| Existing Kubernetes workloads | EKS |
| Event-driven code, <15 min | Lambda |
| Long-running batch jobs | AWS Batch |
| PaaS, upload code and go | Elastic Beanstalk |
| Simple web app, predictable cost | Lightsail |
| HPC / MPI workloads | ParallelCluster + EFA |
| Store container images | ECR |
| Serverless IaC for Lambda | SAM |

---

### EC2 Pricing Quick Compare

| Model | Commitment | Max Savings | Interrupt Risk | Best For |
|-------|------------|-------------|----------------|---------|
| On-Demand | None | 0% | None | Unpredictable |
| Savings Plans | 1-3 yr | 66-72% | None | Flexible steady state |
| Standard RI | 1-3 yr | 72% | None | Predictable, same instance |
| Convertible RI | 1-3 yr | 66% | None | Predictable, need flexibility |
| Spot | None | 90% | Yes (2-min warning) | Fault-tolerant batch |
| Dedicated Host | 1-3 yr (optional) | Varies | None | BYOL, compliance |

---

### EBS Volume Quick Compare

| Volume | IOPS | Throughput | Cost | Boot? |
|--------|------|-----------|------|-------|
| gp3 | 16K | 1,000 MB/s | Low | ✅ |
| gp2 | 16K | 250 MB/s | Low | ✅ |
| io2 | 256K | 4,000 MB/s | High | ✅ |
| io1 | 64K | 1,000 MB/s | High | ✅ |
| st1 | 500 | 500 MB/s | Very Low | ❌ |
| sc1 | 250 | 250 MB/s | Lowest | ❌ |

---

### Container Services Comparison

| Feature | ECS EC2 | ECS Fargate | EKS EC2 | EKS Fargate |
|---------|---------|-------------|---------|-------------|
| Manage Servers | ✅ You | ❌ AWS | ✅ You | ❌ AWS |
| Kubernetes | ❌ | ❌ | ✅ | ✅ |
| Pricing | EC2 cost | Per vCPU/GB | EC2 + $0.10/hr | Per vCPU/GB |
| Multi-cloud | ❌ | ❌ | ✅ | ✅ |
| Best For | Custom/cost | Serverless containers | K8s workloads | Serverless K8s |

---

### Serverless Services Comparison

| Service | Unit | Max Duration | Trigger | Manages Infra |
|---------|------|-------------|---------|---------------|
| Lambda | Function | 15 minutes | Events (S3, API GW, SQS…) | Fully |
| Fargate | Container | Unlimited | ECS/EKS service/task | Compute only |
| Batch | Job | Unlimited | Queue / scheduled | Compute only |
| Beanstalk | Application | Unlimited | HTTP / SQS | Partially (PaaS) |

---

## PART 4: SELF-TEST FLASH QUESTIONS

Use these to quiz yourself — cover the right column and answer from the left.

| Question | Answer |
|----------|--------|
| What's the max Lambda timeout? | **15 minutes** |
| Can you stop an Instance Store-backed EC2? | **No — terminate only** |
| What placement group gives lowest latency? | **Cluster** |
| What placement group has max 7 instances per AZ? | **Spread** |
| What EBS type is cheapest and lowest performance? | **sc1 (Cold HDD)** |
| What URL provides EC2 instance metadata? | **169.254.169.254/latest/meta-data/** |
| Which EBS type supports Multi-Attach? | **io1 and io2 only** |
| What's the max Spot Instance warning time? | **2 minutes** |
| Which container service requires Kubernetes knowledge? | **EKS** |
| What networking mode is required for Fargate ECS? | **awsvpc** |
| Free tier for Lambda requests/month? | **1 million requests** |
| EBS snapshot stores data where? | **Amazon S3** |
| Which RI type can be sold on Marketplace? | **Standard RIs only (not Convertible)** |
| What tool deploys serverless apps locally and to AWS? | **SAM (Serverless Application Model)** |
| What is the RAM limit in Lambda? | **10,240 MB (10 GB)** |
| Which EC2 family is best for in-memory databases? | **R (Memory Optimized)** |
| What happens to Instance Store data when instance stops? | **Data is LOST permanently** |
| AMI is region-specific — how do you use it in another region? | **Copy the AMI to the target region** |
| Which EBS volumes can be used as boot volumes? | **SSD only: gp2, gp3, io1, io2** |
| Which pricing model saves up to 90%? | **Spot Instances** |
| What does EFA provide that ENA doesn't? | **OS kernel bypass for ultra-low latency HPC/MPI** |
| What is the default ECS networking mode for Fargate? | **awsvpc** |
| Which service is best for "upload code, don't manage infra"? | **Elastic Beanstalk** |
| What does SAR stand for? | **Serverless Application Repository** |
| ParallelCluster + what adapter = HPC low latency? | **EFA (Elastic Fabric Adapter)** |
| What % RI utilization should you target to avoid waste? | **> 80%** |
| Default CloudWatch EC2 metrics interval? | **5 minutes (basic monitoring)** |
| Is RAM a default CloudWatch EC2 metric? | **No — requires CloudWatch Agent** |
| What's the max EBS volume size? | **64 TiB** |
| Beanstalk deployment with NO downtime and safest rollback? | **Immutable deployment** |

---

## PART 5: EXAM KEYWORD TRIGGERS

| Keyword / Phrase | Think → |
|-----------------|---------|
| "Lowest cost, fault-tolerant, batch" | Spot Instances |
| "Predictable workload, 3-year commitment" | Standard Reserved Instance or Savings Plans |
| "BYOL, physical server, compliance" | Dedicated Host |
| "Low latency between instances, HPC" | Cluster Placement Group |
| "Minimize correlated hardware failures" | Spread Placement Group |
| "Large distributed system, big data isolation" | Partition Placement Group |
| "Serverless, event-driven, <15 min" | Lambda |
| "Docker containers, AWS-native" | ECS |
| "Kubernetes, existing K8s workloads" | EKS |
| "No servers, containers" | Fargate |
| "Long running batch jobs, ETL" | AWS Batch |
| "Upload code, PaaS, auto-scale" | Elastic Beanstalk |
| "Simple hosting, fixed price VPS" | Lightsail |
| "Container image registry" | ECR |
| "HPC, MPI, tightly coupled nodes" | ParallelCluster + EFA |
| "Serverless IaC, local Lambda dev" | SAM |
| "Reuse serverless patterns, pre-built apps" | Serverless Application Repository |
| "Static public IP for EC2" | Elastic IP |
| "Bootstrap script on EC2 launch" | User Data |
| "EC2 credentials without access keys" | IAM Instance Role |
| "Memory/disk metrics on EC2" | CloudWatch Agent |
| "Preserve data across stop/start" | EBS-backed instance |
| "Temporary, highest IOPS, ephemeral" | Instance Store |
| "Check RI waste, unused reservations" | Cost Explorer RI Utilization Report |

---

*Source references: AWS Documentation, Tutorials Dojo SAA-C03 Cheat Sheets*
*Exam: AWS Certified Solutions Architect – Associate (SAA-C03)*
