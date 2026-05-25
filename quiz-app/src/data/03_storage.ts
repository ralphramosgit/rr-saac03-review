import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic03: Topic = {
  id: "03-storage",
  number: "03",
  title: "Storage Services",
  weight: "Critical",
  blurb:
    "S3 (classes, security, encryption, features), EBS, EFS, FSx, Storage Gateway, Snow, Backup.",
  sections: [
    {
      id: "s3-limits",
      title: "S3 Limits & Basics",
      questions: [
        match("03-sl-m1", "Match each S3 limit/fact.", [
          { left: "Max object size", right: "5 TB" },
          { left: "Single PUT max", right: "5 GB (use multipart for >100 MB)" },
          { left: "Bucket name scope", right: "Globally unique" },
          { left: "Durability", right: "11 nines (99.999999999%)" },
          { left: "Availability (Standard)", right: "99.99%" },
          { left: "Default buckets per account", right: "100 (soft)" },
        ]),
        mcq(
          "03-sl-1",
          "Largest single S3 object size:",
          ["100 MB", "5 GB", "5 TB", "160 GB"],
          2,
          "Max single object 5 TB; use multipart upload above 100 MB.",
        ),
        tf(
          "03-sl-2",
          "S3 bucket names are globally unique across all AWS accounts.",
          true,
          "Globally unique namespace.",
        ),
      ],
    },
    {
      id: "s3-classes",
      title: "S3 Storage Classes",
      questions: [
        match("03-sc-m1", "Match each storage class to its key trait.", [
          {
            left: "S3 Standard",
            right: "Frequent access, 99.99% avail, multi-AZ",
          },
          {
            left: "S3 Intelligent-Tiering",
            right: "Auto-moves between tiers, unknown patterns",
          },
          {
            left: "S3 Standard-IA",
            right: "Infrequent, multi-AZ, retrieval fee",
          },
          {
            left: "S3 One Zone-IA",
            right: "Infrequent, single AZ, 20% cheaper",
          },
          {
            left: "S3 Glacier Instant Retrieval",
            right: "Archive, ms retrieval",
          },
          {
            left: "S3 Glacier Flexible Retrieval",
            right: "Archive, minutes-hours retrieval",
          },
          {
            left: "S3 Glacier Deep Archive",
            right: "Cheapest, 12-hr retrieval, 180-day min",
          },
        ]),
        mcq(
          "03-sc-1",
          "Unknown / changing access patterns — best class?",
          [
            "Standard",
            "Intelligent-Tiering",
            "Glacier Deep Archive",
            "One Zone-IA",
          ],
          1,
          "Intelligent-Tiering moves objects across tiers automatically.",
        ),
        mcq(
          "03-sc-2",
          "Cheapest class for compliance archives with 12-hour retrieval OK:",
          [
            "Glacier Flexible",
            "Glacier Deep Archive",
            "Glacier Instant",
            "One Zone-IA",
          ],
          1,
          "Deep Archive — cheapest, ≥180 day min, 12 hr retrieval.",
        ),
        mcq(
          "03-sc-3",
          "Re-creatable thumbnails, OK to lose if AZ fails:",
          ["Standard", "One Zone-IA", "Glacier Instant", "Standard-IA"],
          1,
          "One Zone-IA — single AZ, 20% cheaper, for re-creatable data.",
        ),
        tf(
          "03-sc-4",
          "Glacier classes have minimum storage durations.",
          true,
          "IA = 30 days, Glacier IR = 90, Flex = 90, Deep = 180.",
        ),
      ],
    },
    {
      id: "s3-security",
      title: "S3 Security",
      questions: [
        match("03-ss-m1", "Match each S3 security feature.", [
          { left: "Bucket Policy", right: "JSON, bucket-level allow/deny" },
          { left: "IAM Policy", right: "Identity-side permissions" },
          { left: "ACL (legacy)", right: "Per-object/bucket grants" },
          {
            left: "Block Public Access",
            right: "Account/bucket-level guard rail",
          },
          { left: "Presigned URL", right: "Temporary signed access to object" },
          { left: "Access Points", right: "Named endpoints with own policy" },
          {
            left: "VPC Endpoint (Gateway)",
            right: "Private access without internet",
          },
          { left: "CORS", right: "Cross-origin browser access rules" },
        ]),
        mcq(
          "03-ss-1",
          "Easiest way to give a browser temporary upload/download access:",
          ["Bucket Policy", "IAM User", "Presigned URL", "ACL"],
          2,
          "Presigned URLs grant time-bound access without changing perms.",
        ),
        tf(
          "03-ss-2",
          "Block Public Access overrides bucket policies and ACLs that would expose the bucket.",
          true,
          "It is a guard rail that takes precedence.",
        ),
      ],
    },
    {
      id: "s3-encryption",
      title: "S3 Encryption Options",
      questions: [
        match("03-se-m1", "Match each encryption option.", [
          { left: "SSE-S3", right: "AWS-managed AES-256 (default since 2023)" },
          { left: "SSE-KMS", right: "KMS keys, audit + access policy via KMS" },
          { left: "SSE-C", right: "Customer-provided key per request" },
          { left: "Client-Side", right: "You encrypt before upload" },
          { left: "DSSE-KMS", right: "Double-layer KMS encryption (FedRAMP)" },
        ]),
        mcq(
          "03-se-1",
          "You need fine-grained audit logging of each decryption:",
          ["SSE-S3", "SSE-KMS", "SSE-C", "No encryption"],
          1,
          "SSE-KMS logs every Decrypt/Encrypt via CloudTrail.",
        ),
        tf(
          "03-se-2",
          "All new S3 objects are encrypted by default since Jan 2023.",
          true,
          "SSE-S3 is applied automatically; you can override with SSE-KMS.",
        ),
      ],
    },
    {
      id: "s3-features",
      title: "S3 Features",
      questions: [
        match("03-sf-m1", "Match each S3 feature.", [
          { left: "Versioning", right: "Keep multiple versions of an object" },
          { left: "Replication", right: "CRR cross-region or SRR same-region" },
          { left: "Lifecycle Rules", right: "Transition or expire objects" },
          { left: "Object Lock", right: "WORM compliance / governance" },
          { left: "MFA Delete", right: "Require MFA to permanently delete" },
          {
            left: "Event Notifications",
            right: "Trigger Lambda/SNS/SQS on changes",
          },
          {
            left: "Transfer Acceleration",
            right: "CloudFront edge upload speedup",
          },
          { left: "Multipart Upload", right: "Required for objects >5 GB" },
          { left: "Requester Pays", right: "Requester pays the data transfer" },
          { left: "Storage Lens", right: "Org-wide usage/cost analytics" },
        ]),
        mcq(
          "03-sf-1",
          "Required to enable Replication:",
          ["Object Lock", "Versioning", "Transfer Acceleration", "KMS"],
          1,
          "Versioning must be enabled on source AND destination.",
        ),
        mcq(
          "03-sf-2",
          "WORM compliance (e.g., financial regulation):",
          ["Versioning", "Object Lock", "MFA Delete", "Lifecycle"],
          1,
          "Object Lock provides WORM.",
        ),
        tf(
          "03-sf-3",
          "S3 Transfer Acceleration uses CloudFront edge locations.",
          true,
          "Uploads ride the AWS backbone via the nearest edge.",
        ),
      ],
    },
    {
      id: "ebs-types",
      title: "EBS Volume Types",
      questions: [
        match("03-eb-m1", "Match each EBS type to category.", [
          { left: "gp3", right: "SSD general (default modern)" },
          { left: "gp2", right: "SSD general (legacy)" },
          {
            left: "io2 Block Express",
            right: "SSD provisioned (highest perf)",
          },
          { left: "io1", right: "SSD provisioned" },
          { left: "st1", right: "HDD throughput" },
          { left: "sc1", right: "HDD cold (cheapest)" },
        ]),
        mcq(
          "03-eb-1",
          "Which EBS types support Multi-Attach?",
          ["gp2/gp3", "io1/io2", "st1/sc1", "All"],
          1,
          "Multi-Attach: io1/io2 only, same AZ, Nitro, max 16 instances.",
        ),
        tf(
          "03-eb-2",
          "EBS volumes can be attached across AZs.",
          false,
          "EBS is AZ-local. Snapshot to move.",
        ),
      ],
    },
    {
      id: "ebs-vs-store",
      title: "EBS vs Instance Store",
      questions: [
        match("03-ev-m1", "Match each property.", [
          { left: "Persistent", right: "EBS" },
          { left: "Ephemeral", right: "Instance Store" },
          { left: "Network-attached", right: "EBS" },
          { left: "Physically attached", right: "Instance Store" },
          { left: "Snapshot to S3", right: "EBS" },
        ]),
      ],
    },
    {
      id: "efs",
      title: "Amazon EFS",
      questions: [
        match("03-ef-m1", "Match each EFS fact.", [
          { left: "Protocol", right: "NFS v4.x" },
          { left: "Scope", right: "Regional (multi-AZ)" },
          { left: "Performance modes", right: "General Purpose / Max I/O" },
          {
            left: "Throughput modes",
            right: "Bursting / Provisioned / Elastic",
          },
          {
            left: "Storage classes",
            right: "Standard / IA / One Zone / One Zone-IA",
          },
          { left: "OS support", right: "Linux only" },
          { left: "Encryption", right: "KMS at rest, TLS in transit" },
        ]),
        mcq(
          "03-ef-1",
          "You need a shared filesystem across many Linux EC2s in multiple AZs:",
          ["EBS Multi-Attach", "EFS", "FSx for Windows", "Instance Store"],
          1,
          "EFS = multi-AZ NFS shared filesystem for Linux.",
        ),
        tf(
          "03-ef-2",
          "EFS supports Windows clients.",
          false,
          "EFS is Linux only. Use FSx for Windows.",
        ),
      ],
    },
    {
      id: "fsx",
      title: "FSx Family",
      questions: [
        match("03-fx-m1", "Match each FSx variant to its purpose.", [
          {
            left: "FSx for Windows File Server",
            right: "SMB, AD-integrated Windows shares",
          },
          { left: "FSx for Lustre", right: "HPC / ML, integrates with S3" },
          {
            left: "FSx for NetApp ONTAP",
            right: "Multi-protocol NFS/SMB/iSCSI, NetApp features",
          },
          { left: "FSx for OpenZFS", right: "High-performance ZFS, NFS" },
        ]),
        mcq(
          "03-fx-1",
          "HPC ML training reading data from S3:",
          ["FSx Windows", "FSx Lustre", "EFS", "EBS gp3"],
          1,
          "Lustre integrates natively with S3 for HPC/ML.",
        ),
        mcq(
          "03-fx-2",
          "You need SMB file shares joined to Active Directory:",
          ["EFS", "FSx for Windows", "FSx Lustre", "S3"],
          1,
          "FSx for Windows = SMB + AD.",
        ),
      ],
    },
    {
      id: "storage-gateway",
      title: "AWS Storage Gateway",
      questions: [
        match("03-sg-m1", "Match each Storage Gateway type.", [
          { left: "File Gateway", right: "NFS/SMB to S3 backend" },
          {
            left: "Volume Gateway (Cached)",
            right: "iSCSI volumes, hot data on-prem, full in S3",
          },
          {
            left: "Volume Gateway (Stored)",
            right: "Full data on-prem, async backup to S3",
          },
          { left: "Tape Gateway", right: "iSCSI VTL to S3/Glacier" },
        ]),
        mcq(
          "03-sg-1",
          "Replace physical tape backups with cloud storage:",
          ["File Gateway", "Tape Gateway", "Snowball", "DataSync"],
          1,
          "Tape Gateway VTL writes to S3/Glacier.",
        ),
      ],
    },
    {
      id: "snow",
      title: "Snow Family",
      questions: [
        match("03-sn-m1", "Match each Snow device.", [
          {
            left: "Snowcone",
            right: "8 TB usable, small/portable, edge compute",
          },
          {
            left: "Snowball Edge Storage Optimized",
            right: "~80 TB usable, bulk transfer",
          },
          {
            left: "Snowball Edge Compute Optimized",
            right: "~28 TB + heavy compute (sBE-C)",
          },
          {
            left: "Snowmobile",
            right: "Up to 100 PB shipping container (DEPRECATED)",
          },
        ]),
        mcq(
          "03-sn-1",
          "Transfer 50 TB from on-prem to AWS with no/poor internet:",
          ["DataSync", "Snowball Edge", "Storage Gateway", "Direct Connect"],
          1,
          "Snowball Edge is ideal for offline bulk transfer.",
        ),
        tf(
          "03-sn-2",
          "Snowball Edge data is encrypted using KMS keys you control.",
          true,
          "AES-256 with KMS keys for data on device.",
        ),
      ],
    },
    {
      id: "backup",
      title: "AWS Backup",
      questions: [
        match("03-bk-m1", "Match each AWS Backup capability.", [
          { left: "Backup Plans", right: "Schedule + retention rules" },
          {
            left: "Backup Vaults",
            right: "Encrypted storage with access policies",
          },
          { left: "Cross-region copy", right: "DR support" },
          {
            left: "Cross-account copy",
            right: "Isolation from compromised accounts",
          },
          {
            left: "Supported services",
            right: "EBS, RDS, DDB, EFS, FSx, S3, Storage GW, etc.",
          },
        ]),
        mcq(
          "03-bk-1",
          "Centralized backup across many AWS services with compliance reporting:",
          ["EBS snapshots", "AWS Backup", "DLM", "S3 versioning"],
          1,
          "AWS Backup = central, cross-service, compliance reports.",
        ),
      ],
    },
    {
      id: "storage-decision",
      title: "Storage Decision Matrix",
      questions: [
        match("03-de-m1", "Match each scenario to best storage choice.", [
          { left: "Object storage / static website", right: "S3" },
          { left: "Block storage for one EC2", right: "EBS" },
          { left: "Shared NFS file system (Linux)", right: "EFS" },
          { left: "SMB / AD file share", right: "FSx for Windows" },
          { left: "HPC scratch with S3", right: "FSx Lustre" },
          { left: "On-prem NFS to S3", right: "File Gateway" },
          {
            left: "One-time bulk transfer no internet",
            right: "Snowball Edge",
          },
          { left: "Tape backup replacement", right: "Tape Gateway" },
          { left: "Archive at lowest cost", right: "S3 Glacier Deep Archive" },
        ]),
      ],
    },
  ],
};
