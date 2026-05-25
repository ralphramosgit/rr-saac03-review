# AWS SAA-C03 — 06 · Networking & Content Delivery

> VPC, Subnets, Routing, Gateways, ELB, Route 53, CloudFront, Global Accelerator, Direct Connect, VPN, Transit Gateway. **High-weight.**

---

## PART 1: VPC FUNDAMENTALS

**One-liner:** Virtual Private Cloud — isolated virtual network in a region with your own IP range, subnets, and routing.

| Item | Detail |
|------|--------|
| **CIDR** | IPv4 /16 to /28; IPv6 /56 (AWS-provided or your own BYOIP) |
| **VPC scope** | Region; spans all AZs |
| **Subnet scope** | Single AZ |
| **Default VPC** | One per region; auto-creates public subnets in each AZ |
| **Reserved IPs per subnet** | **5** (.0 network, .1 router, .2 DNS, .3 future, .255 broadcast) |

### Subnets

| Type | Definition | Route to |
|------|-----------|----------|
| **Public** | Has route to **Internet Gateway** + public IP auto-assign | IGW |
| **Private** | No direct internet ingress | NAT GW for egress |
| **Isolated** | No internet at all | — / VPC endpoints only |

### Gateways

| Gateway | Direction | Notes |
|---------|-----------|-------|
| **Internet Gateway (IGW)** | Bidirectional internet | 1 per VPC |
| **Egress-only IGW** | IPv6 outbound only | IPv6 equivalent of NAT |
| **NAT Gateway** | Private → internet (outbound) | Managed, AZ-scoped, HA per AZ; **deploy 1 per AZ** for HA |
| **NAT Instance** | Same, on EC2 | Legacy; disable source/dest check |
| **Virtual Private Gateway (VGW)** | Site-to-Site VPN endpoint | Attached to VPC |
| **Customer Gateway (CGW)** | On-prem VPN endpoint | Your device |

> **Rule:** NAT Gateway is **AZ-bound**. Multi-AZ HA = one NAT GW **per AZ** with route from each private subnet to its local NAT GW.
> **Rule:** Public IP needs IGW + route + auto-assign or EIP — all three.

### Route Tables

- Each subnet associated to **one** route table.
- Local route (VPC CIDR) is implicit and **cannot be removed**.
- Longest prefix wins on multiple matches.

### Security Groups vs NACLs — **MUST KNOW**

| | Security Group | Network ACL |
|---|----------------|-------------|
| Scope | **Instance / ENI** | **Subnet** |
| Stateful? | **Stateful** (return allowed) | **Stateless** (must allow both ways) |
| Rules | Allow only | Allow + Deny |
| Evaluation | All rules evaluated | Numbered, first match |
| Default | All outbound allowed, no inbound | Default NACL: allow all; custom NACL: deny all |

> **Keyword:** "explicitly deny IP/range" → **NACL** (SG can't deny).
> **Trick:** SG references another SG (e.g., web SG → app SG) — common pattern.

### VPC Endpoints (private connectivity to AWS services, no IGW/NAT)

| Type | Powered By | For |
|------|-----------|-----|
| **Gateway Endpoint** | Route table entry | **S3** and **DynamoDB only** — free |
| **Interface Endpoint** (PrivateLink) | ENI with private IP | Most other AWS services + your own services |

> **Rule:** Gateway endpoints = FREE; Interface endpoints = $$ per hour + data.
> **Keyword:** "private access to S3 from private subnet without NAT" → **Gateway Endpoint**.

### VPC Peering

- 1-to-1; **non-transitive** (A↔B, B↔C ≠ A↔C).
- Cross-region, cross-account OK.
- CIDR cannot overlap.
- Update route tables in both VPCs.

### Transit Gateway (TGW)

- **Hub-and-spoke** router connecting many VPCs, VPNs, Direct Connect, even cross-region (peering).
- **Transitive** routing (solves peering's biggest weakness).
- Supports multicast, route tables, AWS RAM sharing across accounts.

> **Keyword:** "connect hundreds of VPCs / multi-account hub" → **Transit Gateway**.
> **Keyword:** "two VPCs, simplest, lowest cost" → **VPC Peering**.

### VPC Flow Logs
Capture IP traffic metadata → CloudWatch Logs, S3, or Kinesis Data Firehose. ACCEPT / REJECT / ALL. Doesn't capture payload.

### AWS PrivateLink
Expose your service to other VPCs/accounts via Interface Endpoints — no peering, no public IP, one-way.

---

## PART 2: HYBRID CONNECTIVITY

| Service | Trait | When |
|---------|-------|------|
| **Site-to-Site VPN** | IPsec over internet; quick to set up | Low-throughput, encrypted |
| **AWS Client VPN** | OpenVPN-based, end-user | Remote users to VPC |
| **AWS Direct Connect (DX)** | Dedicated line via partner; 1/10/100 Gbps | Consistent throughput, lower cost @ scale, **not encrypted by default** |
| **DX + VPN** | Encrypted DX | Best practice for sensitive |
| **Direct Connect Gateway** | Connect DX to multiple VPCs across regions | Multi-region |

> **Rule:** DX takes weeks to provision. Use VPN as fallback meanwhile.
> **Keyword:** "consistent low-latency 10 Gbps to on-prem" → **Direct Connect**.
> **Keyword:** "encrypted DX" → DX + Site-to-Site VPN on top, or **MACsec** (supported on dedicated ports).

---

## PART 3: ELASTIC LOAD BALANCING (ELB)

| LB | Layer | Protocol | Use |
|----|-------|----------|-----|
| **Application Load Balancer (ALB)** | L7 | HTTP/HTTPS, gRPC, WebSocket | Web apps, host/path/header routing, OIDC auth |
| **Network Load Balancer (NLB)** | L4 | TCP, UDP, TLS | Extreme perf, static IPs/EIPs, millions RPS |
| **Gateway Load Balancer (GWLB)** | L3/4 | GENEVE 6081 | Firewall/IDS/IPS appliance insertion |
| **Classic Load Balancer (CLB)** | L4/L7 | Legacy | Don't pick on the exam |

### ALB Features

- Target types: instance, IP, **Lambda**, ALB (chaining).
- **Listener rules** with conditions (host, path, header, query, source IP, HTTP method).
- **Authenticate** with Cognito / OIDC.
- **Sticky sessions** via cookie.
- **WAF** integration.
- TLS termination, SNI for multiple certs.

### NLB Features

- **Static IP per AZ** (or EIP).
- **Preserves source IP** to targets.
- TLS termination supported.
- No security group on NLB itself (target SG must allow client IP).

### GWLB

- Transparent bump-in-the-wire for 3rd-party security appliances.
- Use with GWLB endpoints.

### Target Groups & Health Checks
- Health check protocol/path/interval/threshold.
- Unhealthy → no traffic; healthy → resume.
- Cross-zone load balancing: ALB ON by default, NLB OFF by default (extra cost cross-AZ).

---

## PART 4: ROUTE 53 (DNS)

| Item | Detail |
|------|--------|
| **Hosted zones** | Public (internet) and Private (VPC-scoped) |
| **Record types** | A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, **Alias** (AWS-only, free, root domain OK) |
| **Alias vs CNAME** | Alias is free, can be at zone apex (root). CNAME cannot be at root. |
| **TTL** | Lower = faster propagation, higher cost |

### Routing Policies

| Policy | Use |
|--------|-----|
| **Simple** | Single record |
| **Weighted** | A/B tests, gradual shift |
| **Latency-based** | Route to lowest-latency region |
| **Failover** | Active-passive (primary + secondary with health check) |
| **Geolocation** | By user's country/continent |
| **Geoproximity** (via Traffic Flow) | Bias toward a region |
| **Multivalue Answer** | Up to 8 healthy records (simple LB) |
| **IP-based** | Route by client IP CIDR |

### Health Checks
HTTP/HTTPS/TCP, calculated (combine), CloudWatch alarm-based. Required for failover/multivalue.

> **Keyword:** "DR active-passive across regions" → **Route 53 Failover** + health checks.
> **Keyword:** "send EU users to EU region" → **Geolocation** (or latency-based if perf-driven).

---

## PART 5: CLOUDFRONT (CDN)

**One-liner:** Global CDN with 400+ edge locations; caches static + dynamic content; integrates with S3, ALB, EC2, Lambda@Edge, CloudFront Functions.

| Feature | Detail |
|---------|--------|
| **Origins** | S3, MediaStore, ALB, EC2, custom HTTP |
| **Origin Access Control (OAC)** | Lock S3 origin to CloudFront only (replaces OAI) |
| **Signed URLs / Cookies** | Restrict access (single resource vs many) |
| **Field-Level Encryption** | Encrypt specific form fields at edge |
| **Lambda@Edge** | Run Node/Python; viewer-request, origin-request, origin-response, viewer-response |
| **CloudFront Functions** | Lightweight JS; viewer-request/response only; sub-ms |
| **Price Classes** | All / 200 / 100 — limit geographic edge use to save cost |
| **Geo Restriction** | Allowlist or blocklist countries |
| **Regional Edge Caches** | Larger mid-tier cache between edge and origin |

> **Rule:** Use **OAC** (not legacy OAI) for S3 origins on new setups.
> **Keyword:** "global low-latency static + dynamic + custom logic at edge" → **CloudFront + Lambda@Edge**.

---

## PART 6: GLOBAL ACCELERATOR

**One-liner:** Static anycast IPs + AWS global network to your regional endpoints; non-HTTP OK; sub-second failover.

### CloudFront vs Global Accelerator

| | CloudFront | Global Accelerator |
|---|-----------|---------------------|
| Layer | L7 cache | L4 network |
| Protocol | HTTP/HTTPS | TCP / UDP (any) |
| Caches content? | **Yes** | No (proxies through) |
| Use | Static + dynamic web | Gaming, IoT, VoIP, non-HTTP TCP/UDP, fast regional failover, fixed entry IPs |

> **Keyword:** "two static IPs, route to nearest region, UDP" → **Global Accelerator**.
> **Keyword:** "cache static + dynamic web globally" → **CloudFront**.

---

## PART 7: API GATEWAY / NETWORK FIREWALL

| Service | Purpose |
|---------|---------|
| **API Gateway** | REST / HTTP / WebSocket APIs front-door — see [12_Application_Services.md](12_Application_Services.md) |
| **AWS Network Firewall** | Stateful managed firewall for VPC (Suricata-compatible rules) |
| **Route 53 Resolver** | Inbound/outbound endpoints for hybrid DNS resolution |

---

## Decision Snapshots

| Need | Pick |
|------|------|
| Private connection between 2 VPCs | **Peering** (if few), **TGW** (if many) |
| Private access to S3 from private subnet | **Gateway VPC Endpoint** |
| HTTP routing by path | **ALB** |
| Static IP load balancer, UDP, ultra-perf | **NLB** |
| Insert 3rd-party firewall | **GWLB** |
| DDoS L3/L4 + WAF | **Shield + WAF on ALB/CloudFront** |
| Hybrid 10 Gbps consistent | **Direct Connect** |
| Encrypted hybrid quick | **Site-to-Site VPN** |
| Many VPCs hub-and-spoke | **Transit Gateway** |
| Active-passive DR DNS | **Route 53 Failover** |
| Cache global website | **CloudFront** |
| Fast non-HTTP failover w/ static IPs | **Global Accelerator** |

---

## Self-Test

- Reserved IPs per subnet?
- Stateful vs stateless — SG or NACL?
- Which endpoint type is free (S3, DynamoDB)?
- Why deploy NAT GW per AZ?
- VPC peering: transitive? cross-region?
- ALB vs NLB vs GWLB — pick one per scenario.
- CloudFront vs Global Accelerator — UDP gaming?
- Route 53 Alias vs CNAME at zone apex?
- DX is encrypted by default? (No)
