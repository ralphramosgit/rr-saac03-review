# AWS SAA-C03 — 16 · Other AWS Services

> Catch-all: IoT, Robotics, Media, Game, AR/VR, Quantum, Satellite, Disaster Recovery, Blockchain.

---

## IoT

| Service | Purpose |
|---------|---------|
| **AWS IoT Core** | Device connectivity (MQTT/HTTP/WebSocket); device shadows; rules engine |
| **IoT Greengrass** | Run Lambda & ML on-edge devices |
| **IoT Analytics** | Time-series analytics for device data |
| **IoT Device Defender** | Audit & monitor device security |
| **IoT Device Management** | Provision, organize, OTA updates |
| **IoT Events** | Detect patterns and trigger actions |
| **IoT SiteWise** | Industrial equipment data |
| **IoT TwinMaker** | Digital twins |
| **FreeRTOS** | Microcontroller OS |

---

## Media Services

| Service | Purpose |
|---------|---------|
| **Elastic Transcoder** | Older video transcoding (most use MediaConvert now) |
| **MediaConvert** | File-based video transcoding (broadcast quality) |
| **MediaLive** | Live video encoding |
| **MediaPackage** | Just-in-time packaging + DRM |
| **MediaStore** | Optimized media object store |
| **MediaTailor** | Personalized ad insertion |
| **Interactive Video Service (IVS)** | Low-latency live streaming |
| **Kinesis Video Streams** | Video ingestion for ML/playback |

---

## Game / VR

- **GameLift** — managed game server hosting + matchmaking.
- **Sumerian** — (deprecated) AR/VR/3D scenes in browser.

---

## Robotics
- **RoboMaker** — simulation + fleet mgmt for robotics (note: announced deprecation; check status before relying on it for current exam).

---

## Quantum / Specialty
- **Amazon Braket** — quantum computing service.
- **AWS Ground Station** — managed satellite ground stations.

---

## Disaster Recovery — Strategies (memorize)

| Strategy | RTO | RPO | Cost | How |
|----------|-----|-----|------|-----|
| **Backup & Restore** | Hours | Hours | $ | AWS Backup, S3, Glacier; restore on demand |
| **Pilot Light** | 10s of min | Minutes | $$ | Core data replicated; minimal infra on; scale up on DR |
| **Warm Standby** | Minutes | Seconds | $$$ | Scaled-down full env always running |
| **Multi-Site Active/Active** | Seconds (zero) | Near-zero | $$$$ | Both regions serve live traffic |

### AWS Elastic Disaster Recovery (DRS / CloudEndure DR successor)
Block-level continuous replication of servers to AWS; launch in minutes for failover.

> **Keyword:** "lowest RTO/RPO, multi-region live" → **Active/Active** (R53 + Aurora Global + DynamoDB Global Tables).
> **Keyword:** "cheap, hours acceptable" → **Backup & Restore**.
> **Keyword:** "fast on-prem → AWS failover, block-level replication" → **DRS**.

---

## Blockchain

| Service | Purpose |
|---------|---------|
| **Managed Blockchain** | Hyperledger Fabric / Ethereum networks |
| **QLDB** | Centralized ledger w/ cryptographic verification (not blockchain) |

---

## Misc

| Service | Purpose |
|---------|---------|
| **Outposts** | AWS rack in your data center |
| **Local Zones / Wavelength** | Edge compute close to users / 5G |
| **Snowball Edge with compute** | Edge compute when disconnected |
| **App Runner** | Fully managed container web apps (simplest Fargate alternative) |
| **Proton** | Platform engineering / templates for serverless + container apps |
| **License Manager** | Track BYOL licenses |
| **Resilience Hub** | Score / improve app resiliency vs RTO/RPO goals |

---

## Self-Test

- 4 DR strategies — RTO/RPO/cost trade-offs?
- IoT Greengrass vs IoT Core?
- MediaLive vs MediaConvert?
- App Runner — what problem does it solve?
