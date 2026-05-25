import type { Topic } from "../types";
import { mcq, tf, match, flash } from "./_helpers";

export const topic01: Topic = {
  id: "01-overview",
  number: "01",
  title: "AWS Overview",
  weight: "Foundation",
  blurb:
    "Global infrastructure, shared responsibility, Well-Architected pillars, pricing fundamentals, support plans.",
  sections: [
    {
      id: "global-infra",
      title: "Global Infrastructure",
      questions: [
        match(
          "01-gi-m1",
          "Match each infrastructure concept to its definition.",
          [
            {
              left: "Region",
              right: "Geographic area with multiple isolated data centers",
            },
            {
              left: "Availability Zone",
              right: "1+ data centers with isolated power/network",
            },
            {
              left: "Edge Location",
              right: "CloudFront / Global Accelerator PoP (400+)",
            },
            {
              left: "Local Zone",
              right: "Compute near major metros for sub-ms latency",
            },
            {
              left: "Wavelength Zone",
              right: "Compute embedded in 5G telco networks",
            },
            { left: "Outposts", right: "AWS hardware in your own data center" },
          ],
        ),
        mcq(
          "01-gi-1",
          "Which is the recommended minimum for high availability inside a region?",
          [
            "One Availability Zone",
            "Two or more Availability Zones",
            "One Edge Location",
            "A Local Zone",
          ],
          1,
          "AZs are isolated failure domains. HA inside a region = multi-AZ.",
        ),
        mcq(
          "01-gi-2",
          "You need sub-millisecond latency to mobile users on a 5G carrier network. Which AWS infra option?",
          ["Region", "Edge Location", "Wavelength Zone", "Outposts"],
          2,
          "Wavelength Zones embed compute inside 5G telco networks for ultra-low mobile-edge latency.",
        ),
        mcq(
          "01-gi-3",
          "You need AWS services running on hardware physically located inside your on-premises data center. Which option?",
          ["Local Zone", "Outposts", "Wavelength Zone", "Edge Location"],
          1,
          "Outposts = AWS-managed hardware inside your data center.",
        ),
        tf(
          "01-gi-4",
          "Data automatically replicates to other regions unless you opt out.",
          false,
          "Data stays in the region you put it in unless YOU configure replication.",
        ),
        tf(
          "01-gi-5",
          "Multi-AZ is the same as Multi-Region.",
          false,
          "Multi-AZ is HA inside ONE region. Multi-Region is cross-region.",
        ),
        tf(
          "01-gi-6",
          "Edge Locations are used by CloudFront and Global Accelerator.",
          true,
          "They are PoPs for caching and low-latency entry to the AWS network.",
        ),
      ],
    },
    {
      id: "global-vs-regional",
      title: "Global vs Regional Services",
      questions: [
        match("01-gr-m1", "Match each service to its scope.", [
          { left: "IAM", right: "Global" },
          { left: "Route 53", right: "Global" },
          { left: "CloudFront", right: "Global" },
          { left: "EC2", right: "Regional" },
          { left: "VPC", right: "Regional" },
          { left: "EBS volume", right: "AZ-specific" },
          { left: "Subnet", right: "AZ-specific" },
        ]),
        mcq(
          "01-gr-1",
          "Which service is GLOBAL (not region-scoped)?",
          ["EC2", "VPC", "IAM", "RDS"],
          2,
          "IAM, Route 53, CloudFront, WAF (CloudFront), Shield, Organizations, Trusted Advisor are global.",
        ),
        mcq(
          "01-gr-2",
          "An EBS volume is scoped to:",
          ["Global", "Region (multi-AZ)", "A single AZ", "An edge location"],
          2,
          "EBS volume lives in ONE AZ; snapshot + restore to move it.",
        ),
        tf(
          "01-gr-3",
          "An S3 bucket name must be globally unique even though the bucket data is region-scoped.",
          true,
          "Bucket namespace is global; data is regional.",
        ),
        tf(
          "01-gr-4",
          "A subnet can span multiple Availability Zones.",
          false,
          "A subnet is bound to exactly ONE AZ.",
        ),
      ],
    },
    {
      id: "shared-responsibility",
      title: "Shared Responsibility Model",
      questions: [
        match("01-sr-m1", "Match the task to who is responsible.", [
          { left: "Patch the hypervisor", right: "AWS" },
          { left: "Manage data center power & cooling", right: "AWS" },
          { left: "Patch the EC2 guest OS", right: "Customer" },
          { left: "Configure security groups", right: "Customer" },
          { left: "Manage IAM users and access keys", right: "Customer" },
          { left: "Manage RDS host OS patching", right: "AWS" },
        ]),
        mcq(
          "01-sr-1",
          "Who patches the operating system on an EC2 instance?",
          ["AWS", "Customer", "Neither", "Both share equally"],
          1,
          "EC2 = customer patches OS. Managed services like RDS/Lambda = AWS patches.",
        ),
        mcq(
          "01-sr-2",
          "Who is responsible for choosing data classification and encryption settings?",
          ["AWS", "Customer", "AWS Trusted Advisor", "Amazon Inspector"],
          1,
          "Customer is responsible for what data they put in and how they protect it.",
        ),
        tf(
          "01-sr-3",
          "AWS is responsible for patching the database engine on Amazon RDS.",
          true,
          "RDS is a managed service — AWS handles host OS + DB engine patching.",
        ),
        tf(
          "01-sr-4",
          "Customers configure security groups; AWS does not.",
          true,
          "SGs/NACLs/app code are customer responsibility.",
        ),
      ],
    },
    {
      id: "well-architected",
      title: "Well-Architected Framework (6 Pillars)",
      questions: [
        match("01-wa-m1", "Match each Well-Architected pillar to its focus.", [
          {
            left: "Operational Excellence",
            right:
              "Run & monitor systems, deliver value (automation, runbooks)",
          },
          {
            left: "Security",
            right: "Protect data & systems (least privilege, encryption)",
          },
          {
            left: "Reliability",
            right: "Recover from failure, scale (HA, DR, fault tolerant)",
          },
          {
            left: "Performance Efficiency",
            right: "Right resources & evolve (right-size, serverless)",
          },
          {
            left: "Cost Optimization",
            right: "Avoid unnecessary cost (RI, Spot, tiering)",
          },
          {
            left: "Sustainability",
            right:
              "Minimize environmental impact (efficient regions, managed services)",
          },
        ]),
        mcq(
          "01-wa-1",
          "Which pillar covers disaster recovery and high availability?",
          [
            "Operational Excellence",
            "Security",
            "Reliability",
            "Performance Efficiency",
          ],
          2,
          "Reliability = recover from failure and scale (HA, DR, fault tolerance).",
        ),
        mcq(
          "01-wa-2",
          "A question about least privilege and audit logging belongs to which pillar?",
          ["Reliability", "Security", "Cost Optimization", "Sustainability"],
          1,
          "Security pillar: identity, encryption, audit.",
        ),
        mcq(
          "01-wa-3",
          "How many pillars are in the Well-Architected Framework?",
          ["4", "5", "6", "7"],
          2,
          "Six: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.",
        ),
        tf(
          "01-wa-4",
          '"Sustainability" is one of the six Well-Architected pillars.',
          true,
          "Added in 2021 — minimize environmental impact.",
        ),
      ],
    },
    {
      id: "pricing",
      title: "Pricing Fundamentals",
      questions: [
        match("01-pr-m1", "Match: do you pay for it or not?", [
          { left: "Compute time", right: "Pay" },
          { left: "Storage GB-month", right: "Pay" },
          { left: "Outbound internet data transfer", right: "Pay" },
          { left: "Inbound data transfer to AWS", right: "Free" },
          {
            left: "Data transfer within same AZ (most services)",
            right: "Free",
          },
        ]),
        mcq(
          "01-pr-1",
          "Which is the MOST expensive data-transfer category?",
          [
            "Inbound to AWS",
            "Same-AZ traffic",
            "Cross-AZ traffic",
            "Outbound to the public internet",
          ],
          3,
          "Internet egress is the most expensive. Inbound is free.",
        ),
        tf(
          "01-pr-2",
          "Inbound data transfer to AWS is FREE.",
          true,
          "AWS does not charge for inbound traffic.",
        ),
        tf(
          "01-pr-3",
          "Cross-AZ traffic is free.",
          false,
          "Cross-AZ traffic costs money for most services.",
        ),
        tf(
          "01-pr-4",
          "Cross-region traffic costs more than cross-AZ traffic.",
          true,
          "Order of cost: same-AZ < cross-AZ < cross-region < internet egress.",
        ),
      ],
    },
    {
      id: "support-plans",
      title: "Support Plans",
      questions: [
        match(
          "01-sp-m1",
          "Match each support plan to its critical-case response target.",
          [
            { left: "Basic", right: "No response (billing only)" },
            { left: "Developer", right: "<12h business hours" },
            { left: "Business", right: "<1h (production down)" },
            {
              left: "Enterprise On-Ramp",
              right: "<30 min (business-critical)",
            },
            { left: "Enterprise", right: "<15 min (business-critical)" },
          ],
        ),
        mcq(
          "01-sp-1",
          "You need ALL Trusted Advisor checks (not just the core 7). Minimum plan?",
          ["Developer", "Business", "Enterprise On-Ramp", "Basic"],
          1,
          "Full Trusted Advisor checks require Business or Enterprise.",
        ),
        mcq(
          "01-sp-2",
          "Your production workload is down and you need a 15-minute response. Which plan?",
          ["Developer", "Business", "Enterprise On-Ramp", "Enterprise"],
          3,
          "Enterprise = <15 min for business-critical issues, dedicated TAM.",
        ),
        tf(
          "01-sp-3",
          "The free Basic support plan includes 24/7 technical support.",
          false,
          "Basic = account/billing support only, no technical case support.",
        ),
      ],
    },
  ],
};
