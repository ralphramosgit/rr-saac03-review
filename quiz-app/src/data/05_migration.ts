import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic05: Topic = {
  id: "05-migration",
  number: "05",
  title: "Migration & Transfer",
  weight: "Important",
  blurb: "7 Rs, MGN/SMS, DMS/SCT, DataSync, Snow family, Transfer Family.",
  sections: [
    {
      id: "7rs",
      title: "The 7 R's of Migration",
      questions: [
        match("05-7-m1", 'Match each "R" to its meaning.', [
          { left: "Retire", right: "Decommission unused" },
          { left: "Retain", right: "Keep on-prem for now" },
          { left: "Rehost", right: "Lift & shift (no changes)" },
          {
            left: "Relocate",
            right: "Move hypervisor (e.g. VMware Cloud on AWS)",
          },
          { left: "Replatform", right: "Lift & tinker (small changes)" },
          { left: "Repurchase", right: "Switch to SaaS" },
          { left: "Refactor", right: "Rearchitect to cloud-native" },
        ]),
        mcq(
          "05-7-1",
          "Move a MySQL DB to RDS without app rewrite:",
          ["Refactor", "Replatform", "Rehost", "Repurchase"],
          1,
          "Lift & tinker = Replatform.",
        ),
        mcq(
          "05-7-2",
          "Lift VM as-is to EC2 unchanged:",
          ["Rehost", "Replatform", "Refactor", "Retire"],
          0,
          "Rehost = lift & shift.",
        ),
      ],
    },
    {
      id: "server-tools",
      title: "Server Migration Tools",
      questions: [
        match("05-st-m1", "Match each tool.", [
          {
            left: "AWS Application Migration Service (MGN)",
            right: "Block-level replication of any server to EC2 (preferred)",
          },
          {
            left: "AWS Server Migration Service (SMS)",
            right: "Legacy VMware/Hyper-V VM migration (deprecated)",
          },
          { left: "AWS Migration Hub", right: "Single pane of glass tracking" },
          {
            left: "AWS App2Container",
            right: "Containerize .NET / Java legacy apps",
          },
        ]),
        mcq(
          "05-st-1",
          "Preferred AWS server migration service today:",
          ["SMS", "MGN (CloudEndure-based)", "DataSync", "DMS"],
          1,
          "MGN replaces SMS. Block-level replication.",
        ),
      ],
    },
    {
      id: "db-tools",
      title: "Database Migration Tools",
      questions: [
        match("05-dt-m1", "Match each tool.", [
          { left: "DMS", right: "Migrate DBs (homo or heterogeneous)" },
          { left: "SCT", right: "Schema Conversion Tool, code & schema" },
          {
            left: "DMS + SCT",
            right: "Heterogeneous (Oracle→Aurora) workflow",
          },
        ]),
        mcq(
          "05-dt-1",
          "Migrate Oracle to Aurora PostgreSQL:",
          ["DMS only", "SCT only", "DMS + SCT", "Snowball"],
          2,
          "SCT converts schema, DMS moves data.",
        ),
        tf(
          "05-dt-2",
          "DMS source database stays available during migration.",
          true,
          "DMS supports continuous replication with no downtime.",
        ),
      ],
    },
    {
      id: "data-transfer",
      title: "Data Transfer Services",
      questions: [
        match("05-dx-m1", "Match each service.", [
          { left: "DataSync", right: "Online sync NFS/SMB/HDFS/S3 to AWS" },
          { left: "Snowcone", right: "8 TB portable" },
          { left: "Snowball Edge", right: "~80 TB / compute, ruggedized" },
          { left: "Snowmobile", right: "EB-scale truck (deprecated)" },
          {
            left: "AWS Transfer Family",
            right: "Managed SFTP/FTPS/FTP to S3/EFS",
          },
          { left: "Direct Connect", right: "Dedicated network link" },
        ]),
        mcq(
          "05-dx-1",
          "You need monthly recurring transfer of NFS data to S3:",
          ["Snowball", "DataSync", "Transfer Family", "CloudFront"],
          1,
          "DataSync is built for recurring scheduled file transfers.",
        ),
        mcq(
          "05-dx-2",
          "Legacy partners require SFTP into S3:",
          ["DataSync", "Transfer Family", "Snowball", "Storage Gateway"],
          1,
          "Transfer Family = managed SFTP/FTPS/FTP.",
        ),
      ],
    },
    {
      id: "datasync-vs-sgw",
      title: "DataSync vs Storage Gateway",
      questions: [
        match("05-ds-m1", "Match each.", [
          { left: "DataSync", right: "One-time / scheduled bulk transfer" },
          {
            left: "Storage Gateway",
            right: "Ongoing hybrid access (NFS/SMB/iSCSI)",
          },
        ]),
        mcq(
          "05-ds-1",
          "Migrate 200 TB once, then done:",
          [
            "Storage Gateway",
       