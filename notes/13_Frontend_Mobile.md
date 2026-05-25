# AWS SAA-C03 — 13 · Front-end Web & Mobile Services

> Amplify, AppSync, Device Farm, Location Service, Pinpoint, SES. Light on the exam.

---

## AWS Amplify

Full-stack platform: hosting (static + SSR Next.js), CI/CD from Git, auth (Cognito), data (AppSync/DynamoDB), storage (S3), functions (Lambda).

> **Keyword:** "host React/Next.js app with CI/CD from GitHub" → **Amplify Hosting**.

---

## AppSync (cross-listed in [12_Application_Services.md](12_Application_Services.md))
Managed GraphQL with realtime + offline sync.

---

## AWS Device Farm
Test mobile / web apps on real iOS/Android devices in cloud.

---

## Amazon Location Service
Maps, places, geocoding, routes, trackers, geofences. Alternative to Google Maps.

---

## Amazon Pinpoint
Customer engagement: push, SMS, email, voice, in-app messaging + campaigns + analytics. Larger than SES (which is just email).

### Pinpoint vs SES vs SNS

| | Pinpoint | SES | SNS |
|---|---------|-----|-----|
| Channel | Multi-channel + campaigns | Email only, transactional/marketing | Pub/sub, SMS/email/push as subscribers |
| Audience targeting | Yes | No | No |
| Analytics | Yes | Basic events | Basic |

---

## Amazon SES (Simple Email Service)

Bulk/transactional email. Inbound + outbound. DKIM/SPF/DMARC. Integrates with SNS for bounces/complaints. Dedicated IP options.

> **Keyword:** "send transactional email cheaply" → **SES**.

---

## Self-Test

- Pinpoint vs SES?
- How to host a Next.js app on AWS managed?
