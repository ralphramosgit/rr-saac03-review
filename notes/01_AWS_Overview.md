# AWS SAA-C03 — 01 · AWS Overview

> Foundation concepts: global infrastructure, shared responsibility, well-architected pillars.

---

## Global Infrastructure

| Concept | Definition | Key Rule |
|---------|-----------|----------|
| **Region** | Geographic area with multiple isolated data centers | Resources are region-scoped unless global (IAM, R53, CloudFront, WAF) |
| **Availability Zone (AZ)** | 1+ data centers in a region, isolated power/network | Use ≥2 AZs for HA |
| **Edge Location** | CloudFront / Global Accelerator PoPs | 400+ locations, for caching/low-latency entry |
| **Local Zone** | Compute near major metros | Sub-ms latency to end users |
| **Wavelength Zone** | Compute embedded in 5G telco networks | Mobile edge / ultra-low latency |
| **Outposts** | AWS hardware in your data center | Hybrid, regulated workloads |

> **Rule:** Data does NOT leave the region you put it in unless you replicate it.
> **Rule:** AZ = isolated failure domain. Multi-AZ ≠ Multi-Region.

---

## Global vs Regional Services (memorize)

| Scope | Services |
|-------|----------|
| **Global** | IAM, Route 53, CloudFront, WAF (for CloudFront), Shield, Organizations, Trusted Advisor |
| **Regional** | EC2, S3 (bucket is regional, namespace global), VPC, RDS, Lambda, DynamoDB, most everything else |
| **AZ-specific** | EBS volume, EC2 instance, Subnet |

---

## Shared Responsibility Model

| AWS Responsible For ("Security **OF** the cloud") | Customer Responsible For ("Security **IN** the cloud") |
|---|---|
| Hardware, facilities, hypervisor | Guest OS patches, configuration |
| Managed service infrastructure | IAM users, roles, keys |
| Global network, DDoS at edge | Data classification, encryption choices |
| Managed-DB host OS / patching | Network ACLs, Security Groups, application code |

> **Rule of thumb:** AWS handles the **physical + virtualization layer**. You handle **identity, data, and configuration**.
> **EC2 = more customer responsibility** (you patch OS). **Lambda/RDS = less** (AWS patches).

---

## AWS Well-Architected Framework — 6 Pillars

| Pillar | Focus | Exam keyword |
|--------|-------|-------------|
| **Operational Excellence** | Run/monitor systems, deliver value | "automate", "runbooks", "IaC" |
| **Security** | Protect data, systems, assets | "least privilege", "encryption", "audit" |
| **Reliability** | Recover from failure, scale | "HA", "DR", "fault tolerant" |
| **Performance Efficiency** | Right resources, evolve | "right-size", "serverless", "global reach" |
| **Cost Optimization** | Avoid unnecessary cost | "RI", "Spot", "S3 tiering", "right-size" |
| **Sustainability** | Minimize environmental impact | "efficient regions", "managed services" |

---

## Pricing Fundamentals

| Pay For | Pay Nothing For |
|---------|-----------------|
| Compute (per second/hour) | Inbound data transfer |
| Storage (per GB/month) | Data transfer within same AZ (most services) |
| Outbound data transfer | Free-tier services (limits apply) |
| Provisioned throughput / IOPS | — |

> **Rule:** Cross-AZ traffic costs money. Cross-Region traffic costs more. Internet egress is the most expensive.
> **Rule:** Inbound traffic to AWS is FREE.

---

## Support Plans

| Plan | Response (Critical) | Use Case |
|------|---------------------|----------|
| **Basic** | None | Free; account & billing only |
| **Developer** | <12h business | Experimenting |
| **Business** | <1h (production down) | Production workloads |
| **Enterprise On-Ramp** | <30 min (business-critical) | Production with growing footprint |
| **Enterprise** | <15 min (business-critical) | Mission-critical, dedicated TAM |

> **Trusted Advisor full checks** require **Business or Enterprise**.

---

## Self-Test

- What's the difference between a Region, AZ, and Edge Location?
- Name 4 global services.
- Who patches the OS on EC2 vs RDS?
- Which Well-Architected pillar covers DR and HA?
- Which support tier unlocks all Trusted Advisor checks?
