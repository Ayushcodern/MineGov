<div align="center">
  <img src="docs/MineGOV_Logo.webp" alt="MineGOV Logo" width="180" style="border-radius: 24px; margin-bottom: 12px;" />
  <h1>🇮🇳 MineGOV — CoalMine Governance & Intelligence Platform</h1>

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-3.5_Flash_Vision-8E75C2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![DGMS Compliant](https://img.shields.io/badge/DGMS-CMR_2017_Compliant-FF6B6B?style=for-the-badge)](https://dgms.gov.in/)
[![Download APK](https://img.shields.io/badge/Download-MineGov.apk_v1.0.0-22c55e?style=for-the-badge&logo=android&logoColor=white)](https://github.com/Ayushcodern/MIneGov/raw/main/releases/MineGov.apk)

</div>

> **Next-Generation Governance, Real-Time Compliance Audit, AI Hazard Forecasting & Offline-First Field Safety System for the Indian Coal Mining Sector.**

---

## 📌 Executive Summary

**MineGOV** is an enterprise-grade, mobile-first intelligence platform built to eliminate administrative silos and prevent underground and opencast coal mining hazards across Indian collieries. 

Built in alignment with statutory mandates of the **Directorate General of Mines Safety (DGMS)**, the **Coal Mines Regulations (CMR) 2017**, and the **Mines Act 1952**, MineGOV delivers real-time compliance enforcement, tamper-proof forensic evidence logging (SHA-256), AI-powered vision OCR in Hindi & English, geofenced inspection locking, dynamic coal consignment tracking via QR codes, and automated escalation governance.

---

## 📸 Application Screenshots & Showcase

| 1. Field Officer Dashboard & ESG Scorecard | 2. Step 1: GPS Geofence Verification | 3. Step 2: CMR 2017 Safety Checklist |
| :---: | :---: | :---: |
| <img src="docs/screenshots/01_dashboard_esg_overview.png" width="280" alt="Dashboard & ESG Scorecard" /> | <img src="docs/screenshots/02_inspection_geofence_lock.png" width="280" alt="GPS Geofence Verification" /> | <img src="docs/screenshots/03_safety_checklist_cmr.png" width="280" alt="Safety Checklist" /> |
| *Active inspection duty, real-time ESG metrics (87.6/100), and Mine Risk Heat Grid* | *Mine location selection & real-time GPS boundary verification lock* | *20-point standard CMR 2017 safety checklist with instant Pass/Fail audit counters* |

| 4. Step 3: Multimedia Evidence & Bilingual OCR | 5. Officer Profile & Offline Sync Queue |
| :---: | :---: |
| <img src="docs/screenshots/04_multimedia_evidence_ocr.png" width="280" alt="Multimedia Evidence & Gemini OCR" /> | <img src="docs/screenshots/05_profile_sync_settings.png" width="280" alt="Officer Profile & Offline Sync" /> |
| *Geotagged coordinate stamp & Google Gemini AI bilingual handwritten log OCR* | *Officer authentication identity, offline task sync queue dispatcher, theme & language controls* |

---

## 🎥 Video Walkthrough & Live Demo

<!-- Embed your demonstration video here or link to YouTube / Loom -->

[![MineGOV Demo Video](https://placehold.co/1280x720/1A202C/ffffff?text=▶+Click+to+Watch+MineGOV+Complete+System+Demo)](https://youtube.com)

> 📹 **Walkthrough Highlights:**
> - Zero-network underground inspection logging & background auto-sync.
> - Capturing handwritten Hindi/English shift logs and instant Gemini OCR text ingestion.
> - Dynamic Coal Consignment QR generation and Weighbridge shortage alert generation.
> - Multi-role switching across Field Inspector, Operations Manager, Compliance Officer, and DGMS Regulator.

---

## 🏗️ System Architecture & Module Interconnections

MineGOV is engineered with a **multi-tiered, offline-resilient, edge-to-cloud architecture** specifically designed for extreme underground mining environments with intermittent or zero network connectivity.

### 1. High-Level Layered System Architecture

```mermaid
graph TB
    %% STYLES
    classDef client fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef edge fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef ai fill:#2e1065,stroke:#a855f7,stroke-width:2px,color:#f8fafc;
    classDef offline fill:#1c1917,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef cloud fill:#022c22,stroke:#059669,stroke-width:2px,color:#f8fafc;
    classDef alert fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#f8fafc;

    subgraph PRESENTATION ["1. Presentation & Application Layer (React Native + Expo SDK 54)"]
        UI[MineGOV Mobile Client]:::client
        NAV[Role-Based Navigator - 6 Portals]:::client
        I18N[Bilingual Engine - i18next EN / हिन्दी]:::client
        THEME[Theme Engine - Light / Coal Dark]:::client
        DASH[Victory Native Analytics & ESG Heatmaps]:::client
    end

    subgraph EDGE_LAYER ["2. Edge Intelligence & Hardware Integration"]
        GEO[Expo Location - GPS Geofencing Lock]:::edge
        CAM[Expo Camera - Photo & Video Capture]:::edge
        CRYPTO[expo-crypto - SHA-256 Forensic Hashing]:::edge
        QR_ENG[react-native-qrcode-svg - Tamper-Proof QR Code Engine]:::edge
    end

    subgraph AI_CORE ["3. Multimodal AI & Regulatory Intelligence Layer"]
        GEMINI_OCR[Google Gemini 3.5 Flash Vision - Bilingual OCR]:::ai
        CMR_RULES[CMR 2017 Regulatory Expert System]:::ai
        RISK_PRED[Hazard Predictor - Methane, Strata & Water Sump]:::ai
    end

    subgraph OFFLINE_SYNC ["4. Offline-First Resilience & Synchronization Engine"]
        LOCAL_STORAGE[AsyncStorage - Encrypted Local Cache]:::offline
        FIFO_QUEUE[QueueStore - FIFO Action Queue]:::offline
        NET_MON[NetInfo - Network State Monitor]:::offline
        SYNC_DISPATCH[SyncService - Idempotent Batch Sync Dispatcher]:::offline
    end

    subgraph BACKEND_CLOUD ["5. Cloud Backend & Single Source of Truth (Supabase)"]
        AUTH_SVC[Supabase Auth & RBAC Token Validator]:::cloud
        POSTGRES[(PostgreSQL 15 Relational Core)]:::cloud
        RLS[Row Level Security Policies]:::cloud
        STORAGE[Supabase Encrypted Evidence Bucket]:::cloud
    end

    subgraph GOVERNANCE_DISPATCH ["6. Governance, Alert & Escalation Engine"]
        ALERT_BUS[Alert & Notification Bus]:::alert
        ESCALATION[Automated Escalation Service - DGMS SLA Timers]:::alert
        AUDIT_TRAIL[Immutable Audit Log Pipeline]:::alert
    end

    %% CONNECTIONS
    UI --> NAV
    UI --> I18N
    UI --> THEME
    UI --> DASH

    UI --> GEO
    UI --> CAM
    UI --> QR_ENG
    CAM --> CRYPTO

    CAM --> GEMINI_OCR
    UI --> CMR_RULES
    UI --> RISK_PRED

    UI --> LOCAL_STORAGE
    UI --> FIFO_QUEUE
    NET_MON --> SYNC_DISPATCH
    FIFO_QUEUE --> SYNC_DISPATCH

    SYNC_DISPATCH -->|TLS 1.3 / REST API| RLS
    RLS --> POSTGRES
    AUTH_SVC --> POSTGRES
    CRYPTO -.->|Hashed Proof| STORAGE

    POSTGRES --> ALERT_BUS
    ALERT_BUS --> ESCALATION
    POSTGRES --> AUDIT_TRAIL
```

---

### 2. Detailed Module & Subsystem Interconnection Flow

The diagram below maps every functional TypeScript service to its respective screen components, data stores, and backend endpoints:

```mermaid
graph LR
    %% Subgraphs
    subgraph SCREENS ["User Interface Screens"]
        S_LOG[LoginScreen]
        S_DASH[DashboardScreen]
        S_INSP[InspectionScreen]
        S_REG[ConsignmentRegistrationScreen]
        S_CHK[CheckpointScanScreen]
        S_ATT[AttendanceScreen]
        S_COMP[ComplianceReviewScreen]
        S_ALT[AlertsScreen]
        S_TSK[TasksScreen]
    end

    subgraph SERVICES ["Core Business Logic & Services"]
        SVC_AUTH[authService]
        SVC_INSP[inspectionService]
        SVC_AI[aiService]
        SVC_TRANS[transportService]
        SVC_ATT[attendanceService]
        SVC_COMP[complianceService]
        SVC_ALT[alertService]
        SVC_ESC[escalationService]
        SVC_AUD[auditService]
        SVC_SYNC[syncService]
        SVC_QUEUE[queueStore]
    end

    subgraph STORES ["Client Storage & Native APIs"]
        LOCAL_DB[AsyncStorage]
        NATIVE_CAM[Expo Camera & Crypto]
        NATIVE_GPS[Expo Location]
    end

    subgraph SUPABASE_DB ["Supabase PostgreSQL Tables"]
        T_USERS[(officers & profiles)]
        T_INSP[(inspections & checklist_items)]
        T_OBS[(observations & evidence_hashes)]
        T_CONS[(consignments & checkpoints)]
        T_ATT[(miner_attendance_logs)]
        T_ALERTS[(safety_alerts & escalations)]
        T_AUDIT[(audit_trails)]
    end

    %% Screen to Service Links
    S_LOG --> SVC_AUTH
    S_DASH --> SVC_COMP
    S_DASH --> SVC_ALT
    S_INSP --> SVC_INSP
    S_INSP --> SVC_AI
    S_REG --> SVC_TRANS
    S_CHK --> SVC_TRANS
    S_ATT --> SVC_ATT
    S_COMP --> SVC_COMP
    S_ALT --> SVC_ALT
    S_TSK --> SVC_INSP

    %% Service to Native/Store Links
    SVC_INSP --> NATIVE_GPS
    SVC_INSP --> NATIVE_CAM
    SVC_INSP --> SVC_QUEUE
    SVC_TRANS --> SVC_QUEUE
    SVC_ATT --> SVC_QUEUE
    SVC_QUEUE --> LOCAL_DB
    SVC_SYNC --> SVC_QUEUE

    %% AI Integrations
    SVC_AI -->|Base64 Image/Video| GEMINI_API[Google Gemini 3.5 Flash API]
    SVC_AI --> SVC_INSP

    %% Cross Service Links
    SVC_TRANS -->|Shortage > 0.5T| SVC_ALT
    SVC_ATT -->|Shift < 8h| SVC_ALT
    SVC_INSP -->|Critical Hazard| SVC_ALT
    SVC_ALT --> SVC_ESC
    SVC_INSP --> SVC_AUD
    SVC_COMP --> SVC_AUD

    %% Service to DB Links
    SVC_AUTH --> T_USERS
    SVC_SYNC --> T_INSP
    SVC_SYNC --> T_OBS
    SVC_SYNC --> T_CONS
    SVC_SYNC --> T_ATT
    SVC_ALT --> T_ALERTS
    SVC_ESC --> T_ALERTS
    SVC_AUD --> T_AUDIT
```

---

### 3. End-to-End Data Flow & Sequence Diagrams

#### A. Offline Underground Inspection & Background Replay Sync
```mermaid
sequenceDiagram
    autonumber
    actor Inspector as 👮 Field Inspector
    participant UI as InspectionScreen
    participant GPS as Expo Location
    participant Crypto as Expo Crypto (SHA-256)
    participant AI as aiService (Gemini)
    participant Queue as queueStore (AsyncStorage)
    participant Sync as syncService
    participant DB as Supabase PostgreSQL

    Inspector->>UI: Select Mine & Begin Inspection
    UI->>GPS: Request Current Coordinates
    GPS-->>UI: Coordinates (Lat, Long, Accuracy)
    UI->>UI: Verify GPS Geofence vs Mine Boundary (<= 1500m)
    Inspector->>UI: Complete 20-Point DGMS Safety Checklist
    Inspector->>UI: Capture Photo / Video Hazard Evidence
    UI->>Crypto: Compute SHA-256 Hash of Media File
    Crypto-->>UI: sha256_hash_digest
    UI->>AI: Send Image for Bilingual OCR & Rule Citation
    AI-->>UI: Extracted Text + CMR 2017 Hazard Classification
    
    alt Network Disconnected (Underground Shaft)
        UI->>Queue: Enqueue Inspection Action (FIFO Queue)
        Queue-->>UI: Queued Locally (Pending Sync)
        UI-->>Inspector: Show "Saved Offline - Auto Sync Pending"
    else Network Connected (Surface / Wi-Fi)
        UI->>DB: Direct Insert into inspections & observations
        DB-->>UI: 201 Created
    end

    Note over Sync,DB: Device returns to surface & reconnects to Network
    Sync->>Sync: NetInfo event: isConnected == true
    Sync->>Queue: Dequeue all pending items
    loop For each queued action
        Sync->>DB: Replay Mutation (Idempotent Payload + Hash)
        DB-->>Sync: Acknowledge & Persist Record
    end
    Sync->>Queue: Clear successfully synchronized items
```

#### B. Coal Consignment Weighbridge Discrepancy & Anti-Theft Workflow
```mermaid
sequenceDiagram
    autonumber
    actor Official as ⛏️ Mining Official (Source Pit)
    participant RegScreen as ConsignmentRegistrationScreen
    participant TransSvc as transportService
    participant QR as react-native-qrcode-svg
    actor Driver as 🚚 Dumper Driver
    actor ScaleOp as ⚖️ Weighbridge Officer (Destination)
    participant ScanScreen as CheckpointScanScreen
    participant AlertSvc as alertService
    participant EscSvc as escalationService
    participant DB as Supabase Cloud

    Official->>RegScreen: Enter Vehicle No, Coal Grade, Net Gross Weight (e.g., 32.5 T)
    RegScreen->>TransSvc: createConsignment(data)
    TransSvc->>QR: Generate Signed Cryptographic QR Payload
    QR-->>RegScreen: Display Dynamic Secure QR Gate Pass
    Official->>Driver: Issue Gate Pass & Dispatch Truck
    
    Driver->>ScaleOp: Arrive at Coal Washery / Siding Weighbridge
    ScaleOp->>ScanScreen: Scan Consignment QR Code
    ScanScreen->>TransSvc: parseAndVerifyPayload(qrData)
    ScaleOp->>ScanScreen: Record Destination Gross Weight (e.g., 30.8 T)
    ScanScreen->>TransSvc: recordCheckpoint(consignmentId, destWeight)
    
    Note over TransSvc: Compute Discrepancy: Delta = 32.5 T - 30.8 T = 1.7 T (> 0.5 T Threshold)
    
    alt Delta > 0.5 Tonnes (Shortage Detected)
        TransSvc->>AlertSvc: createAlert(Type: COAL_THEFT_SHORTAGE, Severity: HIGH)
        AlertSvc->>DB: Store Alert & Fire Real-Time WebSocket Event
        AlertSvc->>EscSvc: Trigger SLA Timer (Escalate to Vigilance Officer in 2h)
        ScanScreen-->>ScaleOp: 🚨 RED ALERT: Coal Pilferage / Weight Shortage Flagged!
    else Delta <= 0.5 Tonnes (Within Legal Tolerance)
        TransSvc->>DB: Update Consignment Status: DELIVERED_VERIFIED
        ScanScreen-->>ScaleOp: ✅ Green: Consignment Cleared & Reconciled
    end
```

#### C. Miner Labour Gate Attendance & Statutory Shift Enforcement (Mines Act 1952)
```mermaid
sequenceDiagram
    autonumber
    actor Miner as 👷 Colliery Worker
    actor Official as ⛏️ Mining Official / Gate Clerk
    participant AttScreen as AttendanceScreen
    participant AttSvc as attendanceService
    participant AlertSvc as alertService
    participant DB as Supabase Database

    Miner->>Official: Present Physical / Digital QR Miner ID
    Official->>AttScreen: Scan Miner QR Badge at Pithead Gate (Shift In)
    AttScreen->>AttSvc: recordShiftIn(minerId, pitId, timestamp)
    AttSvc->>DB: Insert attendance log (status: ACTIVE_UNDERGROUND)
    
    Note over Miner,Official: Shift Underway (e.g. Miner exits after 5.5 hours)
    
    Miner->>Official: Scan Out at Pithead Exit Gate
    Official->>AttScreen: Scan Miner QR Badge (Shift Out)
    AttScreen->>AttSvc: recordShiftOut(minerId, timestamp)
    AttSvc->>AttSvc: Compute Duration: 5.5 Hours
    
    alt Duration < 8.0 Hours (Statutory Breach - Mines Act 1952)
        AttSvc->>AlertSvc: triggerLabourViolation(minerId, duration, Reason: UNDER_SHIFT)
        AlertSvc->>DB: Log Labour Alert & Notify Shift Supervisor
        AttScreen-->>Official: ⚠️ Warning: Incomplete Shift (< 8.0h Statutory Limit)
    else Duration >= 8.0 Hours (Compliant Shift)
        AttSvc->>DB: Update Log: COMPLIANT_SHIFT_COMPLETED
        AttScreen-->>Official: ✅ Compliant Shift Completed
    end
```

---

### 4. Comprehensive Module Interconnection & Interface Matrix

| Module Name | Key Source Files | Primary Inputs | Generated Outputs | Connected Modules | Communication Protocol |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | `authService.ts`, `LoginScreen.tsx`, `AppNavigator.tsx` | Badge ID, Password, Role | Auth Token, Session Object, Role Privileges | All Screens, `AppNavigator`, `Supabase Auth` | AsyncStorage + React Context |
| **Field Inspection & Audit** | `inspectionService.ts`, `InspectionScreen.tsx` | 20-Point Checklist, Mine GPS, Photos/Videos | Inspection Record, Hazard Score, Geo-Stamp | `aiService`, `queueStore`, `alertService`, `auditService` | TypeScript Direct Call + JSON Buffer |
| **Multimodal Vision AI** | `aiService.ts` | Media Base64 Strings, Shift Log Images | Bilingual OCR Text, CMR 2017 Citations, Risk Score | `inspectionService`, Google Gemini REST API | HTTPS REST (Generative Language API) |
| **Offline FIFO Queue & Sync** | `queueStore.ts`, `syncService.ts` | Offline Mutations, Network State (`NetInfo`) | Replayed DB Inserts/Updates, Sync Metrics | `inspectionService`, `transportService`, `attendanceService` | FIFO AsyncStorage Array + Supabase REST |
| **Coal Transport & Logistics** | `transportService.ts`, `ConsignmentRegistrationScreen.tsx`, `CheckpointScanScreen.tsx` | Coal Grade, Vehicle No, Gross/Tare Tonnage | Signed QR String, Weighbridge Delta, Theft Flag | `alertService`, `queueStore`, `auditService` | Cryptographic QR Payload + Supabase DB |
| **Miner Attendance & Welfare** | `attendanceService.ts`, `AttendanceScreen.tsx` | Miner Badge QR, Pithead Gate Timestamp | Shift Duration, Active Underground Count | `alertService`, `queueStore`, `Supabase DB` | Local Calculation + REST Replay |
| **Alerts & SLA Escalation** | `alertService.ts`, `escalationService.ts`, `AlertsScreen.tsx` | Anomaly Triggers (Theft, Hazard, Labour) | Tiered Alerts, Push Notifications, SLA Timers | `complianceService`, `DashboardScreen`, Supabase `safety_alerts` | WebSocket Realtime + Cron Dispatch |
| **ESG & Executive Dashboard** | `DashboardScreen.tsx`, `complianceService.ts` | Multi-mine Aggregated Metric Records | Sustainability Index (0-100), Heatmap Grids | `victory-native`, `complianceService`, `authService` | Relational SQL Aggregation Queries |
| **Forensic Audit Logging** | `auditService.ts` | Officer Action, Entity ID, Before/After Snapshot | Tamper-Proof Audit Record, Device Fingerprint | All Mutating Services, `audit_trails` Table | Write-Only Append Pipeline |

---

## 🛠️ Comprehensive Tech Stack

| Domain | Technology / Library | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | `React Native 0.74+` with `Expo SDK 54` | Cross-platform (Android, iOS, Web) native performance |
| **Language** | `TypeScript 5.0+` | End-to-end type safety and deterministic code execution |
| **Backend & Cloud DB** | `Supabase` (PostgreSQL) | Managed scalable relational database with RLS policies |
| **AI / Computer Vision** | `Google Gemini 3.5 Flash-Lite` | Zero-shot multilingual OCR, handwriting analysis & CMR citation |
| **Cryptographic Integrity** | `expo-crypto` | Strict SHA-256 hashing for photo/video tamper-evident audits |
| **Geospatial & Lock** | `expo-location` | Enforces GPS geofence proximity verification at pithead |
| **Offline Resilience** | `@react-native-async-storage` + NetInfo | Seamless offline queue execution for underground zero-reception mines |
| **Data Visualization** | `victory-native` | Interactive Mine Risk Heat Grids & ESG compliance trends |
| **QR Code Engine** | `react-native-qrcode-svg` | Real-time generation of digital transport and miner identity badges |
| **Localization** | `i18next` + `react-i18next` | Instant reactive switching between Hindi (हिन्दी) & English |
| **Export & Reporting** | `expo-file-system/legacy` + `expo-sharing` | On-device JSON/PDF generation for statutory DGMS inspection audits |

---

## 👥 6 Dedicated Officer Roles & Governance Portals

MineGOV automatically adapts UI workflows, privileges, and action cards based on the authenticated officer:

```
+---------------------------------------------------------------------------------------------------------+
|                                    MINEGOV GOVERNANCE HIERARCHY                                         |
+---------------------+-------------------------------+---------------------------------------------------+
| Role Designation    | Default Officer               | Core Responsibilities & Modules                   |
+---------------------+-------------------------------+---------------------------------------------------+
| 👮 Field Inspector   | Rajesh Sharma (INSP-IND-101)  | Live GPS Inspections, 20-item checklist, OCR, video |
| ⛏️ Mining Official   | Priya Nair (OFF-IND-202)      | Weighbridge QR scan, Shift attendance, Dispatch   |
| 🛡️ Compliance Officer| Sunita Deshmukh (COMP-IND-404)| Inspection report signoff, PPT rule matrices       |
| 🏗️ Contractor Lead  | Amit Verma (CONT-IND-303)     | Corrective task resolution (Inspection restricted)|
| 📊 Corporate ESG    | Vikram Malhotra (CORP-IND-505)| Multi-mine ESG scorecard, Risk heat grid analytics|
| 🏛️ DGMS Regulator   | Dr. Alok Kumar (DGMS-IND-606) | Statutory safety violation orders, audit exports  |
+---------------------+-------------------------------+---------------------------------------------------+
```

---

## ✨ Key Feature Highlights

### 1. 🌐 Instant Bilingual Localization (English & हिन्दी)
- Full app-wide translation encompassing all bottom tabs, navigation headers, checklist items, AI severity badges, and alert cards.
- Fast one-tap `EN / हिन्दी` switch in the header and profile settings.

### 2. 📄 Gemini AI Vision Document OCR
- Extract printed notices, daily safety shift logs, and handwritten observations in English or Hindi directly from photos or gallery uploads.
- Automatically inserts extracted text into field observation notes tagged `[AI-extracted, requires human review]`.

### 3. 📹 Forensic Multimedia Evidence (SHA-256)
- Geotagged photo capture with mine coordinate overlays.
- 30-second video evidence capture stamped with irreversible SHA-256 cryptographic hashes to prevent post-incident tampering.

### 4. 📶 Underground Offline-First Architecture
- Automatic detection of network disconnection (e.g. entering deep underground shafts).
- Field audits, checklists, and QR scans are queued into a local FIFO buffer and automatically synchronized to Supabase PostgreSQL upon returning to the surface.

### 5. 🚚 Digital Coal Logistics & Weighbridge QR Anti-Theft
- **Source Registration:** Creates cryptographically structured QR passes for coal dumpers.
- **Weighbridge Checkpoint Scan:** Validates gross tonnage at destination. Shortages exceeding `0.5 Tonnes` immediately trigger a **Coal Theft / Weight Deviation Alert**.

### 6. 👷 Miner Shift Attendance & Safety Law Enforcement
- QR gate check-in / check-out for underground miners.
- Automated shift duration tracking that fires **Labour Rule Violation Alerts** if a worker is recorded working less than the statutory 8.0-hour mandatory shift (*Mines Act 1952*).

### 7. 📊 Clean ESG Sustainability Scorecard
- Real-time rating (`Grade A - High Sustainability`) with sub-metric breakdowns across Safety (92%), Compliance (88%), Environmental (81%), and Welfare (85%).

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0+`
- **npm** or **yarn**
- **Expo Go App** installed on your Android / iOS smartphone.

### Step 1: Clone Repository
```bash
git clone https://github.com/Ayushcodern/MIneGov.git
cd MIneGov/cm-gip-mobile
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file inside `cm-gip-mobile/`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
EXPO_PUBLIC_GEMINI_API_KEY=<your-google-gemini-api-key>
```

### Step 4: Run the Application
```bash
# Clear Metro cache and launch Expo Dev Server
npx expo start -c
```
- Scan the printed QR code using the **Expo Go** mobile app.
- For Web Browser testing: press `w` or run `npm run web`.

---

## 🗄️ Database Schema & Seeding

The complete database schema is provided in [`supabase_schema.sql`](file:///d:/sihminegov/minegov/MineGOV/supabase_schema.sql).

To deploy:
1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Paste and run the contents of [`supabase_schema.sql`](file:///d:/sihminegov/minegov/MineGOV/supabase_schema.sql).
3. Paste and run [`seed_demo_officers.sql`](file:///d:/sihminegov/minegov/MineGOV/seed_demo_officers.sql) to initialize authentic Indian officer credentials.

---

## 🧪 Demo Credentials & Testing Matrix

**Universal Password for All Demo Accounts:** `Demo@1234`

| Role | Username / Badge ID | Official Email |
| :--- | :--- | :--- |
| **Field Inspector** | `RAJESH_INSPECTOR` (or `OFF-001`) | `rajesh.sharma@minegov.in` |
| **Mining Official** | `PRIYA_OFFICIAL` (or `OFF-002`) | `priya.nair@minegov.in` |
| **Compliance Officer** | `SUNITA_COMPLIANCE` (or `OFF-004`) | `sunita.deshmukh@minegov.in` |
| **Contractor Lead** | `AMIT_CONTRACTOR` (or `OFF-003`) | `amit.verma@apexheavy.in` |
| **Corporate ESG** | `VIKRAM_CORP` (or `OFF-005`) | `vikram.malhotra@cil.gov.in` |
| **DGMS Regulator** | `ALOK_REGULATOR` (or `OFF-006`) | `alok.kumar@dgms.gov.in` |

*(Tip: You can also use the one-tap **Quick Role Switcher Chips** directly on the Login screen!)*

---

## 📜 Statutory Standards & Regulatory Compliance

MineGOV is architected in accordance with statutory requirements established by the Ministry of Coal and DGMS:
- **Coal Mines Regulations (CMR) 2017:** Reg 141 (Ventilation & Inflammable Gas), Reg 54 (Signage & Access), Reg 108 (Strata Control & Support).
- **Mines Act 1952:** Section 28 & 30 (Mandatory Shift Durations & Labour Welfare).
- **DGMS Circulars on Digital Safety:** Forensic tamper-evident inspection logging & verifiable audit trails.

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Acknowledgments
- **Ministry of Coal, Government of India**
- **Directorate General of Mines Safety (DGMS)**
- **Smart India Hackathon (SIH)**
