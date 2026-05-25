import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic07: Topic = {
  id: "07-security",
  number: "07",
  title: "Security, Identity & Compliance",
  weight: "Critical",
  blurb:
    "IAM, policies, KMS, Secrets Manager, Cognito, Directory Service, threat detection, CloudTrail, WAF/Shield.",
  sections: [
    {
      id: "iam-core",
      title: "IAM Core Concepts",
      questions: [
        match("07-i-m1", "Match each IAM entity.", [
          { left: "User", right: "Long-term identity with credentials" },
          { left: "Group", right: "Collection of users sharing policies" },
          { left: "Role", right: "Temporary assumable identity, no creds" },
          { left: "Policy", right: "JSON permissions document" },
          { left: "Identity Provider", right: "SAML 2.0 / OIDC federation" },
          {
            left: "AWS Organizations SCP",
            right: "Account-level permission boundary",
          },
        ]),
        mcq(
          "07-i-1",
          "EC2 needs S3 access — best practice:",
          [
            "Hard-coded keys",
            "IAM user keys in metadata",
            "IAM role attached to instance",
            "Root access",
          ],
          2,
          "Always use IAM roles for AWS resources.",
        ),
        tf(
          "07-i-2",
          "IAM is a global service.",
          true,
          "IAM users/policies are global.",
        ),
      ],
    },
    {
      id: "policy-types",
      title: "Policy Types",
      questions: [
        match("07-p-m1", "Match each policy type.", [
          { left: "Identity-based", right: "Attached to users/groups/roles" },
          {
            left: "Resource-based",
            right: "Attached to resource (S3 bucket, KMS, SQS, Lambda)",
          },
          {
            left: "Permission boundary",
            right: "Max perms an identity can have",
          },
          { left: "SCP", right: "Org-level cap on accounts (allow/deny)" },
          { left: "Session policy", right: "Inline perms when assuming role" },
          { left: "ACL", right: "Legacy resource grants (S3/VPC)" },
        ]),
        mcq(
          "07-p-1",
          "Effective permissions when SCP denies but identity allows:",
          ["Allowed", "Denied", "Depends on session", "Allowed for read only"],
          1,
          "Explicit deny anywhere wins; SCP caps perms.",
        ),
      ],
    },
    {
      id: "kms",
      title: "KMS",
      questions: [
        match("07-km-m1", "Match each KMS concept.", [
          { left: "AWS-managed key", right: "aws/service, no key policy edit" },
          {
            left: "Customer-managed key (CMK)",
            right: "Your key policy, rotation, audit",
          },
          { left: "AWS-owned key", right: "Hidden from you" },
          { left: "Automatic rotation", right: "365 days (CMK)" },
          { left: "Key policy", right: "Resource-based; primary control" },
          {
            left: "Envelope encryption",
            right: "Data key encrypts data; KMS encrypts data key",
          },
          { left: "CloudHSM", right: "Single-tenant FIPS 140-2 Level 3 HSM" },
        ]),
        mcq(
          "07-km-1",
          "Compliance requires you to own & rotate keys with audit:",
          ["AWS-owned key", "CMK", "AWS-managed key", "No encryption"],
          1,
          "Customer-managed CMK gives full control & audit.",
        ),
        tf(
          "07-km-2",
          "KMS keys never leave the KMS service.",
          true,
          "KMS handles encrypt/decrypt server-side; key material stays in HSMs.",
        ),
      ],
    },
    {
      id: "secrets",
      title: "Secrets Manager vs Parameter Store",
      questions: [
        match("07-se-m1", "Match each property.", [
          {
            left: "Cost",
            right: "Parameter Store free (std); Secrets Manager paid",
          },
          {
            left: "Auto rotation",
            right: "Secrets Manager native; PS requires Lambda",
          },
          {
            left: "Cross-account / replication",
            right: "Secrets Manager native",
          },
          { left: "Use for DB passwords", right: "Secrets Manager" },
          { left: "Config / non-secret params", right: "Parameter Store" },
        ]),
        mcq(
          "07-se-1",
          "Rotate RDS password automatically every 30 days:",
          ["SSM Parameter Store", "Secrets Manager", "IAM", "KMS"],
          1,
          "Secrets Manager has native RDS rotation.",
        ),
      ],
    },
    {
      id: "cognito",
      title: "Amazon Cognito",
      questions: [
        match("07-co-m1", "Match each Cognito feature.", [
          { left: "User Pools", right: "Sign-up/sign-in; JWT tokens" },
          {
            left: "Identity Pools",
            right: "Exchange tokens for temp AWS creds",
          },
          { left: "Federation", right: "Google, Facebook, SAML, OIDC" },
          { left: "MFA", right: "SMS/TOTP supported" },
          { left: "Hosted UI", right: "Pre-built sign-in pages" },
        ]),
        mcq(
          "07-co-1",
          "Mobile app users need temporary AWS credentials to upload to S3:",
          [
            "Cognito User Pool only",
            "Cognito Identity Pool",
            "IAM users",
            "STS direct",
          ],
          1,
          "Identity Pools exchange identity tokens for AWS creds.",
        ),
      ],
    },
    {
      id: "directory",
      title: "Directory Service",
      questions: [
        match("07-ds-m1", "Match each option.", [
          { left: "AWS Managed Microsoft AD", right: "Full AD in AWS" },
          { left: "AD Connector", right: "Proxy to on-prem AD" },
          { left: "Simple AD", right: "Small Samba-based, basic AD" },
        ]),
        mcq(
          "07-ds-1",
          "Join EC2 to existing on-prem AD without replicating:",
          ["Managed AD", "AD Connector", "Simple AD", "Cognito"],
          1,
          "AD Connector proxies auth to on-prem AD.",
        ),
      ],
    },
    {
      id: "threat",
      title: "Threat Detection",
      questions: [
        match("07-th-m1", "Match each service.", [
          {
            left: "GuardDuty",
            right: "ML threat detection from logs (CloudTrail/VPC/DNS)",
          },
          { left: "Inspector", right: "Vulnerability scan EC2 / Lambda / ECR" },
          { left: "Macie", right: "PII / sensitive data discovery in S3" },
          { left: "Detective", right: "Investigation graph from logs" },
          {
            left: "Security Hub",
            right: "Aggregate findings & compliance score",
          },
          { left: "Audit Manager", right: "Continuous compliance evidence" },
          { left: "Trusted Advisor", right: "Cost/sec/perf/limit checks" },
        ]),
        mcq(
          "07-th-1",
          "Find unencrypted credit-card data in S3 buckets:",
          ["GuardDuty", "Macie", "Inspector", "Config"],
          1,
          "Macie detects PII/PHI/credit cards in S3.",
        ),
        mcq(
          "07-th-2",
          "Detect EC2 instance behaving like a crypto miner via VPC flow logs:",
          ["Inspector", "GuardDuty", "Macie", "WAF"],
          1,
          "GuardDuty analyzes flow logs/DNS/CT for anomalies.",
        ),
      ],
    },
    {
      id: "cloudtrail",
      title: "CloudTrail",
      questions: [
        match("07-ct-m1", "Match each CloudTrail fact.", [
          { left: "Records", right: "API activity / who-did-what" },
          { left: "Default retention", right: "90 days in Event History" },
          { left: "Trails to S3", right: "Long-term storage" },
          { left: "Insights", right: "Detect unusual API activity" },
          { left: "Multi-region trail", right: "Capture all regions" },
          { left: "Org trail", right: "All accounts in org" },
          { left: "Data events", right: "S3 object / Lambda invokes (opt-in)" },
        ]),
        tf(
          "07-ct-1",
          "CloudTrail Insights detects anomalous management API activity.",
          true,
          "ML-based anomaly detection on call rates.",
        ),
        tf(
          "07-ct-2",
          "CloudTrail data events for S3 objects are enabled by default.",
          false,
          "Management events default; data events are paid opt-in.",
        ),
      ],
    },
    {
      id: "waf-shield",
      title: "WAF, Shield & Firewall Manager",
      questions: [
        match("07-wa-m1", "Match each service.", [
          {
            left: "AWS WAF",
            right: "Layer-7 web filtering (CloudFront/ALB/API GW)",
          },
          { left: "Shield Standard", right: "Free DDoS protection, default" },
          { left: "Shield Advanced", right: "Paid DDoS, cost protection, DRT" },
          {
            left: "Firewall Manager",
            right: "Central WAF/Shield/SG policies org-wide",
          },
          { left: "AWS Network Firewall", right: "Managed VPC L3/L7 firewall" },
        ]),
    