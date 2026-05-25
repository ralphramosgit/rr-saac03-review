import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic06: Topic = {
  id: "06-networking",
  number: "06",
  title: "Networking & Content Delivery",
  weight: "Critical",
  blurb:
    "VPC, subnets, gateways, SG vs NACL, endpoints, ELBs, Route 53, CloudFront, Global Accelerator.",
  sections: [
    {
      id: "vpc",
      title: "VPC Fundamentals",
      questions: [
        match("06-v-m1", "Match each VPC concept.", [
          { left: "VPC", right: "Logical isolated network in a region" },
          { left: "CIDR block", right: "IP range, /16 to /28" },
          {
            left: "Default VPC",
            right: "Auto-created per region, all-public subnets",
          },
          { left: "VPC Peering", right: "1:1 connection, non-transitive" },
          { left: "Transit Gateway", right: "Hub for many VPCs / on-prem" },
          { left: "VPC Flow Logs", right: "Capture IP traffic metadata" },
        ]),
        mcq(
          "06-v-1",
          "Connect 50 VPCs in mesh-like fashion:",
          ["VPC Peering (all pairs)", "Transit Gateway", "VPN", "NAT Gateway"],
          1,
          "TGW scales to many VPCs; peering doesn't transit.",
        ),
        tf(
          "06-v-2",
          "VPC Peering is transitive (A-B and B-C implies A-C).",
          false,
          "VPC peering is NOT transitive.",
        ),
      ],
    },
    {
      id: "subnets",
      title: "Subnets",
      questions: [
        match("06-s-m1", "Match each subnet type.", [
          { left: "Public subnet", right: "Has route to Internet Gateway" },
          { left: "Private subnet", right: "No direct internet, may use NAT" },
          { left: "Isolated / DB subnet", right: "No internet, no NAT" },
        ]),
        mcq(
          "06-s-1",
          "Subnet is bound to:",
          ["A region", "A single AZ", "All AZs", "A VPN"],
          1,
          "Subnet = single AZ.",
        ),
        tf(
          "06-s-2",
          "AWS reserves 5 IPs per subnet (.0, .1, .2, .3, .255).",
          true,
          "Network, VPC router, DNS, future, broadcast.",
        ),
      ],
    },
    {
      id: "gateways",
      title: "Gateways",
      questions: [
        match("06-g-m1", "Match each gateway.", [
          { left: "Internet Gateway", right: "Public ingress/egress to VPC" },
          {
            left: "NAT Gateway",
            right: "Outbound internet for private subnet (managed)",
          },
          {
            left: "NAT Instance",
            right: "Self-managed EC2-based NAT (legacy)",
          },
          { left: "Egress-only IGW", right: "IPv6 outbound only" },
          {
            left: "Virtual Private Gateway",
            right: "VPN endpoint on VPC side",
          },
          {
            left: "Customer Gateway",
            right: "On-prem VPN endpoint definition",
          },
        ]),
        mcq(
          "06-g-1",
          "Private subnet needs to download OS updates:",
          ["Internet Gateway", "NAT Gateway", "VPC Endpoint", "Direct Connect"],
          1,
          "NAT GW provides outbound internet for private subnets.",
        ),
        mcq(
          "06-g-2",
          "NAT Gateway must be placed in:",
          ["Private subnet", "Public subnet", "Either", "Edge location"],
          1,
          "NAT GW lives in a PUBLIC subnet.",
        ),
      ],
    },
    {
      id: "sg-vs-nacl",
      title: "Security Group vs NACL",
      questions: [
        match("06-sn-m1", "Match each property to SG or NACL.", [
          { left: "Stateful", right: "Security Group" },
          { left: "Stateless", right: "NACL" },
          { left: "Allow rules only", right: "Security Group" },
          { left: "Allow + Deny rules", right: "NACL" },
          { left: "Instance / ENI level", right: "Security Group" },
          { left: "Subnet level", right: "NACL" },
          { left: "Rules numbered & ordered", right: "NACL" },
          { left: "All rules evaluated together", right: "Security Group" },
        ]),
        mcq(
          "06-sn-1",
          "Block a specific bad IP at the subnet level:",
          [
            "Security Group deny rule",
            "NACL deny rule",
            "Route table",
            "WAF only",
          ],
          1,
          "NACL supports DENY; SGs do not.",
        ),
        tf(
          "06-sn-2",
          "Security Group return traffic is implicitly allowed (stateful).",
          true,
          "Stateful — return traffic auto-allowed.",
        ),
      ],
    },
    {
      id: "vpc-endpoints",
      title: "VPC Endpoints",
      questions: [
        match("06-ep-m1", "Match each endpoint type.", [
          {
            left: "Gateway Endpoint",
            right: "S3, DynamoDB only; route table entry; free",
          },
          {
            left: "Interface Endpoint",
            right: "ENI + private IP; most other services; hourly + data",
          },
          {
            left: "Gateway Load Balancer endpoint",
            right: "Insert appliances (firewall, IDS)",
          },
        ]),
        mcq(
          "06-ep-1",
          "Access S3 from private subnet without internet:",
          [
            "NAT Gateway",
            "Interface Endpoint",
            "Gateway Endpoint",
            "Transit Gateway",
          ],
          2,
          "S3 supports Gateway endpoints (free).",
        ),
      ],
    },
    {
      id: "elb-types",
      title: "ELB Types",
      questions: [
        match("06-el-m1", "Match each ELB type to its layer.", [
          { left: "Application Load Balancer", right: "Layer 7 (HTTP/HTTPS)" },
          { left: "Network Load Balancer", right: "Layer 4 (TCP/UDP/TLS)" },
          {
            left: "Gateway Load Balancer",
            right: "Layer 3/4 (appliance insertion)",
          },
          { left: "Classic Load Balancer", right: "Legacy L4/L7" },
        ]),
        mcq(
          "06-el-1",
          "Path-based routing /api → service A, /web → service B:",
          ["ALB", "NLB", "GWLB", "CLB"],
          0,
          "ALB supports path/host-based routing.",
        ),
        mcq(
          "06-el-2",
          "Need static IPs and millions of req/sec at L4:",
          ["ALB", "NLB", "CloudFront", "GA"],
          1,
          "NLB = static IPs, ultra-low latency, L4.",
        ),
      ],
    },
    {
      id: "alb",
      title: "ALB Features",
      questions: [
        match("06-al-m1", "Match each ALB feature.", [
          {
            left: "Routing",
            right: "Host / path / header / query / source IP",
          },
          { left: "Targets", right: "EC2, IP, Lambda, ECS, containers" },
          { left: "WebSocket / HTTP/2", right: "Supported" },
          { left: "WAF integration", right: "Yes" },
          { left: "Authentication", right: "Cognito / OIDC" },
          {
            left: "Sticky sessions",
            right: "Yes (duration-based or app-based)",
          },
        ]),
      ],
    },
    {
      id: "nlb",
      title: "NLB Features",
      questions: [
        match("06-nl-m1", "Match each NLB feature.", [
          { left: "Layer", right: "4 (TCP/UDP/TLS)" },
          { left: "Static IPs", right: "One per AZ + EIP support" },
          {
            left: "Performance",
            right: "Millions of req/sec, ultra-low latency",
          },
          { left: "Preserves source IP", right: "Yes" },
          { left: "Cross-zone load balancing", right: "Optional (paid)" },
        ]),
        tf(
          "06-nl-1",
          "NLB preserves the original client source IP.",
          true,
          "Targets see the client IP directly.",
        ),
      ],
    },
    {
      id: "gwlb",
      title: "Gateway Load Balancer",
      questions: [
        match("06-gw-m1", "Match each GWLB fact.", [
          { left: "Layer", right: "3 (GENEVE on port 6081)" },
          {
            left: "Use case",
            right: "Transparent insertion of firewalls/IDS/IPS",
          },
          {
            left: "Combines with",
            right: "GWLB endpoints for traffic redirection",
          },
        ]),
        mcq(
          "06-gw-1",
          "Centralize 3rd-party firewall inspection across VPCs:",
          ["NLB", "ALB", "GWLB", "CloudFront"],
          2,
          "GWLB is built for L3 appliance insertion.",
        ),
      ],
    },
    {
      id: "hybrid",
      title: "Hybrid Connectivity",
      questions: [
        match("06-hy-m1", "Match each hybrid connectivity option.", [
          {
            left: "Site-to-Site VPN",
            right: "IPSec over internet, quick setup",
          },
          {
            left: "Direct Connect",
            right: "Dedicated private link, takes weeks",
          },
          { left: "DX + VPN", right: "Private link with encryption" },
          { left: "Client VPN", right: "Managed OpenVPN remote user access" },
          {
            left: "Transit Gateway",
            right: "Hub-and-spoke for many VPCs / DCs",
          },
          { left: "AWS Cloud WAN", right: "Managed global wide-area network" },
        ]),
        mcq(
          "06-hy-1",
          "Consistent low-latency 10 Gbps between DC and AWS:",
          ["Site-to-Site VPN", "Direct Connect", "Internet", "Client VPN"],
          1,
          "DX = dedicated bandwidth, predictable latency.",
        ),
        tf(
          "06-hy-2",
          "Direct Connect is encrypted by default.",
          false,
          "DX is private but NOT encrypted; add VPN over DX for encryption.",
        ),
      ],
    },
    {
      id: "r53-records",
      title: "Route 53 Record Types",
      questions: [
        match("06-r-m1", "Match each record type.", [
          { left: "A", right: "IPv4 address" },
          { left: "AAAA", right: "IPv6 address" },
          { left: "CNAME", right: "Alias to another DNS name (not apex)" },
          { left: "Alias", right: "AWS-only, free, works at apex" },
          { left: "MX", right: "Mail server" },
          { left: "TXT", right: "Text records (SPF/DKIM)" },
          { left: "NS", right: "Name servers for delegation" },
          { left: "PTR", right: "Reverse DNS" },
        ]),
        mcq(
          "06-r-1",
          "Point example.com (apex) to CloudFront:",
          ["CNAME", "Alias A", "TXT", "MX"],
          1,
          "CNAME cannot be at apex. Use Alias.",
        ),
      ],
    },
    {
      id: "r53-policies",
      title: "Route 53 Routing Policies",
      questions: [
        match("06-rp-m1", "Match each routing policy.", [
          { left: "Simple", right: "Single record" },
          { left: "Weighted", right: "% split traffic (A/B testing)" },
          { left: "Latency", right: "Lowest latency region for user" },
          { left: "Failover", right: "Active/passive based on health checks" },
          { left: "Geolocation", right: "Route by user country/continent" },
          {
            left: "Geoproximity",
            right: "Route based on bias/distance (Traffic Flow)",
          },
          {
            left: "Multi-Value Answer",
            right: "Return multiple healthy IPs (mini-LB)",
          },
          { left: "IP-based", right: "Route based on client CIDR" },
        ]),
        mcq(
          "06-rp-1",
          "A/B test new app version with 10% of users:",
          ["Latency", "Weighted", "Geolocation", "Failover"],
          1,
          "Weighted lets you split traffic by %.",
        ),
        mcq(
          "06-rp-2",
          "Send EU users to eu-west-1 always:",
          ["Latency", "Geolocation", "Weighted", "Failover"],
          1,
          "Geolocation routes by user location.",
        ),
      ],
    },
    {
      id: "cloudfront",
      title: "CloudFront",
      questions: [
        match("06-cf-m1", "Match each CloudFront concept.", [
          { left: "Edge locations", right: "450+ PoPs globally" },
          { left: "Origin", right: "S3 / ALB / EC2 / custom / MediaStore" },
          { left: "OAC", right: "Restrict S3 origin to CloudFront" },
          { left: "Signed URL / Cookies", right: "Private content access" },
          { left: "Lambda@Edge", right: "Run code at edge (more capable)" },
          {
            left: "CloudFront