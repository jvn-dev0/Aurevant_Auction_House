# ChronoBid Vault — Architecture Decision Record (ADR-P3-001)
## Production System Topology, Concurrency Architecture & Technology Stack

> **Document Type:** Architectural Decision Record (ADR) & System Topology Evaluation  
> **Project:** ChronoBid Vault — Curated Fine Horology & Global Multi-Category Auction Marketplace  
> **Working Directory:** `C:\Users\kbjee\OneDrive\Desktop\omniroute\auction system`  
> **Date:** 20 October 2026  
> **Author:** Senior Solutions Architect, Principal Systems Engineer, Senior Project Manager  
> **Status:** **PROPOSED — PENDING PROJECT OWNER APPROVAL**  
> **Governance Directive:** **NO PRODUCTION CODE OR CLOUD INFRASTRUCTURE AUTHORIZED BY THIS DESIGN**  

---

## 1. Context & Business Drivers

ChronoBid Vault is an international curated auction platform for rare horological timepieces and multi-category collectibles. The core value proposition relies on:
1. **Pre-Funded Vault Integrity:** Zero bad-debt bidding. Bids must be backed by cleared or eligible funds before acceptance.
2. **Server-Authoritative Anti-Sniping:** Accurate, synchronized soft-close clock enforcement (120-second extension trigger, 10-extension hard cap per ADR-012) under high-concurrency late-bidding spikes.
3. **Low-Latency Global Saleroom:** Sub-millisecond broadcast of incoming bids and timer ticks to concurrent global collectors.
4. **Editorial Luxury Presentation:** Bespoke publication aesthetic running on the Next.js App Router (Phase 2 prototype baseline).

In Phase 2, these behaviors were simulated entirely client-side. Phase 3 defines the production backend architecture to replace client simulations with server-authoritative, fault-tolerant, scalable systems.

---

## 2. Architecture Candidates Evaluated

Three primary structural patterns were evaluated for ChronoBid Vault:

```
+---------------------------------------------------------------------------------------------------------+
|                                    CANDIDATE ARCHITECTURE COMPARISON                                    |
|                                                                                                         |
|   [OPTION 1: Polyglot Dual-Service]    [OPTION 2: Unified TypeScript Monolith]   [OPTION 3: Microservices]
|   - Node.js API (Rest/Ledger)          - Unified Fastify / Next.js Modular       - Decoupled Services     |
|   - Go WebSocket Saleroom Gateway       Monolith (API + WebSockets)              - gRPC / Kafka Backbone   |
|   - Redis Pub/Sub + Postgres           - Redis Pub/Sub + Postgres                - High Overhead          |
+---------------------------------------------------------------------------------------------------------+
```

### Option 1: Polyglot Dual-Service (Proposed in Initial Draft)
- **Structure:** Core REST/GraphQL API written in Node.js (TypeScript/Fastify); live saleroom WebSocket gateway written in Go; inter-service communication via Redis Pub/Sub and internal HTTP; shared PostgreSQL database.
- **Advantages:** Go's lightweight goroutines handle high-concurrency WebSockets (10,000+ connections per node with <100MB RAM); low memory footprint; isolated saleroom crash domain.
- **Disadvantages:** Polyglot stack requires maintaining two separate toolchains, CI/CD pipelines, Docker environments, and duplicate data models (Go structs vs. TypeScript interfaces); complex local development setup; team cognitive overhead.

### Option 2: Unified TypeScript Modular Monolith (Simpler Alternative)
- **Structure:** Single TypeScript codebase running on Node.js (Fastify) with dedicated worker processes for WebSockets (`fastify-websocket` or `@fastify/websocket` with `ws`); shared types with Next.js frontend; domain modules (Auth, Vault, Auctions, Settlements) separated logically within a monorepo; Redis Pub/Sub for horizontal scaling; Aurora PostgreSQL.
- **Advantages:** Single language (TypeScript) from database queries (Prisma/Drizzle/Kysely) to frontend components; single deployment pipeline; shared validation schemas (Zod); trivial local development (`npm run dev`); lower operational complexity and developer headcount requirements.
- **Disadvantages:** Node.js event loop requires care to prevent CPU-intensive tasks (e.g., cryptographic hashing, large JSON parsing) from blocking WebSocket frame delivery; higher RAM usage (~500MB per 10k idle connections vs. ~100MB in Go).

### Option 3: Fully Decoupled Microservices
- **Structure:** Independent deployable microservices: `Auth-Service`, `Vault-Ledger-Service`, `Saleroom-Bidding-Service`, `Catalog-Service`, `Settlement-Service`, and `Notification-Service` communicating via gRPC and Apache Kafka.
- **Advantages:** Independent horizontal scaling per domain; granular team ownership.
- **Disadvantages:** Massive operational overhead (Kubernetes ingress, service mesh, distributed tracing, distributed transactions / Saga pattern for cross-service financial operations); extreme overkill for ChronoBid Vault's debut launch volume; high infrastructure cost.

---

## 3. Deep Comparative Trade-Off Analysis

| Dimension | Option 1: Polyglot (Go + Node) | Option 2: Unified TypeScript Monolith (Recommended) | Option 3: Full Microservices |
| :--- | :--- | :--- | :--- |
| **Operational Complexity** | Medium (2 builds, 2 runtimes, 2 CI pipelines) | **Low** (Single runtime, single Docker image) | Very High (6+ pipelines, Kafka, service mesh) |
| **Time to Market** | Medium (3–4 months for backend MVP) | **Fastest** (2–3 months for backend MVP) | Slowest (6–9 months for backend MVP) |
| **Type Safety & Models** | Partial (Manual drift prevention between Go/TS) | **100% End-to-End Type Safety** (Zod & Drizzle) | Low (Protobuf/gRPC codegen required) |
| **Local Dev Experience** | Requires Go compiler + Node + Docker Compose | Pure `npm run dev` with Dockerized Postgres/Redis | Heavy local orchestration (Minikube / Tilt) |
| **Concurrency Ceiling** | 50,000+ sockets per server node | 10,000–15,000 sockets per server node | 50,000+ sockets per server node |
| **Memory Footprint** | Extremely Low (~100MB per 10k sockets) | Moderate (~400–600MB per 10k sockets) | High across multiple service pods |
| **Financial Consistency** | Shared DB access requires careful coordination | **Single ACID transaction context** for ledger | Distributed Saga pattern (risk of partial failure) |
| **Estimated Infra Cost** | ~$350–$600 / month (Dev/Staging/Prod) | **~$200–$400 / month** (Dev/Staging/Prod) | ~$1,500–$3,500+ / month (Base footprint) |

---

## 4. Final Architectural Recommendation & Phased Scaling Strategy

### 4.1 Recommended Baseline: Unified TypeScript Modular Monolith (Option 2)
The Senior Solutions Architect recommends **Option 2 (Unified TypeScript Modular Monolith)** as the production foundation for Phases 4 through 6, with an explicit architectural trigger for extracting a Go gateway if scaling thresholds are crossed.

**Why this is justified:**
1. **Financial Ledger Integrity Takes Precedence Over Socket Scale:** ChronoBid Vault is a high-value, curated auction platform (1 to 20 lots per auction), not a retail flash-sale site selling 100,000 items a second. The greatest existential technical risk is **ledger inconsistency, race conditions, or double-spending**, not raw WebSocket throughput. Option 2 allows the Pre-Funded Vault ledger, bid validation, and database transactions to execute within a single ACID transaction context in PostgreSQL without distributed transaction coordination.
2. **Team Velocity & Model Sharing:** Using TypeScript across Next.js, Fastify APIs, and database models guarantees that validation schemas (Zod), currency multipliers, bid increment ladders, and error structures remain identical without synchronization drift.
3. **Sufficient Concurrency Capacity:** Modern Node.js with the `ws` engine comfortably handles 10,000 concurrent WebSocket connections per instance. Two load-balanced ECS Fargate containers (1 vCPU, 2GB RAM each) can easily serve 15,000 concurrent collectors during marquee auctions, costing less than $60/month.

### 4.2 Explicit Extraction Trigger (Path to Option 1)
If and when platform metrics reach the following triggers during future operation:
- Peak concurrent active connections exceed **15,000 per saleroom instance**, OR
- Node.js event-loop latency p99 exceeds **25ms** during live bidding, OR
- International multi-room auctions require distributed edge WebSocket termination in Frankfurt, Tokyo, and New York simultaneously:

The saleroom gateway module (`src/modules/saleroom/ws`) is designed with clean domain boundaries, allowing it to be surgically extracted into a standalone Go service with zero refactoring of the Pre-Funded Vault ledger or Core API.

---

## 5. Production Topology & Component Responsibilities

```
                                    PRODUCTION ARCHITECTURE TOPOLOGY
                                    
   [Web Browser Client]         [Mobile Client]           [Specialist Admin Client]
            |                          |                              |
            +--------------------------+------------------------------+
                                       |
                           [Cloudflare Enterprise Edge]
                           - WAF & DDoS Shield
                           - Turnstile Anti-Bot Verification
                           - SSL/TLS Termination (HTTP/3)
                                       |
                                       v
                    [AWS Application Load Balancer (ALB)]
                        (Path & Header-Based Routing)
                         /                          \
            (Path: /api/*, /auth/*)          (Path: /ws/* [Upgrade: websocket])
                       /                              \
                      v                                v
     [Fastify Core API Worker Pods]         [Fastify Saleroom WS Worker Pods]
     - Auth & Session Management            - WebSocket Connection Pool
     - Pre-Funded Vault Ledger              - Server-Authoritative Clock (NTP)
     - Consignment & Catalog Domain         - Soft-Close Timer State Machine
     - Settlement & Invoicing               - Sequence Number Generator
                      \                                /
                       \                              /
                        v                            v
               +----------------------------------------------+
               |         Amazon ElastiCache for Redis         |
               |         - Redlock Distributed Locking        |
               |         - Saleroom Channel Pub/Sub           |
               |         - Session & Rate-Limiting Store      |
               +----------------------------------------------+
                                       |
                                       v
                 +--------------------------------------------+
                 |    Amazon Aurora PostgreSQL (Multi-AZ)     |
                 |    - ACID Relational Database              |
                 |    - Row-Level Locking (SELECT FOR UPDATE) |
                 |    - Immutable Double-Entry Ledger Tables  |
                 |    - Automated Point-in-Time Recovery      |
                 +--------------------------------------------+
```

### 5.1 Component Domain Boundaries
1. **Frontend Presentation (`apps/web`):** Next.js 14 App Router. Renders editorial UI, communicates via HTTPS with API Gateway and WSS with Saleroom Gateway. Zero business logic or financial calculations.
2. **Core API Service (`apps/api`):** Fastify REST API. Handles user registration, Google OAuth OIDC callbacks, KYC document uploads, deposit/withdrawal requests, catalog browsing, and consignment intake.
3. **Saleroom WebSocket Engine (`apps/api/saleroom`):** Dedicated Fastify WebSocket cluster. Maintains stateful connections, streams real-time bids, executes NTP-synchronized soft-close extensions, and broadcasts saleroom events.
4. **Pre-Funded Vault Ledger Service (`apps/api/vault`):** Internal domain service. Enforces atomic reservations, releases outbid funds, executes settlement escrows, and generates double-entry journal records.
5. **Persistence & Cache Layer:**
   - **PostgreSQL:** Canonical source of truth for accounts, ledger entries, lots, and bids.
   - **Redis:** High-speed lock coordination (`lock:lot:[id]`), channel pub/sub, active user presence, and token rate limiting.

### 5.2 Essential Launch Scope vs. Optional Future Infrastructure

To prevent infrastructure over-spend and unnecessary operational complexity, production deployment is strictly phased into **Essential Launch Infrastructure** and **Optional Future Enterprise Infrastructure**:

| Layer | Essential Launch Scope (Debut Auction MVP) | Optional / Deferred for Scale (Future Phases) |
| :--- | :--- | :--- |
| **Edge & CDN** | **Cloudflare Pro / Business Tier ($20–$200/mo)**<br>Provides automated DDoS mitigation, WAF rules, SSL/TLS 1.3, and Turnstile anti-bot checks. | **Cloudflare Enterprise ($3,000+/mo)**<br>Custom enterprise SLAs, dedicated edge IP pools, and bespoke rate limiting; deferred until monthly gross sales warrant contract minimums. |
| **Real-Time Engine** | **Fastify Modular Monolith on Node.js 22 LTS**<br>Shared TypeScript models, single deployment pipeline, comfortable 15k socket capacity across 2 Fargate tasks. | **Extracted Go Saleroom Gateway**<br>Deferred until saleroom concurrency exceeds 15,000 sockets or event-loop lag exceeds 25ms (documented in Section 4.2). |
| **Relational Data** | **PostgreSQL 16 (Aurora Single-AZ or Standard RDS Multi-AZ)**<br>ACID compliance, row-level locks, point-in-time recovery for debut auction catalogue (1–20 lots). | **Global Aurora Multi-Region Database Clusters**<br>Active-active multi-region replication; deferred until international cross-continental salerooms operate simultaneously. |
| **In-Memory Cache** | **ElastiCache Redis 7.2 (Single Primary + Replica)**<br>Distributed locking (`Redlock`), channel pub/sub, ephemeral 15-second WebSocket tickets, and rate-limiting. | **Multi-Shard Distributed Redis Cluster**<br>Multi-node key-sharding cluster; deferred until active socket connections exceed 25,000 collectors. |
| **Message Broker** | **Internal Redis Pub/Sub Engine**<br>Sub-millisecond bid broadcast and state event propagation within the modular monolith. | **Apache Kafka / AWS Kinesis**<br>Heavy distributed event streaming; deferred until high-volume event sourcing and analytics pipelines are needed. |

#### 5.2.1 Infrastructure Cost Modeling & Excluded Variable Costs
> [!WARNING]
> **PRELIMINARY ARCHITECTURAL COST NOTICE:**  
> The baseline estimate of **$300 to $500 per month** represents a preliminary, configuration-dependent architectural model for baseline compute and database storage in a single AWS region. It is **NOT** a formal vendor quotation. Actual operating costs will vary based on traffic, storage volume, and networking topology.

The baseline model explicitly excludes the following variable and operational expenses:
1. **AWS NAT Gateways:** ~$32.40/month per Availability Zone ($64.80/mo for Multi-AZ) plus $0.045/GB data processing fees for private subnet internet egress.
2. **Data Transfer Egress (Bandwidth):** High-resolution 4:5 horological macro-photography and provenance dossiers served from CloudFront/S3 (typically $0.085/GB in North America/Europe).
3. **Cross-AZ Network Traffic:** Inter-service data transit between ECS containers and ElastiCache/Aurora across AZ boundaries ($0.01/GB).
4. **AWS KMS & Secrets Manager:** AWS KMS Customer Managed Keys ($1/month/key) plus $0.03 per 10,000 cryptographic operations; AWS Secrets Manager ($0.40/secret/month).
5. **Observability & Logging:** CloudWatch custom metrics ($0.30/metric/mo), log ingestion ($0.50/GB), and log retention; Datadog / Sentry APM SaaS subscriptions.
6. **Third-Party SaaS Per-Unit Charges:**
   - Identity Management (Clerk Enterprise / Auth0: ~$0.05–$0.15 per Monthly Active User).
   - Identity KYC & Sanctions Screening (Persona: ~$1.50–$3.00 per verified identity check).
   - Transactional Email (Postmark / SendGrid: ~$15–$50/mo depending on volume).
7. **Multi-Environment Multipliers:** Running separate, isolated Staging and Quality Assurance environments will increase base cloud infrastructure spend by 1.5x to 2.0x.

---

## 6. Hosting, Availability, Backups & Disaster Recovery

### 6.1 High Availability Architecture
- **Multi-AZ Redundancy:** All services run across at least 2 AWS Availability Zones (`eu-central-1a` and `eu-central-1b`).
- **Database Failover:** Aurora PostgreSQL Multi-AZ with automated storage replication and sub-30-second primary instance failover.
- **Stateless Application Tier:** ECS Fargate tasks auto-scale based on CPU utilization and WebSocket connection counts.

### 6.2 Backup & Recovery Objectives
- **Recovery Point Objective (RPO):** **< 1 minute.** Aurora continuous backups stream transaction write-ahead logs (WAL) to Amazon S3. Point-in-time recovery (PITR) is maintained for 35 days.
- **Recovery Time Objective (RTO):** **< 15 minutes.** Infrastructure is fully defined in Terraform; automated CI/CD can redeploy the entire application tier to a secondary region if a catastrophic regional failure occurs.
- **Saleroom Crash Recovery Protocol:** If a saleroom WebSocket node crashes mid-auction:
  1. The load balancer redistributes connections to remaining healthy nodes within 3 seconds.
  2. Clients automatically reconnect using exponential backoff with jitter.
  3. Reconnecting clients request `AUCTION_SYNC` with their last received sequence number.
  4. The server re-hydrates saleroom state and active deadline directly from Redis/Postgres and broadcasts the authoritative clock, resuming the auction without lost bids.

---

## 7. Status & Approval Governance

> **ADR STATUS:** **PROPOSED — PENDING OWNER APPROVAL**  
> **NEXT GOVERNANCE ACTION:** Project Owner review of unified modular monolith recommendation.  
> **IMPLEMENTATION NOTE:** Authorizing this ADR does not authorize code generation. Implementation begins only upon Phase 4 written authorization.

---
*Certified by Senior Solutions Architect, ChronoBid Vault.*  
*Timestamp: 2026-10-20T06:00:00Z*
