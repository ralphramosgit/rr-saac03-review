import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic10: Topic = {
  id: "10-billing",
  number: "10",
  title: "Billing & Cost Management",
  weight: "Important",
  blurb: "Cost tools, Savings Plans, RIs, Spot, payment options.",
  sections: [
    {
      id: "cost-tools",
      title: "Cost Management Tools",
      questions: [
        match("10-ct-m1", "Match each tool.", [
          { left: "Cost Explorer", right: "Visualize spend, forecast" },
          { left: "AWS Budgets", right: "Alert on spend / usage thresholds" },
          {
            left: "Cost & Usage Report (CUR)",
            right: "Detailed CSV/Parquet to S3",
          },
          {
            left: "Billing Conductor",
            right: "Custom internal billing for orgs",
          },
          {
            left: "Cost Anomaly Detection",
            right: "ML-based unusual spend alerts",
          },
          { left: "Compute Optimizer", right: "Right-sizing recommendations" },
          { left: "Pricing Calculator", right: "Estimate cost before launch" },
          {
            left: "TCO Calculator",
            right: "On-prem vs AWS comparison (legacy)",
          },
        ]),
        mcq(
          "10-ct-1",
          "Detect a 3x spike in EC2 spend due to misconfig:",
          [
            "Cost Explorer",
            "Cost Anomaly Detection",
            "Budgets",
            "Trusted Advisor",
          ],
          1,
          "Anomaly Detection uses ML on spend trends.",
        ),
      ],
    },
    {
      id: "savings-plans",
      title: "Savings Plans",
      questions: [
        match("10-sp-m1", "Match each Savings Plan type.", [
          {
            left: "Compute SP",
            right: "Up to 66% off; EC2 / Lambda / Fargate, any region/family",
          },
          {
            left: "EC2 Instance SP",
            right: "Up to 72% off; locked to family + region",
          },
          { left: "SageMaker SP", right: "Discount on SageMaker compute" },
        ]),
        mcq(
          "10-sp-1",
          "Flexibility over discount — best Savings Plan:",
          ["Compute SP", "EC2 Instance SP", "Standard RI", "Spot"],
          0,
          "Compute SP is most flexible.",
        ),
      ],
    },
    {
      id: "ri",
      title: "Reserved Instances",
      questions: [
        match("10-ri-m1", "Match each RI property.", [
          { left: "Standard RI", right: "Up to 72%; cannot change family" },
          {
            left: "Convertible RI",
            right: "Up to 66%; can change family/OS/tenancy",
          },
          { left: "Scheduled RI", right: "Specific time windows (deprecated)" },
          { left: "Term", right: "1 or 3 years" },
        ]),
      ],
    },
    {
      id: "payment",
      title: "Payment Options",
      questions: [
        match("10-pa-m1", "Match each payment option to its discount.", [
          { left: "All Upfront", right: "Largest discount" },
          { left: "Partial Upfront", right: "Moderate discount" },
          { left: "No Upfront", right: "Smallest discount" },
        ]),
      ],
    },
    {
      id: "spot",
      title: "Spot Instances",
      questions: [
        match("10-sp2-m1", "Match each Spot concept.", [
          { left: "Discount", right: "Up to 90% off On-Demand" },
          { left: "Interruption notice", right: "2 minutes" },
          { left: "Spot Fleet", right: "Mix of Spot/OD across types/AZs" },
          { left: "Spot block", right: "1–6 hour duration (deprecated)" },
          { left: "Best for", right: "Stateless / fault-tolerant batch / CI" },
        ]),
      ],
    },
    {
      id: "cost-controls",
      title: "Cost Controls & Best Practices",
      questions: [
        match("10-cb-m1", "Match each best practice.", [
          { left: "Tag everything", right: "Cost allocation reporting" },
          { left: "Use S3 lifecycle", right: "Transition to cheaper tiers" },
          {
            left: "Stop dev instances after hours",
            right: "Schedule with Instance Scheduler",
          },
          { left: "Right-size", right: "Use Compute Optimizer" },
          { left: "Use Spot for batch", right: "Save up to 90%" },
          { left: "Use VPC endpoints", right: "Avoid NAT egress costs" },
        ]),
        tf(
          "10-cb-1",
          "Cost allocation tags must be activated before they show in reports.",
          true,
          "You must activate them in the Billing console.",
        ),
      ],
    },
  ],
};
