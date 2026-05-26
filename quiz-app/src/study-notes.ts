// Aggregate raw markdown from 3 sources, bundled at build-time.
const all = import.meta.glob("./notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function get(path: string): string | undefined {
  return all[path];
}

export type SourceKind =
  | "concise"
  | "ultra"
  | "fast"
  | "deep"
  | "theory"
  | "diagrams"
  | "practice";

export type NoteSource = {
  kind: SourceKind;
  label: string;
  /** Short hint shown under the tab label */
  hint: string;
  origin: "Workspace" | "SAA-C03" | "Yash";
  content: string;
};

export type StudyModule = {
  id: string;
  number: string;
  title: string;
  emoji: string;
  blurb: string;
  weight: "Critical" | "High" | "Medium" | "Low";
  keyServices: string[];
  sources: NoteSource[];
};

type ModuleDef = {
  id: string;
  number: string;
  title: string;
  emoji: string;
  blurb: string;
  weight: StudyModule["weight"];
  keyServices: string[];
  /** Workspace `notes/NN_*.md` filename(s). */
  local?: string[];
  /** SAA-C03 folder under `notes/NN-Module/`. */
  saaFolder?: string;
  /** Yash markdown filenames (under `notes/_yash/`). */
  yash?: string[];
};

const SAA = (folder: string, file: string) => get(`./notes/${folder}/${file}`);
const YASH = (file: string) => get(`./notes/_yash/${file}`);
const LOCAL = (file: string) => get(`./notes/_local/${file}`);

const DEFS: ModuleDef[] = [
  {
    id: "01-fundamentals",
    number: "01",
    title: "AWS Fundamentals",
    emoji: "🌐",
    blurb:
      "Global infrastructure: Regions, AZs, Edge Locations, Local Zones, Outposts. Shared Responsibility & the Well-Architected Framework.",
    weight: "Medium",
    keyServices: ["Regions", "AZs", "Edge", "Outposts", "Local Zones"],
    local: ["01_AWS_Overview.md"],
    saaFolder: "01-AWS-Fundamentals",
  },
  {
    id: "02-iam",
    number: "02",
    title: "IAM & Identity",
    emoji: "🔐",
    blurb:
      "Users, groups, roles, policies, identity federation, SSO, Cognito, STS. Permission boundaries, SCPs, and least privilege.",
    weight: "Critical",
    keyServices: [
      "IAM",
      "STS",
      "Cognito",
      "IAM Identity Center",
      "Organizations",
    ],
    local: ["07_Security_Identity.md"],
    saaFolder: "02-IAM",
    yash: ["19. Identity and Access Management (IAM) - Advanced.md"],
  },
  {
    id: "03-compute",
    number: "03",
    title: "Compute",
    emoji: "⚙️",
    blurb:
      "EC2 (types, purchase options, placement, storage), ELB & ASG, Lambda, ECS/EKS/Fargate, Batch, Lightsail, Outposts.",
    weight: "Critical",
    keyServices: [
      "EC2",
      "ELB",
      "ASG",
      "Lambda",
      "ECS",
      "EKS",
      "Fargate",
      "Batch",
    ],
    local: ["02_Compute.md"],
    saaFolder: "03-Compute",
    yash: [
      "1. EC2 Fundamentals.md",
      "2. EC2 - Solutions Architect Associate Level.md",
      "3. EC2 Instance Storage.md",
      "4.1. AWS Load Balancers.md",
      "4.2. ASG.md",
      "13. Containers on AWS (ECS, Fargate, ECR & EKS).md",
      "14. Serverless Overviews from a Solution Architect Perspective.md",
    ],
  },
  {
    id: "04-storage",
    number: "04",
    title: "Storage",
    emoji: "💾",
    blurb:
      "S3 (classes, lifecycle, replication, security), EBS, EFS, FSx, Storage Gateway, Snow Family, Backup.",
    weight: "Critical",
    keyServices: ["S3", "EBS", "EFS", "FSx", "Storage Gateway", "Snow"],
    local: ["03_Storage.md"],
    saaFolder: "04-Storage",
    yash: [
      "7. S3 Basic.md",
      "8. S3 Advance.md",
      "9. S3 Security.md",
      "11. AWS Storage.md",
    ],
  },
  {
    id: "05-database",
    number: "05",
    title: "Databases",
    emoji: "🗄️",
    blurb:
      "RDS, Aurora, DynamoDB, ElastiCache, Neptune, DocumentDB, Keyspaces, QLDB, Timestream, MemoryDB.",
    weight: "Critical",
    keyServices: ["RDS", "Aurora", "DynamoDB", "ElastiCache", "Redshift"],
    local: ["04_Database.md"],
    saaFolder: "05-Database",
    yash: ["5. RDS, Aurora, and ElastiCache.md", "15. AWS Databases.md"],
  },
  {
    id: "06-networking",
    number: "06",
    title: "Networking",
    emoji: "🌐",
    blurb:
      "VPC, subnets, route tables, NACL, SG, Transit Gateway, Direct Connect, VPN, Route 53, CloudFront, Global Accelerator.",
    weight: "Critical",
    keyServices: [
      "VPC",
      "Route 53",
      "CloudFront",
      "Direct Connect",
      "Transit GW",
      "Global Accelerator",
    ],
    local: ["06_Networking.md"],
    saaFolder: "06-Networking",
    yash: [
      "6. Route 53.md",
      "10. CloudFront & Global Accelerator.md",
      "21. Networking - VPC.md",
    ],
  },
  {
    id: "07-security",
    number: "07",
    title: "Security & Encryption",
    emoji: "🛡️",
    blurb:
      "KMS, CloudHSM, Secrets Manager, SSM Parameter Store, ACM, WAF, Shield, GuardDuty, Inspector, Macie, Detective.",
    weight: "Critical",
    keyServices: [
      "KMS",
      "WAF",
      "Shield",
      "Secrets Manager",
      "GuardDuty",
      "Macie",
    ],
    local: ["07_Security_Identity.md"],
    saaFolder: "07-Security",
    yash: [
      "20. AWS Security & Encryption (KMS, SSM Parameter Store, Shield, WAF).md",
    ],
  },
  {
    id: "08-app-integration",
    number: "08",
    title: "Application Integration",
    emoji: "🔗",
    blurb:
      "Decoupling with SQS, SNS, EventBridge, Step Functions, Kinesis, MSK, MQ, AppFlow.",
    weight: "High",
    keyServices: ["SQS", "SNS", "EventBridge", "Step Functions", "Kinesis"],
    local: ["12_Application_Services.md"],
    saaFolder: "08-Application-Integration",
    yash: ["12. Decoupling applications (SQS, SNS, Kinesis, Active MQ).md"],
  },
  {
    id: "09-monitoring",
    number: "09",
    title: "Monitoring & Audit",
    emoji: "📊",
    blurb:
      "CloudWatch (metrics, logs, alarms, events), CloudTrail, AWS Config, X-Ray, Trusted Advisor, Health.",
    weight: "High",
    keyServices: ["CloudWatch", "CloudTrail", "Config", "X-Ray"],
    local: ["08_Management_Tools.md"],
    saaFolder: "09-Monitoring",
    yash: ["18. AWS Monitoring & Audit (CloudWatch, CloudTrail & Config).md"],
  },
  {
    id: "10-migration",
    number: "10",
    title: "Migration & DR",
    emoji: "🚚",
    blurb:
      "DMS, SMS, MGN, DataSync, Snow family, Transfer Family. DR strategies (backup/restore, pilot light, warm standby, multi-site).",
    weight: "High",
    keyServices: ["DMS", "MGN", "DataSync", "Snow", "Backup"],
    local: ["05_Migration.md"],
    saaFolder: "10-Migration",
    yash: ["22. AWS Disaster Recovery & Migrations.md"],
  },
  {
    id: "11-analytics",
    number: "11",
    title: "Analytics & ML",
    emoji: "📈",
    blurb:
      "Athena, Glue, EMR, Kinesis, Redshift, QuickSight, OpenSearch, Lake Formation. ML services overview (SageMaker, Comprehend, Rekognition…).",
    weight: "Medium",
    keyServices: ["Athena", "Glue", "Redshift", "EMR", "QuickSight"],
    local: ["09_Analytics.md", "15_ML_AI.md"],
    saaFolder: "11-Analytics",
    yash: ["16. AWS Data Analytics.md", "17. AWS Machine Learning.md"],
  },
  {
    id: "12-architecture",
    number: "12",
    title: "Architecture Patterns",
    emoji: "🏛️",
    blurb:
      "Reference architectures: 3-tier web, event-driven, microservices, serverless, hybrid, DR. Service-by-service comparison cheatsheet.",
    weight: "High",
    keyServices: ["3-tier", "Event-driven", "Serverless", "Hybrid"],
    local: ["17_Comparisons.md"],
    saaFolder: "12-Architecture-Patterns",
    yash: ["23. More Solution Architectures.md"],
  },
  {
    id: "13-cost",
    number: "13",
    title: "Cost Optimization",
    emoji: "💰",
    blurb:
      "Pricing models, Savings Plans, RIs, Spot, Cost Explorer, Budgets, Compute Optimizer, S3 Storage Lens.",
    weight: "Medium",
    keyServices: ["Savings Plans", "RIs", "Spot", "Cost Explorer", "Budgets"],
    local: ["10_Billing_Cost.md"],
    saaFolder: "13-Cost-Optimization",
  },
  {
    id: "14-practice",
    number: "14",
    title: "Practice & Exam Tactics",
    emoji: "🎯",
    blurb:
      "Question-style drills, service-to-question mapping, flashcards, and exam tactics.",
    weight: "High",
    keyServices: ["Flashcards", "Drills", "Service mapping"],
    saaFolder: "14-Practice",
    yash: ["24. Other Services.md"],
  },
  {
    id: "18-disaster-recovery",
    number: "18",
    title: "Disaster Recovery",
    emoji: "🚨",
    blurb:
      "HA vs FT vs DR, RTO vs RPO, the 4 DR strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Site), and AWS DR building blocks.",
    weight: "High",
    keyServices: [
      "AWS Backup",
      "Aurora Global",
      "DynamoDB Global Tables",
      "DRS",
      "Route 53 Failover",
      "Global Accelerator",
    ],
    local: ["18_Disaster_Recovery.md"],
  },
  {
    id: "19-scaling-load-balancing",
    number: "19",
    title: "Auto Scaling & Load Balancing",
    emoji: "⚖️",
    blurb:
      "ALB / NLB / GWLB deep dive, ASG mechanics, scaling policies (Simple / Step / Target Tracking / Predictive), lifecycle hooks, health checks, and exam patterns.",
    weight: "Critical",
    keyServices: [
      "ALB",
      "NLB",
      "GWLB",
      "ASG",
      "Launch Template",
      "Target Group",
    ],
    local: ["19_Scaling_LoadBalancing.md"],
  },
  {
    id: "20-weaknesses",
    number: "20",
    title: "Personal Weaknesses Drill",
    emoji: "🎯",
    blurb:
      "Targeted drill on your personal exam weak spots: DynamoDB hot partitions, Aurora custom endpoints, RDS IAM Auth, S3 CSE-C, Geo routing, WAF/Shield/FW Manager, CloudWatch Agent, SNS filter policies.",
    weight: "Critical",
    keyServices: [
      "DynamoDB",
      "Aurora",
      "RDS IAM Auth",
      "S3 CSE",
      "Route 53",
      "WAF",
      "Shield",
      "CloudWatch Agent",
      "SNS",
    ],
    local: ["20_Weaknesses.md"],
  },
  {
    id: "21-decoupling",
    number: "21",
    title: "Decoupling (Deep Dive)",
    emoji: "🔗",
    blurb:
      "End-to-end decoupling stack: SQS, SNS, EventBridge, Step Functions, Kinesis, MSK, MQ. Patterns, limits, ordering/delivery semantics, and exam triggers.",
    weight: "Critical",
    keyServices: [
      "SQS",
      "SNS",
      "EventBridge",
      "Step Functions",
      "Kinesis",
      "MSK",
      "Amazon MQ",
    ],
    local: ["21_Decoupling.md"],
    saaFolder: "21-Decoupling",
  },
];

function buildSources(d: ModuleDef): NoteSource[] {
  const out: NoteSource[] = [];

  // Concise workspace notes
  if (d.local) {
    const combined = d.local
      .map((f) => LOCAL(f))
      .filter(Boolean)
      .join("\n\n---\n\n");
    if (combined) {
      out.push({
        kind: "concise",
        label: "Concise",
        hint: "Curated workspace notes",
        origin: "Workspace",
        content: combined,
      });
    }
  }

  // Ultra fast learn
  if (d.saaFolder) {
    const ultra = SAA(d.saaFolder, "ULTRA-FAST-LEARN.md");
    if (ultra) {
      out.push({
        kind: "ultra",
        label: "Ultra Fast Learn",
        hint: "Cram-sized bullet recap",
        origin: "SAA-C03",
        content: ultra,
      });
    }
    const fast = SAA(d.saaFolder, "FAST-LEARN.md");
    if (fast) {
      out.push({
        kind: "fast",
        label: "Fast Learn",
        hint: "Speed-read summary",
        origin: "SAA-C03",
        content: fast,
      });
    }
    const deep = SAA(d.saaFolder, "README.md");
    if (deep) {
      out.push({
        kind: "deep",
        label: "Deep Dive",
        hint: "Full module reference",
        origin: "SAA-C03",
        content: deep,
      });
    }
  }

  // Yash detailed theory
  if (d.yash) {
    const combined = d.yash
      .map((f) => {
        const body = YASH(f);
        if (!body) return "";
        const title = f.replace(/\.md$/i, "");
        return `## ${title}\n\n${body}`;
      })
      .filter(Boolean)
      .join("\n\n---\n\n");
    if (combined) {
      out.push({
        kind: "theory",
        label: "Detailed Theory",
        hint: "Course-style deep notes",
        origin: "Yash",
        content: combined,
      });
    }
  }

  // Diagrams
  if (d.saaFolder) {
    const diag = SAA(d.saaFolder, "DIAGRAMS.md");
    if (diag) {
      out.push({
        kind: "diagrams",
        label: "Diagrams",
        hint: "Architecture diagrams",
        origin: "SAA-C03",
        content: diag,
      });
    }
    const prac = SAA(d.saaFolder, "PRACTICE-QUESTIONS.md");
    if (prac) {
      out.push({
        kind: "practice",
        label: "Practice",
        hint: "Exam-style questions",
        origin: "SAA-C03",
        content: prac,
      });
    }
  }

  return out;
}

export const STUDY_MODULES: StudyModule[] = DEFS.map((d) => ({
  id: d.id,
  number: d.number,
  title: d.title,
  emoji: d.emoji,
  blurb: d.blurb,
  weight: d.weight,
  keyServices: d.keyServices,
  sources: buildSources(d),
})).filter((m) => m.sources.length > 0);

/** Lightweight TOC: pull h2/h3 from markdown. */
export function extractToc(
  md: string,
): { level: 2 | 3; text: string; id: string }[] {
  const out: { level: 2 | 3; text: string; id: string }[] = [];
  const lines = md.split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const level = (m[1].length === 2 ? 2 : 3) as 2 | 3;
    const text = m[2].replace(/[`*_]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    if (text) out.push({ level, text, id });
  }
  return out;
}
