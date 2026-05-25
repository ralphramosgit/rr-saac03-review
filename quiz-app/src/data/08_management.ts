import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic08: Topic = {
  id: "08-management",
  number: "08",
  title: "Management & Governance",
  weight: "Important",
  blurb:
    "CloudWatch, Config, Systems Manager, CloudFormation, Trusted Advisor, Health, Control Tower.",
  sections: [
    {
      id: "cw-components",
      title: "CloudWatch Components",
      questions: [
        match("08-cw-m1", "Match each CloudWatch component.", [
          { left: "Metrics", right: "Time-series data points" },
          { left: "Alarms", right: "Threshold-based actions" },
          { left: "Logs", right: "Log aggregation + queries (Logs Insights)" },
          { left: "Events / EventBridge", right: "Event bus + rules" },
          { left: "Dashboards", right: "Custom widget displays" },
          {
            left: "Synthetics (Canaries)",
            right: "Scripted endpoint monitoring",
          },
          { left: "Contributor Insights", right: "Top-N analysis from logs" },
          { left: "Anomaly Detection", right: "ML-based metric baselines" },
        ]),
        mcq(
          "08-cw-1",
          "Continuously test login endpoint from outside:",
          ["CloudWatch Alarm", "Synthetics Canary", "Logs Insights", "Config"],
          1,
          "Synthetics canaries simulate user traffic.",
        ),
      ],
    },
    {
      id: "cw-granularity",
      title: "CloudWatch Metric Granularity",
      questions: [
        match("08-mg-m1", "Match each metric type.", [
          { left: "Standard resolution", right: "1-minute granularity" },
          {
            left: "High resolution",
            right: "1-second granularity (PutMetricData)",
          },
          { left: "Detailed monitoring (EC2)", right: "1-minute (paid)" },
          { left: "Basic monitoring (EC2)", right: "5-minute (free)" },
        ]),
        mcq(
          "08-mg-1",
          "Default EC2 monitoring interval:",
          ["1 sec", "1 min", "5 min", "15 min"],
          2,
          "Basic = 5 min free. Detailed = 1 min paid.",
        ),
      ],
    },
    {
      id: "cw-ec2-metrics",
      title: "Default vs Custom EC2 Metrics",
      questions: [
        match("08-em-m1", "Match each metric to default or custom.", [
          { left: "CPUUtilization", right: "Default" },
          { left: "NetworkIn/Out", right: "Default" },
          { left: "DiskReadBytes", right: "Default (EBS)" },
          { left: "StatusCheckFailed", right: "Default" },
          { left: "MemoryUtilization", right: "Custom (CW Agent)" },
          { left: "DiskSpaceUtilization", right: "Custom (CW Agent)" },
        ]),
      ],
    },
    {
      id: "config",
      title: "AWS Config",
      questions: [
        match("08-co-m1", "Match each Config feature.", [
          { left: "Purpose", right: "Resource config inventory + compliance" },
          { left: "Rules", right: "Managed or custom (Lambda)" },
          {
            left: "Conformance Packs",
            right: "Collections of rules + remediations",
          },
          { left: "Aggregator", right: "Multi-account / region view" },
          { left: "Remediation", right: "SSM Automation actions" },
        ]),
        mcq(
          "08-co-1",
          "Detect any S3 bucket that becomes publicly accessible:",
          ["GuardDuty", "AWS Config rule", "CloudTrail", "Inspector"],
          1,
          "Config rule s3-bucket-public-read-prohibited.",
        ),
      ],
    },
    {
      id: "ssm",
      title: "Systems Manager Capabilities",
      questions: [
        match("08-ss-m1", "Match each SSM capability.", [
          { left: "Parameter Store", right: "Config & secret storage" },
          { left: "Session Manager", right: "Shell into EC2 without SSH/keys" },
          { left: "Run Command", right: "Run scripts across many instances" },
          { left: "Patch Manager", right: "OS patching automation" },
          { left: "State Manager", right: "Desired-state config" },
          { left: "Automation", right: "Runbook orchestration" },
          { left: "Inventory", right: "Software inventory across fleet" },
          { left: "OpsCenter", right: "Operational issues mgmt" },
        ]),
        mcq(
          "08-ss-1",
          "SSH into EC2 without opening port 22 or storing keys:",
          ["EC2 Instance Connect", "Session Manager", "Bastion host", "Cloud9"],
          1,
          "Session Manager uses SSM agent + IAM auth.",
        ),
      ],
    },
    {
      id: "cfn",
      title: "CloudFormation",
      questions: [
        match("08-cf-m1", "Match each CFN concept.", [
          { left: "Template", right: "YAML/JSON describing infra" },
          { left: "Stack", right: "Deployed instance of template" },
          { left: "Change Set", right: "Preview before update" },
          { left: "Drift Detection", right: "Identify out-of-band changes" },
          { left: "StackSets", right: "Deploy across accounts/regions" },
          { left: "Nested Stacks", right: "Reusable child stacks" },
          { left: "Parameters", right: "Template input variables" },
          {
            left: "Mappings",
            right: "Key-value lookup (e.g., AMI per region)",
          },
          { left: "Outputs", right: "Export values for cross-stack" },
        ]),
        mcq(
          "08-cf-1",
          "Deploy a stack to 20 accounts and 4 regions:",
          ["Nested Stacks", "StackSets", "Change Sets", "SAM"],
          1,
          "StackSets handle multi-account multi-region.",
        ),
      ],
    },
    {
      id: "ta",
      title: "Trusted Advisor",
      questions: [
        match("08-ta-m1", "Match each TA check category.", [
          { left: "Cost Optimization", right: "Idle resources, low-util RIs" },
          { left: "Performance", right: "Service limit headroom" },
          { left: "Security", right: "Open ports, MFA, IAM use" },
          { left: "Fault Tolerance", right: "Multi-AZ, backups" },
          { left: "Service Limits", right: "Quota usage" },
        ]),
        mcq(
          "08-ta-1",
          "Full Trusted Advisor checks require which support plan minimum?",
          ["Developer", "Business", "Enterprise", "Basic"],
          1,
          "Business and Enterprise unlock all checks.",
        ),
      ],
    },
    {
      id: "health",
      title: "AWS Health",
      questions: [
        match("08-hl-m1", "Match each Health offering.", [
          {
            left: "Service Health Dashboard",
            right: "Public AWS service status",
          },
          {
            left: "Personal Health Dashboard",
            right: "Events affecting YOUR resources",
          },
          { left: "Health API", right: "Programmatic event access" },
        ]),
      ],
    },
    {
      id: "control-tower",
      title: "Control Tower & Organizations",
      questions: [
        match("08-ct-m1", "Match each capability.", [
          {
            left: "AWS Organizations",
            right: "Hierarchy + SCPs + consolidated billing",
          },
          {
            left: "Control Tower",
            right: "Multi-account landing zone w/ guardrails",
          },
          {
            left: "Service Catalog",
            right: "Curated portfolio of approved resources",
