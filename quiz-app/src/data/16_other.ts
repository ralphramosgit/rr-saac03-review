import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic16: Topic = {
  id: "16-other",
  number: "16",
  title: "Other Services & DR",
  weight: "Useful",
  blurb: "IoT, Media, Disaster Recovery strategies, Blockchain, misc.",
  sections: [
    {
      id: "iot",
      title: "IoT Services",
      questions: [
        match("16-io-m1", "Match each IoT service.", [
          {
            left: "IoT Core",
            right: "Device gateway (MQTT/HTTPS), device shadow, rules",
          },
          { left: "Greengrass", right: "Edge compute / ML on devices" },
          { left: "IoT Analytics", right: "Analyze IoT data" },
          { left: "IoT SiteWise", right: "Industrial equipment monitoring" },
          { left: "IoT Events", right: "Detect events from device data" },
          { left: "IoT Device Defender", right: "Audit + monitor security" },
          { left: "FreeRTOS", right: "OS for microcontrollers" },
        ]),
      ],
    },
    {
      id: "media",
      title: "Media Services",
      questions: [
        match("16-me-m1", "Match each media service.", [
          {
            left: "Elemental MediaConvert",
            right: "File-based video transcode",
          },
          { left: "Elemental MediaLive", right: "Live video encoding" },
          {
            left: "Elemental MediaPackage",
            right: "Just-in-time packaging + DRM",
          },
          { left: "Elemental MediaStore", right: "Optimized media storage" },
          { left: "Elemental MediaTailor", right: "Personalized ad insertion" },
          {
            left: "Kinesis Video Streams",
            right: "Camera/video ingest + playback",
          },
          { left: "IVS", right: "Interactive low-latency live streaming" },
        ]),
        mcq(
          "16-me-1",
          "Transcode an uploaded MP4 to HLS adaptive bitrate:",
          ["MediaLive", "MediaConvert", "MediaPackage", "IVS"],
          1,
          "MediaConvert = file-based transcoding.",
        ),
      ],
    },
    {
      id: "dr",
      title: "Disaster Recovery Strategies",
      questions: [
        match("16-dr-m1", "Match each DR strategy.", [
          { left: "Backup & Restore", right: "Cheapest, hours RTO" },
          { left: "Pilot Light", right: "Core scaled-down, scale up on event" },
          { left: "Warm Standby", right: "Smaller live copy, scale up" },
          {
            left: "Multi-Site (Hot)",
            right: "Fully active in 2+ regions; lowest RTO/RPO; costliest",
          },
        ]),
        mcq(
          "16-dr-1",
          "Cheapest acceptable DR for RTO of several hours:",
          ["Backup & Restore", "Pilot Light", "Warm Standby", "Multi-Site"],
          0,
          "Backup & Restore is cheapest with longest RTO.",
        ),
        mcq(
          "16-dr-2",
          "RTO < 1 minute, RPO ~ 0, cost no object:",
          [
            "Backup & Restore",
            "Pilot Light",
            "Warm Standby",
            "Multi-Site Active-Active",
          ],
          3,
          "Multi-site active-active minimizes RTO/RPO.",
        ),
      ],
    },
    {
      id: "blockchain",
      title: "Blockchain",
      questions: [
        match("16-bl-m1", "Match each blockchain service.", [
          {
            left: "Managed Blockchain",
            right: "Hyperledger Fabric / Ethereum networks",
          },
          {
            left: "QLDB",
            right: "Centralized immutable ledger (not blockchain)",
          },
        ]),
        mcq(
          "16-bl-1",
          "Need immutable record but no decentralized trust required:",
          ["Managed Blockchain", "QLDB", "DynamoDB", "S3 Object Lock"],
          1,
          "QLDB = central, immutable, cryptographic.",
        ),
      ],
    },
    {
      id: "misc-services",
      title: "Miscellaneous Services",
      questions: [
        match("16-mi-m1", "Match each service.", [
          { left: "AWS WorkMail", right: "Managed business email + calendar" },
          { left: "Amazon Chime", right: "Meetings / calls / chat" },
          { left: "Amazon Connect", right: "Cloud contact center" },
          { left: "AWS Ground Station", right: "Satellite communications" },
          { left: "AWS RoboMaker", right: "Robotics simulation" },
          { left: "Amazon Honeycode", right: "No-code apps (deprecated)" },
        ]),
      ],
    },
  ],
};
