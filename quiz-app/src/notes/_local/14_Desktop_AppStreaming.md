# AWS SAA-C03 — 14 · Desktop & App Streaming

> WorkSpaces, AppStream 2.0, WorkSpaces Web, WorkDocs (retired), WorkLink (retired).

---

## Amazon WorkSpaces

**One-liner:** Managed Desktop-as-a-Service (DaaS). Persistent Windows or Linux desktops in the cloud, per-user.

| Item | Detail |
|------|--------|
| Persistence | **Persistent** user desktop |
| Billing | Hourly or Monthly per user |
| OS | Windows 10/11, Amazon Linux 2, Ubuntu |
| Auth | AD (Managed Microsoft AD, AD Connector, Simple AD) |
| Encryption | KMS at rest (root + user volumes) |

> **Keyword:** "remote employees need full persistent virtual desktop" → **WorkSpaces**.

---

## Amazon AppStream 2.0

**One-liner:** **Application** streaming (single app, not full desktop), session-based, non-persistent.

| | WorkSpaces | AppStream 2.0 |
|---|-----------|---------------|
| What's streamed | **Full desktop** | **Specific application** |
| Session | Persistent | Non-persistent (stateless) |
| Use | Long-term remote worker | Stream a specific Windows app to any device |

> **Keyword:** "stream a CAD app to user browsers" → **AppStream 2.0**.

---

## Amazon WorkSpaces Web
Secure managed web browser (formerly WorkLink). Access internal websites without VPN, no data on endpoint.

---

## Self-Test

- WorkSpaces vs AppStream — full desktop or single app?
- Authentication source for WorkSpaces?
