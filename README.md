# AWS SAA-C03 Review — Study Cheatsheets

Personal study notes for the **AWS Certified Solutions Architect – Associate (SAA-C03)** exam.
Based on the [Tutorials Dojo cheat sheets](https://tutorialsdojo.com/aws-cheat-sheets/) — restructured into exam-focused rules, comparison tables, keyword triggers, and use cases.

---

## Interactive Quiz App

A React + Vite quiz app lives in [quiz-app/](quiz-app/). It drills every table in the notes via MCQ, true/false, drag-and-drop matching, and flashcards.

### Run locally

```bash
cd quiz-app
npm install
npm run dev
```

### Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Import Project** → select the repo.
3. Set **Root Directory** = `quiz-app` (framework preset auto-detects Vite).
4. Deploy. SPA routing is handled by `quiz-app/vercel.json`.

Or one-shot CLI: `cd quiz-app && npx vercel --prod`.

---

## How to Use These Notes

Each file follows the same pattern:

1. **Definition** — one-liner you can recite in the exam
2. **Rules** — hard facts AWS will test you on
3. **Tables** — comparisons, limits, tiers
4. **Keyword triggers** — phrases in the question → service to pick
5. **Use cases / anti-patterns** — when to use, when NOT to use
6. **Self-test prompts** — quick recall practice

> **Exam tip:** SAA-C03 is mostly about _picking the right service for a scenario_. Memorize keyword triggers and service comparisons more than configuration details.

---

## Topic Index

| #   | Topic                               | File                                                                   | Exam Weight         |
| --- | ----------------------------------- | ---------------------------------------------------------------------- | ------------------- |
| 01  | AWS Overview                        | [notes/01_AWS_Overview.md](notes/01_AWS_Overview.md)                   | Foundation          |
| 02  | Compute Services                    | [notes/02_Compute.md](notes/02_Compute.md)                             | ⭐⭐⭐⭐⭐ High     |
| 03  | Storage Services                    | [notes/03_Storage.md](notes/03_Storage.md)                             | ⭐⭐⭐⭐⭐ High     |
| 04  | Database Services                   | [notes/04_Database.md](notes/04_Database.md)                           | ⭐⭐⭐⭐⭐ High     |
| 05  | Migration Services                  | [notes/05_Migration.md](notes/05_Migration.md)                         | ⭐⭐⭐ Medium       |
| 06  | Networking & Content Delivery       | [notes/06_Networking.md](notes/06_Networking.md)                       | ⭐⭐⭐⭐⭐ High     |
| 07  | Security & Identity                 | [notes/07_Security_Identity.md](notes/07_Security_Identity.md)         | ⭐⭐⭐⭐⭐ High     |
| 08  | Management Tools                    | [notes/08_Management_Tools.md](notes/08_Management_Tools.md)           | ⭐⭐⭐ Medium       |
| 09  | Analytics                           | [notes/09_Analytics.md](notes/09_Analytics.md)                         | ⭐⭐⭐ Medium       |
| 10  | Billing & Cost Management           | [notes/10_Billing_Cost.md](notes/10_Billing_Cost.md)                   | ⭐⭐ Low-Med        |
| 11  | Developer Tools                     | [notes/11_Developer_Tools.md](notes/11_Developer_Tools.md)             | ⭐⭐ Low            |
| 12  | Application Services                | [notes/12_Application_Services.md](notes/12_Application_Services.md)   | ⭐⭐⭐⭐ High       |
| 13  | Front-end Web & Mobile              | [notes/13_Frontend_Mobile.md](notes/13_Frontend_Mobile.md)             | ⭐⭐ Low            |
| 14  | Desktop & App Streaming             | [notes/14_Desktop_AppStreaming.md](notes/14_Desktop_AppStreaming.md)   | ⭐ Very Low         |
| 15  | Machine Learning & AI               | [notes/15_ML_AI.md](notes/15_ML_AI.md)                                 | ⭐⭐ Low            |
| 16  | Other AWS Services                  | [notes/16_Other_Services.md](notes/16_Other_Services.md)               | ⭐⭐ Low            |
| 17  | Service Comparisons (cross-cutting) | [notes/17_Comparisons.md](notes/17_Comparisons.md)                     | ⭐⭐⭐⭐⭐ Critical |
| 18  | Disaster Recovery (DR)              | [notes/18_Disaster_Recovery.md](notes/18_Disaster_Recovery.md)         | ⭐⭐⭐⭐ High       |
| 19  | Auto Scaling & Load Balancing       | [notes/19_Scaling_LoadBalancing.md](notes/19_Scaling_LoadBalancing.md) | ⭐⭐⭐⭐⭐ High     |
| 20  | Personal Weaknesses Drill           | [notes/20_Weaknesses.md](notes/20_Weaknesses.md)                       | 🎯 Targeted         |
| 21  | Decoupling (Deep Dive)              | [notes/21_Decoupling.md](notes/21_Decoupling.md)                       | ⭐⭐⭐⭐⭐ Critical |

---

## Recommended Study Order

1. **Foundation:** 01 Overview → 07 Security/IAM → 06 Networking (VPC)
2. **Core trio:** 02 Compute → 03 Storage → 04 Database
3. **Integration:** 12 Application Services → 06 (advanced — CloudFront, R53, ELB)
4. **Operate:** 08 Management Tools → 10 Billing → 05 Migration
5. **Round-out:** 09 Analytics → 11/13/14/15/16
6. **Drill:** 17 Comparisons — repeat until automatic

---

## Exam Cheat-Code Mental Model

When you read a question, classify it on these 5 axes — the answer almost always falls out:

| Axis                        | Ask Yourself                       | Service Family                                    |
| --------------------------- | ---------------------------------- | ------------------------------------------------- |
| **Durability/Availability** | Single AZ? Multi-AZ? Multi-Region? | S3 classes, RDS Multi-AZ, Aurora Global, Route 53 |
| **Latency**                 | ms? sub-ms? microsecond?           | ElastiCache, DAX, CloudFront, Global Accelerator  |
| **Cost**                    | Hot? Warm? Cold? Archive?          | S3 tiers, EBS types, Reserved/Spot                |
| **Scale pattern**           | Steady? Spiky? Unpredictable?      | Auto Scaling, Lambda, Fargate, Aurora Serverless  |
| **Coupling**                | Sync? Async? Decoupled?            | SQS, SNS, EventBridge, Step Functions             |

---

## Top 20 Keyword Triggers (Memorize These)

| If the question says…                       | Think…                              |
| ------------------------------------------- | ----------------------------------- |
| "decouple", "buffer", "retry"               | **SQS**                             |
| "fan-out", "pub/sub", "notify many"         | **SNS**                             |
| "event-driven", "schedule", "match pattern" | **EventBridge**                     |
| "orchestrate workflow", "state machine"     | **Step Functions**                  |
| "serverless function", "<15 min"            | **Lambda**                          |
| "containers, no servers"                    | **Fargate**                         |
| "global low-latency static + dynamic"       | **CloudFront**                      |
| "global TCP/UDP failover, static IPs"       | **Global Accelerator**              |
| "DNS failover / weighted / geo routing"     | **Route 53**                        |
| "in-memory cache, microsecond"              | **ElastiCache / DAX**               |
| "petabyte data warehouse"                   | **Redshift**                        |
| "query S3 with SQL, ad-hoc"                 | **Athena**                          |
| "stream real-time data"                     | **Kinesis Data Streams**            |
| "deliver stream to S3/Redshift"             | **Kinesis Firehose**                |
| "lift-and-shift VMs"                        | **AWS MGN** (CloudEndure successor) |
| "large data transfer offline"               | **Snowball / Snowmobile**           |
| "hybrid file/block/tape storage"            | **Storage Gateway**                 |
| "DDoS protection"                           | **Shield / Shield Advanced**        |
| "WAF / SQLi / XSS / bot"                    | **AWS WAF**                         |
| "centralized multi-account governance"      | **Organizations + Control Tower**   |

---

## Next Step

After notes are complete: build an **interactive React quiz UI** that loads each section's rules / triggers / comparisons as flashcards + multiple-choice questions.
