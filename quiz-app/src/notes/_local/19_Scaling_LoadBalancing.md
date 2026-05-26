# AWS SAA-C03 — Auto Scaling & Load Balancing Cheat Sheet

> ELB family deep dive, ASG mechanics, scaling policies, health checks, and the architectural patterns the exam loves.

---

## PART 1: ELASTIC LOAD BALANCING (ELB) FAMILY

| LB                       | Version | Layer    | Protocols                    | Use                                                | Notes                                                                 |
| ------------------------ | ------- | -------- | ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| **ALB** — Application LB | v2      | **L7**   | HTTP, HTTPS, gRPC, WebSocket | Web apps, microservices, container routing         | Host/path/header/method/query/source-IP rules, OIDC/Cognito auth, WAF |
| **NLB** — Network LB     | v2      | **L4**   | TCP, UDP, TLS, TCP_UDP       | Ultra-low latency, static IPs, non-HTTP            | Millions RPS, ~25% latency of ALB, preserves source IP                |
| **GWLB** — Gateway LB    | v2      | **L3/4** | IP (GENEVE 6081)             | Insert 3rd-party appliances (firewall/IDS/IPS/DPI) | Transparent bump-in-the-wire, uses GWLB endpoints                     |
| **CLB** — Classic LB     | v1      | L4/L7    | HTTP, HTTPS, TCP, SSL        | **Legacy — don't pick on the exam**                | 1 SSL cert per CLB, no target groups                                  |

> **Rule:** Always pick **v2** (ALB/NLB/GWLB). CLB is a wrong answer unless the question explicitly says "classic" or EC2-Classic.

---

### ALB — Application Load Balancer

- **Layer 7**, HTTP/HTTPS only (also gRPC, WebSocket).
- **Listener rules** processed in priority order; default rule = catchall.
  - Conditions: `host-header`, `path-pattern`, `http-header`, `http-request-method`, `query-string`, `source-ip`.
  - Actions: `forward`, `redirect`, `fixed-response`, `authenticate-cognito`, `authenticate-oidc`.
- **Target types**: instance, IP, **Lambda**, ALB (chaining).
- **SSL terminates at the ALB** (no unbroken end-to-end SSL through an ALB — pick NLB if you need pass-through).
- **SNI** supports multiple certs on one listener.
- **Sticky sessions** via app cookie or LB-generated cookie.
- **WAF** integrates directly (rate limiting, SQLi/XSS rules).
- **Cross-zone load balancing**: **ON by default** (free for ALB).
- Adds **`X-Forwarded-For`** header for client IP (since SSL is terminated).

### NLB — Network Load Balancer

- **Layer 4**: TCP, UDP, TLS.
- **Static IP per AZ** (or assign **Elastic IPs**) — great for IP allow-lists / firewall rules.
- **Preserves source IP** when target type = `instance` or `ip` (no X-Forwarded-For needed).
- **TLS termination** supported (offload) or pure TCP pass-through (unbroken SSL).
- **No security group** on the NLB itself — target SG must permit client CIDR directly.
- Used with **PrivateLink** to expose services across VPCs/accounts.
- **Cross-zone LB**: **OFF by default** (extra cost when enabled — cross-AZ data charges).
- Health checks: TCP handshake / ICMP (not app-aware).

### GWLB — Gateway Load Balancer

- Run/scale **3rd-party virtual appliances** (firewall, IDS, IPS, DPI).
- Single entry/exit point; **transparent inspection** of all traffic.
- Traffic + metadata tunnelled with **GENEVE protocol (port 6081)**.
- Pairs with **GWLB endpoints** to redirect VPC traffic through the appliance.

---

### ALB vs NLB — Decision Cheatsheet

| Requirement                                 | Pick                                 |
| ------------------------------------------- | ------------------------------------ |
| Default web app, HTTP/HTTPS                 | **ALB**                              |
| WebSocket, gRPC, host/path routing          | **ALB**                              |
| Lambda as target                            | **ALB**                              |
| Cognito / OIDC user auth                    | **ALB**                              |
| Pair with WAF                               | **ALB**                              |
| **Static IP / Elastic IP** for whitelisting | **NLB**                              |
| **Unbroken end-to-end SSL**                 | **NLB** (TCP pass-through)           |
| **Fastest** / millions of RPS / low latency | **NLB**                              |
| **Non-HTTP** (SMTP, SSH, gaming, financial) | **NLB**                              |
| **UDP**                                     | **NLB**                              |
| Use with **PrivateLink**                    | **NLB**                              |
| Preserve **client source IP**               | **NLB** (ALB sets `X-Forwarded-For`) |
| Insert 3rd-party firewall/IDS               | **GWLB**                             |

---

## PART 2: ELB ARCHITECTURE FACTS

- ELB DNS name resolves to **1+ nodes per AZ** (A records). Nodes auto-scale.
- **Internet-facing** = nodes get public IPs. **Internal** = private only.
- **Backend EC2 does not need to be public** to work with an ELB.
- ELB needs at least **/27 subnet with 8+ free IPs per AZ** for scaling.
- Pick subnets in **≥ 2 AZs** (one subnet per AZ).
- **Cross-Zone Load Balancing**: distributes equally across all backend instances in all AZs.
  - **ALB**: ON by default (free).
  - **NLB & CLB**: OFF by default (enabling can add cross-AZ data-transfer cost).
- **Listener** = port + protocol the LB accepts on.
- **Target Group** = backend pool with health check settings.
- **Connection Draining / Deregistration Delay** (default 300s): allow in-flight requests to finish before removing a target.

### SSL Termination Modes

| Mode                 | LB           | What happens                                      |
| -------------------- | ------------ | ------------------------------------------------- |
| **SSL Offload**      | ALB / NLB    | SSL terminates at LB, HTTP to backend             |
| **SSL Bridging**     | ALB          | SSL terminates at LB, **re-encrypted** to backend |
| **SSL Pass-Through** | **NLB only** | LB forwards raw encrypted TCP; backend decrypts   |

### Sticky Sessions

| LB      | Stickiness                                         |
| ------- | -------------------------------------------------- |
| **ALB** | Cookie-based (LB-generated `AWSALB` or app cookie) |
| **NLB** | Source-IP-based (per-target group setting)         |
| **CLB** | Cookie-based (legacy)                              |

---

## PART 3: TARGET GROUPS & HEALTH CHECKS

- Target group = pool of targets + health check config.
- Health check fields: **protocol, port, path (ALB), interval, timeout, healthy/unhealthy threshold**.
- Failed → no new traffic; in-flight handled per deregistration delay.

### Target Types

- **instance** — register by EC2 instance ID (uses primary ENI).
- **ip** — any reachable IP in VPC (peered VPC, on-prem via DX/VPN, ECS awsvpc tasks).
- **lambda** — ALB only.
- **ALB** — ALB only (chain ALB behind NLB for static-IP fronting).

---

## PART 4: AUTO SCALING GROUPS (ASG)

> **An ASG defines WHEN and WHERE to launch instances. The Launch Template defines WHAT to launch.**

### Core Concepts

- **Launch Template (preferred)** or **Launch Configuration (legacy)** — defines AMI, instance type, key pair, SG, IAM role, user data, EBS, networking.
  - Launch **Configurations**: NOT editable — clone to change. No versioning.
  - Launch **Templates**: versioned, support newer features (T2/T3 unlimited, placement groups, capacity reservations, mixed-instances/spot).
- ASG has **Minimum**, **Desired**, **Maximum** capacity (e.g. 1 / 2 / 4).
- ASG keeps running instances at **Desired**; provisions or terminates as needed.
- ASG is **free** — you pay only for the instances it launches.
- **Multi-AZ** by selecting subnets in multiple AZs — ASG balances across them (AZRebalance).

### ASG + ELB Integration

- ASG can **register/deregister** targets to an attached target group automatically.
- Use **ELB health checks** instead of EC2-only checks for application-aware HA.
- Set **health check grace period** (default 300s) so bootstrap completes before checks start.

### Default Termination Policy (memorize!)

When scaling in, ASG picks the instance to terminate by, in order:

1. **AZ with the most running instances** (rebalance).
2. **Oldest Launch Template / Configuration**.
3. **Closest to the next billing hour** (legacy; mostly irrelevant per-second billing).

You can override with custom termination policies, or **Instance Protection** on specific instances.

### Scaling Processes (can be suspended)

- `Launch` / `Terminate`
- `AddToLoadBalancer`
- `AlarmNotification`
- `AZRebalance` — equalize instances across AZs
- `HealthCheck` / `ReplaceUnhealthy`
- `ScheduledActions`
- `Standby` — put an instance in Standby (in-place ops without termination)

---

## PART 5: ASG SCALING POLICIES

| Policy                 | How it works                                                            | Best for                                                 |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| **Manual**             | Set min/desired/max by hand                                             | Testing, urgent control                                  |
| **Scheduled**          | Change capacity on a time schedule                                      | Predictable load (sales, business hours)                 |
| **Simple Scaling**     | One CW alarm → ±N instances; cooldown wait                              | Simple needs; **AWS no longer recommends**               |
| **Step Scaling**       | Multiple alarm thresholds → different ±N steps                          | Variable load; **AWS-recommended over Simple**           |
| **Target Tracking**    | Pick a metric (e.g. `ASGAverageCPUUtilization = 50%`), ASG auto-adjusts | **Most common modern choice**                            |
| **Predictive Scaling** | ML forecasts load (CPU/network/etc) and pre-warms                       | Cyclic / predictable patterns (uses 14+ days of history) |

### Useful target metrics for Target Tracking

- `ASGAverageCPUUtilization`
- `ASGAverageNetworkIn` / `Out`
- `ALBRequestCountPerTarget` — **scale by request load behind an ALB**
- Custom CloudWatch metric (e.g. SQS `ApproximateNumberOfMessagesVisible` per instance)

> **Keyword:** "scale based on queue backlog" → custom metric on **SQS `ApproximateNumberOfMessagesVisible`**, often using `Acceptable Backlog Per Instance`.

### Cooldown Periods

- After a scaling activity, default cooldown (default 300s) blocks further simple-scaling actions to let metrics stabilize.
- Target tracking and step scaling honor warm-up/cooldown differently.
- Health check **grace period** is separate — gives new instances time to boot before health checks count.

---

## PART 6: ASG HEALTH CHECKS

Three sources:

| Type              | What marks unhealthy                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| **EC2 (default)** | Stopping / Stopped / Terminated / Shutting Down / Impaired (failed 2/2 status checks) |
| **ELB**           | Fails ELB target-group health check (app-aware via HTTP path)                         |
| **Custom**        | External system marks via API (`SetInstanceHealth`)                                   |

- ELB + EC2 combined gives best signal — exam favors **enabling ELB health checks** for web tiers.
- **Health check grace period** delays checks after launch (default 300s) — raise it for slow-boot apps so they don't get killed during bootstrap.

---

## PART 7: ASG LIFECYCLE HOOKS

- **Pause** instances during launch (`Pending:Wait`) or termination (`Terminating:Wait`).
- Use for: bootstrapping config, draining connections, log shipping, backups.
- Resolve via `complete-lifecycle-action` (CONTINUE or ABANDON) or timeout (default 1 hour, max 48h).
- Notify via **EventBridge** or **SNS**.

```
Launch → Pending:Wait (hook) → InService
Terminate → Terminating:Wait (hook) → Terminated
```

---

## PART 8: ASG WITH SPOT / MIXED INSTANCES

- **Mixed Instances Policy** (Launch Template only): combine On-Demand and Spot across instance types and AZs.
- Define **On-Demand base capacity** + **percentages above base** for OD vs Spot.
- Use **multiple instance types** in **multiple AZs** for spot **diversification** → fewer interruptions.
- **Capacity-optimized allocation** = lowest interruption risk (preferred for stateful spot workloads).

---

## PART 9: COMMON EXAM PATTERNS

| Scenario                         | Architecture                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Stateless web tier, HA, elastic  | **ALB + multi-AZ ASG** with target-tracking on CPU or `ALBRequestCountPerTarget`                        |
| Queue-driven worker fleet        | SQS + ASG scaled on `ApproximateNumberOfMessagesVisible` per instance (custom metric / target tracking) |
| Predictable daily peak           | **Scheduled scaling** + target tracking for surprises                                                   |
| Cyclic but variable peak         | **Predictive scaling** + target tracking                                                                |
| Need static IPs in front of ASG  | **NLB + ASG** (or **NLB → ALB → ASG** for both static IP and L7 routing)                                |
| End-to-end TLS to instances      | **NLB pass-through** to instances, or **ALB SSL bridging** (re-encrypt)                                 |
| Insert IDS/IPS appliances in VPC | **GWLB** with GWLB endpoints                                                                            |
| Active-passive multi-AZ DB tier  | **RDS Multi-AZ** (sync standby, automatic failover, ~60-120s RTO)                                       |
| Read scaling at app tier         | ASG + ALB; for DB use Read Replicas (RDS) or Aurora reader endpoint                                     |

---

## PART 10: KEYWORD TRIGGERS

| Question says…                                         | Pick                                    |
| ------------------------------------------------------ | --------------------------------------- |
| "Host- or path-based routing"                          | **ALB**                                 |
| "WebSocket / gRPC"                                     | **ALB**                                 |
| "Lambda behind a load balancer"                        | **ALB**                                 |
| "Static IPs / IP allow-list"                           | **NLB** (or NLB → ALB)                  |
| "Millions of RPS, ultra-low latency"                   | **NLB**                                 |
| "TCP/UDP, non-HTTP"                                    | **NLB**                                 |
| "Unbroken (end-to-end) SSL"                            | **NLB pass-through**                    |
| "Preserve client source IP without `X-Forwarded-For`"  | **NLB**                                 |
| "Insert virtual firewall / IDS"                        | **GWLB**                                |
| "Decouple workers from queue depth"                    | **ASG scaling on SQS metric**           |
| "Pre-warm before known traffic spike"                  | **Scheduled** or **Predictive scaling** |
| "Don't terminate during graceful shutdown"             | **Lifecycle hook (Terminating:Wait)**   |
| "Slow app boot, instances flagged unhealthy too early" | **Increase health check grace period**  |
| "Replace EC2-Classic LB"                               | **ALB / NLB** (don't pick CLB)          |

---

## PART 11: SELF-TEST PROMPTS

1. Which LB preserves the client source IP without needing `X-Forwarded-For`?
2. Default cross-zone LB setting for ALB vs NLB?
3. Which LB can target Lambda?
4. You need static IPs in front of an HTTP app with path-based routing — how?
5. What does an ASG's Launch Template define vs the ASG itself?
6. Default ASG termination order (top 2)?
7. Which scaling policy does AWS recommend over Simple Scaling, and why?
8. Health check grace period — what is it and why raise it?
9. SQS-driven workers — which metric do you scale on?
10. NLB with TLS pass-through — where does decryption happen?
11. GWLB tunnels traffic with which protocol?
12. When would you choose CLB on the exam?

> Answers: (1) NLB. (2) ALB ON by default; NLB OFF by default. (3) ALB. (4) **NLB in front of ALB** — NLB exposes static IPs, ALB does L7 routing. (5) Launch Template = WHAT (AMI, type, SG, IAM, user data). ASG = WHEN/WHERE (capacity, AZs, scaling). (6) Most-instances AZ → oldest LT/LC. (7) **Step scaling** (or target tracking) — adjusts size based on breach magnitude, not a single fixed delta. (8) Delay after launch before health checks count — raise if app bootstraps slowly. (9) `ApproximateNumberOfMessagesVisible` (often as backlog-per-instance). (10) On the EC2 backend (NLB just forwards TCP). (11) **GENEVE** (port 6081). (12) Never — pick ALB/NLB. CLB only if the question explicitly forces EC2-Classic.
