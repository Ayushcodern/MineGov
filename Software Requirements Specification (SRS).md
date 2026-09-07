<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Software Requirements Specification (SRS)

## AI-Enabled Smart Governance \& Compliance Monitoring Platform for Coal Mines

**Document Version:** 1.0\
**Prepared For:** Ministry of Coal, Government of India\
**Prepared By:** [Your Organization/Team Name]\
**Date:** September 06, 2026\
**Classification:** Confidential

______________________________________________________________________

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the comprehensive requirements for developing a centralized AI-enabled governance and compliance monitoring platform specifically designed for the Indian coal mining ecosystem. The document serves as a binding agreement between stakeholders and the development team, providing a detailed blueprint for system design, development, testing, and deployment.[^1_1][^1_2][^1_3][^1_4]

### 1.2 Scope

The proposed system, named **CoalMine Governance Intelligence Platform (CM-GIP)**, will digitize and integrate all governance-related activities across coal mining operations including statutory compliance monitoring, inspection tracking, safety observations, production reporting, environmental monitoring, worker attendance, contract management, grievance handling, and regulatory reporting. The platform will replace fragmented systems, manual documentation, and spreadsheets with a unified digital ecosystem accessible through web and mobile applications, providing real-time visibility and data-driven insights to mine officials, corporate management, and regulatory authorities.[^1_2][^1_5][^1_1]

### 1.3 Intended Audience and Document Use

| Audience | Role | Document Usage |
| :-- | :-- | :-- |
| Project Sponsors (Ministry of Coal) | Decision-makers | Validate requirements alignment with policy objectives |
| Mine Officials \& Site Managers | End users | Understand system capabilities and workflows |
| Development Team | Designers \& Developers | Technical specification for implementation |
| QA/Testing Team | Testers | Basis for test case development and validation |
| Regulatory Authorities (DGMS) | Compliance auditors | Verify statutory compliance features |
| Contractors \& Field Staff | Mobile app users | Reference for field reporting procedures |

### 1.4 References

- ISO/IEC/IEEE 29148:2018 - Systems and software engineering requirements specification[^1_3][^1_4]
- The Mines Act, 1952 (Government of India)[^1_6][^1_7]
- Coal Mines Regulations, 2017 (DGMS)[^1_8][^1_9]
- Ministry of Coal IT \& Digitalisation Initiatives[^1_5][^1_10]
- Coal India Limited Digital Transformation Guidelines[^1_11][^1_12]


### 1.5 Definitions, Acronyms, and Abbreviations

| Term | Definition |
| :-- | :-- |
| **CM-GIP** | CoalMine Governance Intelligence Platform |
| **DGMS** | Directorate General of Mines Safety |
| **CIL** | Coal India Limited |
| **GIS** | Geographic Information System |
| **OCR** | Optical Character Recognition |
| **AI/ML** | Artificial Intelligence / Machine Learning |
| **GPS** | Global Positioning System |
| **VTS** | Vehicle Tracking System |
| **AQMS** | Air Quality Monitoring System |
| **ICCC** | Integrated Command and Control Centre |
| **CSIS** | Centralized Safety Information System |
| **CMSMS** | Coal Mines Surveillance \& Management System |
| **SHA-256** | Secure Hash Algorithm 256-bit |
| **API** | Application Programming Interface |
| **RBAC** | Role-Based Access Control |

### 1.6 Document Overview

This SRS document is structured according to ISO/IEC/IEEE 29148:2018 standards and includes: overall system description, user characteristics, operating environment, functional requirements organized by modules, non-functional requirements, interface specifications, and verification criteria.[^1_4][^1_13]

______________________________________________________________________

## 2. Overall Description

### 2.1 Product Perspective

CM-GIP is a standalone, enterprise-grade governance platform that integrates with existing Coal India systems including NIRIKSHAN (inspection portal), CSIS (safety information system), ICCC (surveillance centre), and CMSMS (mine surveillance system). The system operates as a centralized cloud-based platform with distributed mobile field applications, serving as the single source of truth for all compliance and governance activities across multiple mining subsidiaries and sites.[^1_12][^1_1][^1_2][^1_5][^1_11]

**System Context Diagram:**

```
┌─────────────────────────────────────────────────────────────┐
│                    External Systems                          │
│  DGMS Portal │ CIL ERP │ ICCC │ CSIS │ CMSMS │ GIS/Satellite│
└────────┬────────────┬─────────┬────────┬────────┬───────────┘
         │            │         │        │        │
         ▼            ▼         ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────┐
│              CM-GIP Central Platform (Cloud)                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ Web Portal   │ │ AI/ML Engine │ │ Database & Audit     │ │
│  │ (Dashboards) │ │ (Analytics)  │ │ Trail (Tamper-Evident Logs (pg_audit))   │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │            │         │        │        │
         ▼            ▼         ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────┐
│              Mobile Applications (Field Staff)               │
│  Inspectors │ Safety Officers │ Contractors │ Workers       │
└─────────────────────────────────────────────────────────────┘
```


### 2.2 Product Functions

The platform delivers the following core capabilities:[^1_1][^1_2]

- **Statutory Compliance Tracking:** Digital monitoring of safety, environment, production, and labour regulation requirements as per Mines Act 1952 and Coal Mines Regulations 2017.[^1_7][^1_9][^1_6]
- **Real-Time Inspection Management:** Geo-tagged, time-stamped tracking of inspections, observations, violations, and corrective actions with automated workflows.[^1_12][^1_1]
- **AI-Powered Risk Analytics:** Machine learning models to identify high-risk areas, predict compliance failures, detect operational anomalies, and generate proactive alerts.[^1_10][^1_11]
- **Mobile Field Reporting:** Offline-capable mobile applications for safety observations, attendance, incident reporting, and contractor management with GPS validation.[^1_5][^1_1]
- **Multi-Level Dashboards:** Role-based dashboards for mine officials, corporate management, and regulatory authorities with real-time KPIs and drill-down analytics.[^1_11][^1_12]
- **Automated Workflow Engine:** Configurable alerts, reminders, escalations, digital approvals, and statutory report generation with SLA tracking.[^1_14][^1_1]
- **Document Digitization:** OCR-based conversion of legacy documents, forms, and records into searchable digital formats with version control.[^1_2][^1_1]
- **GIS Integration:** Spatial mapping of mine sites, lease boundaries, environmental zones, and infrastructure with satellite imagery overlay.[^1_10][^1_2]
- **Tamper-Evident Logs (pg_audit) Audit Trail:** Tamper-evident logging of all transactions, approvals, and compliance records using SHA-256 hashing for regulatory audits.[^1_14][^1_1]
- **Multilingual Support:** Conversational interfaces in Hindi, English, and regional languages for inclusive accessibility.[^1_1][^1_2]


### 2.3 User Characteristics

| User Category | Technical Proficiency | Primary Tasks | Access Device |
| :-- | :-- | :-- | :-- |
| **Mine Managers** | Intermediate | Review dashboards, approve reports, monitor compliance | Desktop/Web |
| **Safety Officers** | Intermediate | Conduct inspections, log observations, track violations | Mobile/Tablet |
| **Field Inspectors** | Basic | Geo-tagged reporting, photo uploads, attendance marking | Mobile |
| **Contractors** | Basic | Submit work logs, safety checklists, grievance reports | Mobile |
| **Corporate Management** | Intermediate | Strategic dashboards, trend analysis, subsidiary comparison | Desktop/Web |
| **DGMS Officials** | Advanced | Regulatory audits, compliance verification, report extraction | Desktop/Web |
| **System Administrators** | Expert | User management, workflow configuration, system monitoring | Desktop/Web |
| **Workers** | Basic | Attendance, grievance submission, safety training access | Mobile/Kiosk |

### 2.4 Operating Environment

**Hardware Requirements:**

- **Server Infrastructure:** Cloud-based deployment (AWS/Azure/GovCloud) with auto-scaling capabilities
- **Mobile Devices:** Android 10+ smartphones/tablets with GPS, camera, and offline storage (4GB+ RAM recommended)
- **Client Workstations:** Modern browsers (Chrome, Firefox, Edge) with minimum 8GB RAM for dashboard users

**Software Requirements:**

- **Backend & Database:** Supabase (PostgreSQL) for Auth, Database, and Storage
- **Frontend:** React Native (Expo) with TypeScript for cross-platform mobile applications
- **AI/ML:** Google Gemini Pro (Text & Risk Analysis) & Gemini Vision (OCR) API for predictive models and text analysis
- **GIS:** `react-native-maps` integration for spatial analytics
- **Audit Trails:** pg_audit (PostgreSQL) for tamper-evident logging (replacing Tamper-Evident Logs (pg_audit) overhead)
- **OCR:** Google ML Kit (via Expo Camera) for document digitization
- **Security:** SSL/TLS encryption, OAuth 2.0, RBAC, MFA for sensitive operations

**Network Requirements:**

- Minimum 4G connectivity for mobile apps with offline sync capability
- Dedicated bandwidth for real-time video analytics integration with ICCC[^1_11]


### 2.5 Constraints and Limitations

- **Regulatory Compliance:** System must adhere to DGMS regulations, data localization laws (India), and IT Act 2000 provisions.[^1_6][^1_7]
- **Connectivity:** Field operations in remote mining areas may have intermittent or no internet connectivity, requiring robust offline-first design.[^1_2][^1_1]
- **Legacy Integration:** Must integrate with existing Coal India systems (NIRIKSHAN, CSIS, CMSMS) without disrupting ongoing operations.[^1_5][^1_12]
- **Budget:** Development and deployment costs must align with Ministry of Coal digital transformation budget allocations.[^1_10][^1_11]
- **Timeline:** Phased rollout across subsidiaries within 18-24 months from project initiation.[^1_1]
- **Multilingual:** Support for Hindi and English mandatory; regional languages (Bengali, Odia, Telugu) as optional modules.[^1_2][^1_1]


### 2.6 Assumptions and Dependencies

- Stable power supply and network infrastructure at mine sites (with backup provisions)
- User training programs will be conducted by Coal India for adoption
- DGMS will provide API access or data exchange protocols for regulatory reporting
- Satellite imagery and GIS data will be accessible through ISRO NRSC partnership[^1_10]
- Existing CIL employee databases can be integrated for user provisioning
- Legal framework supports tamper-evident logs-based audit trails for compliance records[^1_14]

______________________________________________________________________

## 3. Specific Requirements

### 3.1 Requirement Conventions and Identifier Scheme

Requirements are identified using the format: **FR-XXX** (Functional Requirements), **NFR-XXX** (Non-Functional Requirements), **UI-XXX** (User Interface Requirements). Priority levels: **P0** (Critical), **P1** (High), **P2** (Medium), **P3** (Low).

### 3.2 Functional Requirements

#### 3.2.1 Compliance Management Module

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-001** | The system shall maintain a centralized repository of all statutory compliance requirements categorized by safety, environment, production, and labour regulations as per Mines Act 1952 and Coal Mines Regulations 2017. [^1_6][^1_7][^1_9] | P0 |
| **FR-002** | The system shall allow compliance officers to define compliance schedules with frequencies (daily, weekly, monthly, quarterly, annually) and assign responsible personnel. | P0 |
| **FR-003** | The system shall automatically generate reminders 7 days, 3 days, and 1 day before compliance due dates via SMS, email, and in-app notifications. | P1 |
| **FR-004** | The system shall track compliance status (Pending, In Progress, Completed, Overdue, Violated) with colour-coded indicators on dashboards. | P1 |
| **FR-005** | The system shall enable upload of compliance evidence (documents, photos, videos, sensor data) with OCR-based automatic metadata extraction. [^1_1] | P1 |
| **FR-006** | The system shall generate statutory compliance reports in DGMS-prescribed formats with digital signatures and timestamps. [^1_6][^1_5] | P0 |
| **FR-007** | The system shall maintain a compliance calendar view showing all upcoming, due, and overdue requirements across all mine sites. | P2 |
| **FR-008** | The system shall support bulk import of compliance requirements from Excel/CSV for initial data migration. | P2 |

#### 3.2.2 Inspection \& Audit Management Module

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-010** | The system shall enable creation of inspection templates with customizable checklists for safety audits, environmental inspections, and operational reviews. [^1_11][^1_12] | P0 |
| **FR-011** | The mobile application shall capture uncropped, geo-tagged (GPS coordinates) and time-stamped inspection records with mandatory photo/video evidence. [^1_1][^1_2] | P0 |
| **FR-012** | The system shall automatically detect and flag inspections conducted outside authorized mine lease boundaries using GIS validation. [^1_10][^1_2] | P1 |
| **FR-013** | The system shall allow real-time logging of observations, violations, and non-conformities with severity classification (Critical, Major, Minor). | P0 |
| **FR-014** | The system shall automatically assign corrective actions to responsible personnel with SLA-based deadlines (e.g., Critical: 24 hours, Major: 7 days). | P1 |
| **FR-015** | The system shall track corrective action closure rates and generate escalation alerts for overdue actions to next-level authorities. | P1 |
| **FR-016** | The system shall integrate with NIRIKSHAN portal for bidirectional sync of inspection data and audit reports. [^1_12] | P1 |
| **FR-017** | The mobile application shall support offline inspection data capture with automatic sync when connectivity is restored. [^1_1][^1_2] | P0 |
| **FR-018** | The system shall generate inspection summary reports with trend analysis, recurring violation patterns, and risk heatmaps. [^1_11][^1_12] | P2 |

#### 3.2.3 AI/ML Analytics Engine

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-020** | The AI engine shall analyze historical compliance data to identify patterns and predict high-risk areas prone to violations using machine learning models. [^1_1][^1_10] | P1 |
| **FR-021** | The system shall detect operational anomalies (e.g., production spikes without corresponding safety checks, unusual contractor activity) and generate real-time alerts. [^1_11][^1_2] | P1 |
| **FR-022** | The AI shall perform natural language processing on inspection notes and grievance reports to auto-categorize issues and suggest similar past resolutions. [^1_14][^1_2] | P2 |
| **FR-023** | The system shall generate predictive compliance scores for each mine site (0-100 scale) based on historical performance, pending actions, and risk factors. [^1_1][^1_11] | P2 |
| **FR-024** | The AI engine shall recommend optimal inspection frequencies and resource allocation based on risk profiles and past incident data. [^1_10][^1_2] | P3 |
| **FR-025** | The system shall provide "what-if" scenario analysis for management to assess impact of policy changes on compliance outcomes. | P3 |

#### 3.2.4 Mobile Application (Field Reporting)

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-030** | The mobile application shall support user authentication via OTP, biometric (fingerprint/face), or RFID integration for field staff. [^1_11] | P0 |
| **FR-031** | The application shall enable workers to mark attendance with geo-fenced validation (within mine premises) and time-stamped photos. [^1_1][^1_14] | P0 |
| **FR-032** | The application shall allow safety officers to submit safety observations with pre-defined hazard categories (fire, ventilation, roof support, machinery, etc.). [^1_6][^1_7] | P0 |
| **FR-033** | The application shall support incident/accident reporting with mandatory fields (location, time, persons involved, severity, immediate actions) as per DGMS formats. [^1_11][^1_5] | P0 |
| **FR-034** | The application shall enable contractors to submit daily work logs, equipment usage records, and material consumption reports. [^1_1][^1_2] | P1 |
| **FR-035** | The application shall provide a grievance submission module with anonymous option and status tracking for workers. [^1_1][^1_15] | P1 |
| **FR-036** | The application shall support voice-to-text input in Hindi and English for hands-free reporting in hazardous environments. [^1_1][^1_2] | P2 |
| **FR-037** | The application shall display personalized task lists, pending actions, and upcoming compliance deadlines for each user. | P1 |
| **FR-038** | The application shall integrate with device camera for QR code scanning of equipment, vehicles, and safety tags for automated data capture. | P2 |

#### 3.2.5 Dashboard \& Reporting Module

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-040** | The system shall provide role-based dashboards with customizable widgets for Mine Managers, Safety Heads, Corporate Management, and DGMS Officials. [^1_1][^1_11] | P0 |
| **FR-041** | Dashboards shall display real-time KPIs: compliance completion %, open violations, pending corrective actions, inspection coverage, incident rates. [^1_11][^1_12] | P0 |
| **FR-042** | The system shall provide drill-down capabilities from corporate level to subsidiary to mine site to specific inspection records. | P1 |
| **FR-043** | Dashboards shall include GIS-based map views showing mine locations with colour-coded compliance status and risk indicators. [^1_10][^1_2] | P1 |
| **FR-044** | The system shall generate automated daily/weekly/monthly compliance summary reports with email distribution to stakeholders. [^1_1][^1_5] | P1 |
| **FR-045** | The system shall support ad-hoc report generation with drag-and-drop fields, filters, and export to PDF/Excel formats. | P2 |
| **FR-046** | Dashboards shall integrate real-time data from ICCC (CCTV analytics, AQMS sensors, vehicle tracking) for comprehensive situational awareness. [^1_11][^1_12] | P1 |
| **FR-047** | The system shall provide comparative analytics across subsidiaries, mine sites, and time periods with benchmarking capabilities. [^1_10][^1_2] | P2 |

#### 3.2.6 Workflow Automation \& Escalation

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-050** | The system shall provide a visual workflow designer for creating custom approval chains, notification rules, and escalation paths without coding. [^1_1][^1_2] | P1 |
| **FR-051** | The system shall automatically escalate overdue compliance tasks to next-level authority after SLA breach (configurable thresholds). | P1 |
| **FR-052** | The system shall send multi-channel notifications (SMS, email, WhatsApp, in-app) for critical alerts and time-sensitive actions. | P1 |
| **FR-053** | The workflow engine shall support parallel approvals, conditional branching, and reassignment of tasks based on user availability. | P2 |
| **FR-054** | The system shall maintain complete audit logs of all workflow actions (who approved/rejected, timestamps, comments). [^1_1][^1_14] | P0 |
| **FR-055** | The system shall generate SLA compliance reports showing average resolution times, bottleneck identification, and performance by department. | P2 |

#### 3.2.7 Document Management \& OCR

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-060** | The system shall provide a centralized document repository with folder hierarchy mirroring organizational structure (Corporate > Subsidiary > Mine). [^1_1][^1_2] | P1 |
| **FR-061** | The OCR engine shall automatically extract text, tables, and metadata from uploaded documents (scanned forms, permits, certificates) and make them searchable. [^1_1][^1_2] | P1 |
| **FR-062** | The system shall support version control for documents with check-in/check-out, approval workflows, and audit trails. [^1_1][^1_14] | P1 |
| **FR-063** | The system shall auto-classify documents using AI (e.g., safety certificates, environmental clearances, labour permits) and tag with relevant metadata. [^1_2] | P2 |
| **FR-064** | The system shall support bulk document upload with progress tracking and error reporting for failed uploads. | P2 |
| **FR-065** | Documents shall be accessible via full-text search with filters (date range, document type, mine site, compliance category). | P1 |

#### 3.2.8 GIS \& Spatial Analytics

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-070** | The system shall integrate with ISRO Bhuvan or similar GIS platforms to display mine lease boundaries, infrastructure, and environmental zones on interactive maps. [^1_10][^1_2] | P1 |
| **FR-071** | The system shall overlay satellite imagery with compliance data to visualize environmental impact, afforestation progress, and land reclamation status. [^1_10][^1_2] | P1 |
| **FR-072** | The GIS module shall detect and alert unauthorized mining activities outside approved lease boundaries using change detection algorithms. [^1_10][^1_2] | P1 |
| **FR-073** | The system shall map all inspection points, incident locations, and sensor placements on mine site maps for spatial analysis. | P2 |
| **FR-074** | The system shall generate buffer zone analysis for environmental compliance (e.g., mining activity within 500m of residential areas). [^1_10] | P2 |
| **FR-075** | The mobile application shall display user's current location on mine map with navigation to assigned inspection points. [^1_1][^1_2] | P2 |

#### 3.2.9 Contractor Management Module

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-080** | The system shall maintain a contractor registry with details (company, contact, work category, safety certifications, past performance). [^1_1][^1_2] | P1 |
| **FR-081** | The system shall track contractor workforce attendance, work hours, and task completion with geo-tagged validation. [^1_1][^1_14] | P1 |
| **FR-082** | The system shall enforce mandatory safety training certification checks before allowing contractor workers to mark attendance. [^1_6][^1_7] | P1 |
| **FR-083** | The system shall generate contractor performance scorecards based on compliance adherence, incident rates, and work quality. | P2 |
| **FR-084** | The system shall support contractor grievance redressal with dedicated workflow and escalation to mine management. [^1_1][^1_15] | P2 |
| **FR-085** | The system shall integrate contractor payment milestones with compliance completion status for automated clearance workflows. | P2 |

#### 3.2.10 Database Audit Trail (pg_audit)

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-090** | All compliance records, approvals, inspections, and corrective actions shall be logged using PostgreSQL `pg_audit` for tamper evidence. [^1_1][^1_14] | P1 |
| **FR-091** | The system shall generate unique cryptographic transaction IDs for each critical record, accessible for regulatory audits and verification. [^1_14] | P1 |
| **FR-092** | The database shall support triggers and edge functions for automated enforcement of compliance workflows (e.g., auto-escalation after SLA breach). [^1_1][^1_14] | P2 |
| **FR-093** | DGMS auditors shall be able to verify record integrity by comparing database audit logs. [^1_14][^1_6] | P1 |
| **FR-094** | The system shall maintain immutable logs via Row-Level Security (RLS) policies in Supabase. [^1_14] | P2 |

#### 3.2.11 Multilingual \& Accessibility Features

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **FR-100** | The web and mobile applications shall support user interface localization in Hindi and English with toggle option. [^1_1][^1_2] | P1 |
| **FR-101** | The system shall provide voice-based conversational interface (chatbot) in Hindi and English for querying compliance status, submitting reports, and receiving guidance. [^1_1][^1_2] | P2 |
| **FR-102** | All forms and templates shall be available in bilingual format (Hindi-English) for field usability. [^1_1][^1_2] | P1 |
| **FR-103** | The mobile application shall support text-to-speech for reading out instructions and safety guidelines to workers with low literacy. [^1_1][^1_2] | P2 |
| **FR-104** | The system shall comply with WCAG 2.1 AA accessibility standards for users with disabilities (screen reader support, high contrast mode). | P3 |


______________________________________________________________________

### 3.3 Non-Functional Requirements

#### 3.3.1 Performance Requirements

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-001** | The system shall support concurrent access by 10,000+ users across all subsidiaries with response time under 3 seconds for 95% of transactions. | P0 |
| **NFR-002** | Mobile application offline sync shall complete within 30 seconds for typical inspection records (10 photos, 500 words text) when connectivity is restored. | P1 |
| **NFR-003** | Dashboard widgets shall refresh data in real-time (under 5 seconds latency) for live KPIs and alerts. | P1 |
| **NFR-004** | AI/ML prediction models shall generate risk scores and alerts within 1 minute of new data ingestion. | P2 |
| **NFR-005** | OCR processing shall extract text from a standard A4 document (300 DPI) within 10 seconds. | P2 |
| **NFR-006** | Tamper-Evident Logs (pg_audit) hash generation and storage shall add less than 500ms latency to critical transaction commits. [^1_14] | P2 |

#### 3.3.2 Security Requirements

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-010** | The system shall implement role-based access control (RBAC) with granular permissions (view, create, edit, delete, approve) at module and record levels. | P0 |
| **NFR-011** | All data transmission shall use TLS 1.3 encryption; data at rest shall use AES-256 encryption. | P0 |
| **NFR-012** | Multi-factor authentication (MFA) shall be mandatory for administrative users and optional for field staff via OTP/biometric. | P1 |
| **NFR-013** | The system shall log all user activities (login, data access, modifications, exports) with immutable audit trails for security forensics. [^1_1][^1_14] | P0 |
| **NFR-014** | The system shall comply with India's data localization laws, ensuring all data is stored within Indian geographical boundaries. | P0 |
| **NFR-015** | Regular vulnerability assessments and penetration testing shall be conducted quarterly with remediation within 30 days of findings. | P1 |
| **NFR-016** | The system shall support session timeout (15 minutes idle) and concurrent session limits per user for security. | P1 |
| **NFR-017** | Sensitive fields (personal data, financial information) shall be masked in logs and reports unless explicitly authorized. | P1 |

#### 3.3.3 Reliability \& Availability

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-020** | The system shall achieve 99.5% uptime during business hours (6 AM to 10 PM IST) with planned maintenance windows communicated 72 hours in advance. | P0 |
| **NFR-021** | The mobile application shall function fully offline for core features (inspection logging, attendance, incident reporting) with local data encryption. [^1_1][^1_2] | P0 |
| **NFR-022** | The system shall implement automatic failover to secondary data centres in case of primary site failure with RTO < 30 minutes and RPO < 5 minutes. | P1 |
| **NFR-023** | Database backups shall occur hourly with point-in-time recovery capability for the last 30 days. | P1 |
| **NFR-024** | The system shall handle network interruptions gracefully with automatic retry mechanisms and user-friendly error messages. | P1 |

#### 3.3.4 Scalability \& Maintainability

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-030** | The architecture shall support horizontal scaling to accommodate 50,000+ users and 1 million+ daily transactions without redesign. | P1 |
| **NFR-031** | New mine sites and subsidiaries shall be onboarded within 48 hours through configuration (not code changes). | P1 |
| **NFR-032** | The system shall support microservices-based deployment allowing independent scaling of high-load modules (AI engine, mobile API, dashboards). | P2 |
| **NFR-033** | Code shall follow modular design principles with API documentation (OpenAPI/Swagger) for all integration points. | P2 |
| **NFR-034** | The system shall provide admin tools for monitoring system health, user activity, and performance metrics with alerting thresholds. | P1 |

#### 3.3.5 Usability Requirements

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-040** | The mobile application shall be usable by field staff with basic digital literacy, requiring less than 4 hours of training for core features. [^1_1][^1_2] | P1 |
| **NFR-041** | The system shall provide contextual help, tooltips, and video tutorials embedded within the application for self-guided learning. | P2 |
| **NFR-042** | User interfaces shall follow consistent design patterns (Material Design/Apple HIG) with intuitive navigation and minimal clicks to complete tasks. | P1 |
| **NFR-043** | The system shall support keyboard shortcuts for power users on web dashboards to improve productivity. | P3 |
| **NFR-044** | Error messages shall be user-friendly, actionable, and available in both Hindi and English. [^1_1][^1_2] | P1 |

#### 3.3.6 Compliance \& Regulatory Requirements

| ID | Requirement | Priority |
| :-- | :-- | :-- |
| **NFR-050** | The system shall generate reports compliant with DGMS formats (Form I, Form II, accident reports, safety audit templates) as per Mines Act 1952. [^1_6][^1_5][^1_7] | P0 |
| **NFR-051** | All digital signatures and timestamps shall comply with India's Information Technology Act 2000 and be legally admissible in audits. | P0 |
| **NFR-052** | The system shall support data retention policies as per regulatory requirements (minimum 5 years for compliance records, 10 years for incident data). [^1_6][^1_9] | P1 |
| **NFR-053** | The tamper-evident logs audit trail shall be accessible to DGMS auditors for independent verification of record integrity. [^1_14][^1_6] | P1 |
| **NFR-054** | The system shall support export of compliance data in formats compatible with Ministry of Coal's centralized reporting systems (CSIS, CMSMS). [^1_5][^1_12] | P1 |


______________________________________________________________________

### 3.4 External Interface Requirements

#### 3.4.1 User Interfaces

- **Web Portal:** Responsive design supporting desktop (1920x1080), laptop (1366x768), and tablet (1024x768) resolutions with adaptive layouts.
- **Mobile Application:** Native iOS (15+) and Android (10+) apps with support for screen sizes from 5" to 10" tablets.
- **Dashboard UI:** High-density information display with customizable widgets, drag-and-drop layout, and export capabilities.
- **Accessibility:** WCAG 2.1 AA compliance with screen reader support, keyboard navigation, and high-contrast themes.


#### 3.4.2 Hardware Interfaces

- **Mobile Devices:** Integration with device GPS, camera, fingerprint scanner, NFC/RFID readers for attendance and equipment tracking.[^1_11]
- **IoT Sensors:** API-based integration with AQMS, fire/smoke detectors, vehicle tracking systems (VTS), and weighbridge ANPR cameras.[^1_11]
- **Biometric Devices:** Support for fingerprint/face recognition devices for worker attendance at mine entry points.


#### 3.4.3 Software Interfaces

| Interface | System | Protocol | Data Format |
| :-- | :-- | :-- | :-- |
| **NIRIKSHAN Integration** | CIL Inspection Portal | REST API | JSON/XML |
| **CSIS Integration** | Centralized Safety Information System | SOAP/REST | XML/JSON |
| **ICCC Integration** | Integrated Command \& Control Centre | WebSocket/MQTT | JSON |
| **CMSMS Integration** | Coal Mines Surveillance System | REST API | JSON |
| **ISRO Bhuvan GIS** | Satellite Imagery \& Mapping | WMS/WFS | GeoJSON |
| **DGMS Portal** | Regulatory Reporting | SFTP/API | XML/Excel |
| **CIL ERP** | HR \& Contractor Data | REST/SOAP | JSON/XML |
| **SMS Gateway** | Notification Service | SMPP/HTTP | JSON |
| **Email Server** | SMTP/IMAP | MIME | HTML/Text |
| **Supabase Services** | Auth, Storage, Edge Functions | REST/gRPC | JSON |

#### 3.4.4 Communication Interfaces

- **Mobile Sync:** HTTPS with compressed JSON payloads for offline data synchronization.
- **Real-Time Alerts:** WebSocket connections for live dashboard updates and push notifications.
- **File Transfer:** SFTP for bulk document exchange with regulatory bodies.
- **API Security:** OAuth 2.0 with JWT tokens, rate limiting (1000 requests/minute per client), and API key management.

______________________________________________________________________

### 3.5 Other Requirements

#### 3.5.1 Database Requirements

- **Primary Database:** Supabase (PostgreSQL 14+) for structured data (compliance records, users, workflows).
- **Document Store:** Supabase Storage (S3-compatible) for unstructured data (inspection notes, photos metadata).
- **Cache Layer:** Local memory and AsyncStorage (React Native) for session management and frequently accessed data on client devices.
- **Audit Storage:** PostgreSQL `pg_audit` for tamper-evident compliance history.[^1_14]
- **Data Warehouse:** Read replicas via Supabase for analytics and historical reporting.


#### 3.5.2 Legal \& Licensing Requirements

- All software components shall comply with open-source licenses (MIT, Apache 2.0, GPL) with attribution.
- Proprietary AI/ML models and tamper-evident logs components shall be licensed for government use with source code escrow.
- The system shall not infringe on existing patents related to mining compliance or governance platforms.


#### 3.5.3 Training \& Documentation

- Comprehensive user manuals, administrator guides, and API documentation shall be delivered in PDF and online wiki formats.
- Video training modules (Hindi and English) shall be created for each user role (inspectors, managers, contractors).
- On-site training workshops shall be conducted at 5 regional hubs covering all subsidiaries before go-live.


#### 3.5.4 Support \& Maintenance

- 24/7 helpdesk support with SLA: Critical issues resolved within 4 hours, high priority within 24 hours.
- Quarterly system updates with new features, security patches, and regulatory compliance updates.
- Annual third-party security audits and performance benchmarking.

______________________________________________________________________

## 4. Verification and Acceptance Criteria

### 4.1 Verification Methods

| Requirement Type | Verification Method | Acceptance Criteria |
| :-- | :-- | :-- |
| **Functional Requirements** | Unit Testing, Integration Testing, UAT | 100% of P0/P1 requirements pass test cases; 95% of P2/P3 requirements pass |
| **Performance Requirements** | Load Testing, Stress Testing | System handles 10,000 concurrent users with \<3s response time for 95% transactions |
| **Security Requirements** | Penetration Testing, Security Audits | Zero critical vulnerabilities; all high vulnerabilities remediated within 30 days |
| **Usability Requirements** | User Acceptance Testing, Heuristic Evaluation | 90% of test users complete core tasks without assistance; satisfaction score >4/5 |
| **Compliance Requirements** | Regulatory Review, DGMS Audit | DGMS certifies report formats and digital signatures as compliant with Mines Act 1952 [^1_6][^1_7] |
| **Reliability Requirements** | Failover Testing, Chaos Engineering | System recovers from simulated failures within RTO/RPO targets; 99.5% uptime achieved in 30-day trial |

### 4.2 Acceptance Testing Phases

1. **Alpha Testing:** Internal testing by development team with synthetic data (4 weeks)
2. **Beta Testing:** Pilot deployment at 2 mine sites with real users and live data (8 weeks)
3. **UAT (User Acceptance Testing):** Comprehensive testing by Coal India stakeholders across 5 subsidiaries (6 weeks)
4. **Regulatory Acceptance:** DGMS review and certification of compliance reporting features (4 weeks)
5. **Production Rollout:** Phased deployment across all subsidiaries with hypercare support (12 weeks)

### 4.3 Success Metrics

- **Compliance Improvement:** 40% reduction in overdue compliance tasks within 6 months of deployment
- **Inspection Efficiency:** 60% reduction in time spent on inspection reporting (from 2 hours to 45 minutes per inspection)
- **Data Accuracy:** 95% reduction in data entry errors through geo-tagging, OCR, and automated validation
- **User Adoption:** 80% of field staff actively using mobile application within 3 months of rollout
- **Regulatory Compliance:** 100% of statutory reports submitted on time with zero penalties for late submissions
- **Cost Savings:** 30% reduction in paperwork and administrative overhead costs within first year

______________________________________________________________________

## 5. Appendices

### Appendix A: Sample Compliance Workflow

```
Compliance Due → Reminder (7 days) → Reminder (3 days) → Reminder (1 day)
       ↓
Task Assigned to Officer → Evidence Upload → Supervisor Review
       ↓
[If Approved] → pg_audit Log Generated → DGMS Report Auto-Generated
       ↓
[If Rejected] → Resubmission Request → Officer Notification
       ↓
[If Overdue] → Escalation to Next Level → SMS/Email Alert → Dashboard Flag
```


### Appendix B: Risk Heatmap Visualization

| Risk Level | Colour | Criteria |
| :-- | :-- | :-- |
| **Critical** | Red | >3 overdue critical violations OR compliance score \<50 |
| **High** | Orange | 1-2 overdue critical violations OR compliance score 50-70 |
| **Medium** | Yellow | Overdue major violations OR compliance score 70-85 |
| **Low** | Green | No overdue violations AND compliance score >85 |

### Appendix C: Mobile App Screen Flow

```
Login (OTP/Biometric) → Dashboard (Tasks, Alerts, KPIs)
       ↓
[Select Action]
  ├─→ Inspection Logging → Checklist → Photos/GPS → Submit → Sync
  ├─→ Attendance Marking → Geo-fence Validation → Photo → Submit
  ├─→ Incident Reporting → Form (DGMS Format) → Evidence → Submit → Alert Generated
  ├─→ Grievance Submission → Category → Description → Anonymous Option → Submit
  └─→ View Reports → Compliance Status → Corrective Actions → History
```


### Appendix D: Technology Stack Summary

| Layer | Technology |
| :-- | :-- |
| **Frontend (Mobile)** | React Native (Expo), TypeScript, React Navigation |
| **Backend API & Database** | Supabase (PostgreSQL) |
| **Local Database** | AsyncStorage (React Native) |
| **AI/ML Services** | Google Gemini Pro (Text & Risk Analysis) & Gemini Vision (OCR) |
| **Authentication & Storage** | Supabase Auth, Supabase Storage |
| **Deployment/DevOps** | Expo Application Services (EAS) |
| **CI/CD** | GitHub Actions |


______________________________________________________________________

**Document Approval:**


| Role | Name | Signature | Date |
| :-- | :-- | :-- | :-- |
| Project Sponsor (Ministry of Coal) | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| CIL Representative | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| DGMS Auditor | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| Lead Architect | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| QA Manager | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |


______________________________________________________________________

**Revision History:**


| Version | Date | Author | Changes |
| :-- | :-- | :-- | :-- |
| 1.0 | 2026-09-06 | [Your Name] | Initial SRS draft based on SIH26024 problem statement [^1_1][^1_2] |


______________________________________________________________________

This SRS document provides a comprehensive blueprint for developing the AI-enabled Smart Governance and Compliance Monitoring Platform for Indian coal mines, aligned with Ministry of Coal's digital transformation objectives and DGMS regulatory requirements.[^1_6][^1_5][^1_10][^1_11]

<span style="display:none">[^1_16][^1_17][^1_18][^1_19][^1_20][^1_21][^1_22][^1_23][^1_24][^1_25][^1_26][^1_27][^1_28][^1_29][^1_30]</span>

<div align="center">⁂</div>

[^1_1]: https://zaidsayyed.in/tools/sih-problem-statements/sih26024

[^1_2]: https://sih2026.vuce.in/ps/SIH26024

[^1_3]: https://standards.ieee.org/ieee/802.1w/1222/

[^1_4]: https://www.itechguides.com/software-requirements-specification-srs-format-complete-guide-and-template/

[^1_5]: https://coal.gov.in/sites/default/files/2025-08/Pib180825.pdf

[^1_6]: https://www.dgms.gov.in/UserView/index?mid=1648

[^1_7]: https://www.coal.gov.in/major-statistics/safety-coal-mines

[^1_8]: https://www.dgms.gov.in/UserView/index?mid=1653

[^1_9]: https://www.dgms.net/Coal Mines Regulation 2017.pdf

[^1_10]: https://indianmasterminds.com/news/coal-india-isro-nrsc-ai-satellite-dashboard-smart-mine-monitoring-216077/

[^1_11]: https://coal.nic.in/sites/default/files/2026-02/chap14AnnualReport2026en.pdf

[^1_12]: https://www.arihantcapital.com/company-information/directors-report/12019

[^1_13]: https://www.reqview.com/doc/iso-iec-ieee-29148-templates/

[^1_14]: https://www.ijraset.com/research-paper/deepshift-ai-powered-shift-management-and-safety-analytics

[^1_15]: https://www.coalindia.in/

[^1_16]: https://standards.ieee.org/standard/830-1998.html

[^1_17]: https://standards.ieee.org/ieee/830/1222/

[^1_18]: https://github.com/jam01/SRS-Template

[^1_19]: https://github.com/jam01/SRS-Template/blob/master/README.md

[^1_20]: https://github.com/s0miya/IEEE-29148-SRS-Template

[^1_21]: https://github.com/wxinix/IEEE-29148-SRS-LaTeX-Template/blob/main/IEEE-29148-2018-SRS-Template.tex

[^1_22]: https://www.reqview.com/doc/iso-iec-ieee-29148-srs-example/

[^1_23]: https://www.reqview.com/papers/ReqView-Example_Software_Requirements_Specification_SRS_Document.pdf

[^1_24]: https://studylib.net/doc/28434563/iso-iec-ieee-29148-2018-srs-template

[^1_25]: https://drkasbokar.com/wp-content/uploads/2024/09/29148-2018-ISOIECIEEE.pdf

[^1_26]: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227231

[^1_27]: https://www.dgms.gov.in/UserView/index?mid=1313

[^1_28]: https://www.dgms.gov.in/UserView/index?mid=1654

[^1_29]: https://www.dgms.gov.in/UserView/index?mid=1655

[^1_30]: https://www.dgms.gov.in/UserView/index?mid=1261


---

# Detailed Application Flows \& End-User Workflows

## CM-GIP Platform - Comprehensive Process Documentation


______________________________________________________________________

## 1. User Registration \& Authentication Flow

### 1.1 New User Registration (Admin-Driven)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: HR/CIL Admin Accesses User Management Module
         ↓
Step 2: Admin Clicks "Add New User" Button
         ↓
Step 3: Admin Enters User Details:
         • Full Name
         • Employee ID / Contractor ID
         • Designation (dropdown: Inspector, Safety Officer, Mine Manager, etc.)
         • Subsidiary (dropdown: ECL, BCCL, CCL, WCL, NCL, MCL, SECL)
         • Mine Site (dropdown: filtered by subsidiary)
         • Mobile Number (mandatory, verified via OTP)
         • Email Address (optional for field staff, mandatory for managers)
         • Role (RBAC: Inspector, Safety Officer, Manager, Contractor, Worker, DGMS Official)
         • Reporting Manager (dropdown: filtered by mine site)
         ↓
Step 4: System Validates:
         • Mobile number format (10 digits, Indian number)
         • Employee ID uniqueness in database
         • Email format (if provided)
         ↓
Step 5: System Sends OTP to Mobile Number
         ↓
Step 6: Admin Enters OTP for Verification
         ↓
Step 7: System Generates Temporary Password (sent via SMS)
         ↓
Step 8: System Creates User Account with Status: "Active - Password Change Required"
         ↓
Step 9: System Logs Event: "User Created by Admin [AdminID] at [Timestamp]"
         ↓
Step 10: User Receives SMS:
          "Welcome to CM-GIP. Your username: [Mobile]. Temp password: [XXXX]. 
           Login at app.cm-gip.gov.in. Change password on first login."
```

**Description:**
This flow ensures centralized user provisioning with proper role assignment and mobile verification. All users are created by authorized administrators (HR or IT admins at subsidiary level) to maintain control over access. The system enforces mobile number as the primary username for field staff who may not have corporate email addresses. Temporary passwords are randomly generated 8-character alphanumeric strings and must be changed on first login for security compliance.[^2_1][^2_2][^2_3]

**Business Rules:**

- Mobile number must be unique across the system
- Each user can have only one active account
- Contractors require additional approval from Mine Safety Head before activation
- DGMS officials are created centrally by Ministry admin with elevated audit permissions
- User status can be: Active, Inactive, Suspended, Terminated

______________________________________________________________________

### 1.2 User Login Flow (Web \& Mobile)

```
┌─────────────────────────────────────────────────────────────────┐
│                       LOGIN FLOW                                 │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Opens Web Portal (app.cm-gip.gov.in) or Mobile App
         ↓
Step 2: User Enters Credentials:
         • Username (Mobile Number or Employee ID)
         • Password
         ↓
Step 3: User Clicks "Login" Button
         ↓
Step 4: System Validates Credentials Against Database
         ↓
Step 5: [If Invalid] → Display Error: "Invalid username or password"
         → Increment Failed Login Counter
         → [If 5 Failed Attempts] → Lock Account for 30 minutes
         → Send SMS Alert: "Multiple failed login attempts detected"
         ↓
Step 6: [If Valid] → Check Account Status:
         • Active → Proceed to Step 7
         • Inactive → Display: "Account inactive. Contact admin."
         • Suspended → Display: "Account suspended. Reason: [X]"
         • Password Change Required → Redirect to Change Password Screen
         ↓
Step 7: System Checks MFA Requirement (based on role):
         • Admin/Manager → Require OTP/Biometric
         • Field Staff → Optional (configurable)
         ↓
Step 8: [If MFA Required] → Send OTP to Registered Mobile
         → User Enters OTP → Validate → Proceed
         ↓
Step 9: System Creates Session:
         • Generate JWT Token (valid 8 hours for web, 24 hours for mobile)
         • Store Session in Redis with User Context (role, permissions, mine site)
         ↓
Step 10: System Logs Login Event:
          "User [UserID] logged in from [IP/Device] at [Timestamp]"
         ↓
Step 11: Redirect to Role-Based Dashboard
```

**Description:**
The login flow implements multi-layered security with credential validation, account status checks, and optional MFA based on user role sensitivity. Session management uses JWT tokens with role-based permissions embedded, allowing stateless authentication across microservices. Failed login attempts trigger progressive security measures including account lockout and SMS alerts to prevent brute-force attacks.[^2_4][^2_1]

**Error Scenarios:**

- **Network Timeout:** Display "Connection error. Please check internet and retry." with retry button
- **Server Unavailable:** Display "System under maintenance. Try again after [Time]."
- **Account Locked:** Display "Account locked due to multiple failed attempts. Unlock after 30 minutes or contact admin."
- **Expired Password:** Display "Password expired (90 days). Please reset password."

______________________________________________________________________

### 1.3 First-Time Login \& Password Change Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  FIRST-TIME LOGIN FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Logs In with Temporary Password
         ↓
Step 2: System Detects "Password Change Required" Flag
         ↓
Step 3: Redirect to "Change Password" Screen (mandatory, cannot skip)
         ↓
Step 4: User Enters:
         • Current Password (temporary password)
         • New Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
         • Confirm New Password
         ↓
Step 5: System Validates Password Policy:
         • Minimum 8 characters
         • At least 1 uppercase letter (A-Z)
         • At least 1 lowercase letter (a-z)
         • At least 1 number (0-9)
         • At least 1 special character (!@#$%^&*)
         • Not same as last 5 passwords
         • Not containing username or mobile number
         ↓
Step 6: [If Validation Fails] → Display Specific Error:
         "Password must contain uppercase, lowercase, number, and special character"
         → User Re-enters Password
         ↓
Step 7: [If Validation Passes] → Hash New Password (bcrypt, salt rounds=12)
         → Update Database with New Hash
         → Clear "Password Change Required" Flag
         ↓
Step 8: System Prompts User to Set Security Questions (optional but recommended):
         • Question 1: "What is your mother's first name?"
         • Question 2: "What is your employee ID?"
         • Question 3: "What is your birth city?"
         ↓
Step 9: User Selects Language Preference (Hindi/English)
         → Save to User Profile
         ↓
Step 10: Display Welcome Tutorial (3-screen carousel):
          • Screen 1: "Welcome to CM-GIP - Your digital governance platform"
          • Screen 2: "Complete inspections, mark attendance, report incidents"
          • Screen 3: "Need help? Tap ? icon anytime for assistance"
         ↓
Step 11: Redirect to Role-Based Dashboard
```

**Description:**
First-time login enforces strong password policies aligned with government cybersecurity guidelines (CERT-In). The mandatory password change ensures temporary credentials are not used beyond initial access. Security questions provide an additional recovery mechanism for users who forget passwords, reducing dependency on admin intervention.[^2_1][^2_4]

**Password Policy Rationale:**

- Complexity requirements prevent easy-to-guess passwords
- History check prevents password recycling
- Special character requirement increases entropy
- Bcrypt hashing with salt protects against rainbow table attacks

______________________________________________________________________

## 2. Compliance Management Module Flows

### 2.1 Compliance Requirement Creation Flow (Admin/Safety Head)

```
┌─────────────────────────────────────────────────────────────────┐
│           COMPLIANCE REQUIREMENT CREATION FLOW                   │
└─────────────────────────────────────────────────────────────────┘

Step 1: Safety Head Navigates to: Compliance → Manage Requirements → Add New
         ↓
Step 2: Select Compliance Category (dropdown):
         • Safety (Mines Act 1952, Chapter IV)
         • Environment (MoEF&CC Guidelines)
         • Production (Coal Mines Regulations 2017)
         • Labour (Mines Rules 1955)
         • Fire Safety (DGMS Circular 2023)
         • Ventilation (Regulation 119, CMR 2017)
         ↓
Step 3: Enter Compliance Details:
         • Title: "Monthly Safety Audit - Underground Mine"
         • Description: "Comprehensive safety inspection covering roof support, 
                        ventilation, fire detection, and emergency exits"
         • Regulatory Reference: "Regulation 123, Coal Mines Regulations 2017" [^2_18][^2_30]
         • Applicable To: (checkboxes: All Mines / Specific Subsidiaries / Specific Mines)
         ↓
Step 4: Define Frequency & Schedule:
         • Frequency Type: Daily / Weekly / Monthly / Quarterly / Annually
         • Start Date: [Date Picker]
         • Due Day: (e.g., "5th of every month" for monthly frequency)
         • Grace Period: [Number] days (e.g., 3 days grace)
         • Time Window: (e.g., "Between 6 AM - 6 PM" for day-shift inspections)
         ↓
Step 5: Assign Responsibility:
         • Primary Role: (dropdown: Safety Officer, Inspector, Manager)
         • Specific User: (optional, dropdown filtered by role and mine site)
         • Backup User: (optional, receives task if primary is unavailable)
         ↓
Step 6: Define Evidence Requirements:
         • Mandatory Attachments: (checkboxes: Photos, Videos, Documents, Sensor Data)
         • Minimum Photos: [Number] (e.g., 5 photos from different locations)
         • Required Fields: (checkboxes: GPS Location, Timestamp, Inspector Signature)
         • Template Form: (upload Excel/PDF template if structured data required)
         ↓
Step 7: Set Escalation Rules:
         • Reminder Schedule:
           - 7 days before: Email to assigned user
           - 3 days before: SMS + Email
           - 1 day before: SMS + Email + In-App Notification
           - On due date: Escalate to Reporting Manager
           - 3 days overdue: Escalate to Mine Manager
           - 7 days overdue: Escalate to Subsidiary Head
         ↓
Step 8: Define SLA & Penalties:
         • Target Completion Time: [Number] hours/days from assignment
         • Penalty Points: [Number] (for performance scoring, e.g., 10 points per day overdue)
         ↓
Step 9: Review & Save:
         → System Validates: All mandatory fields filled, dates logical
         → Save to Database
         → Generate Compliance ID: COMP-[SubsidiaryCode]-[Year]-[SequentialNumber]
         → Log Event: "Compliance Requirement Created by [UserID]"
         ↓
Step 10: System Automatically Generates First Instance:
          • Create Task Record with Due Date based on frequency
          • Assign to designated user(s)
          • Send Initial Notification: "New compliance task assigned: [Title]. Due: [Date]"
```

**Description:**
This flow enables Safety Heads to digitize all statutory compliance requirements from Mines Act 1952 and Coal Mines Regulations 2017 into structured, trackable tasks. The system supports complex scheduling (e.g., "first Monday of every quarter") and automatic task generation, eliminating manual tracking. Escalation rules ensure accountability with multi-level notifications as deadlines approach or are missed.[^2_2][^2_5][^2_6][^2_7][^2_1]

**Example Compliance Requirements:**

- **Daily:** Ventilation measurement (Regulation 119), Pre-shift equipment inspection
- **Weekly:** Fire detection system testing, First aid box inspection
- **Monthly:** Full mine safety audit, Environmental dust monitoring, Contractor safety review
- **Quarterly:** Emergency evacuation drill, statutory medical examination of workers
- **Annually:** DGMS annual inspection preparation, Environmental clearance renewal[^2_5][^2_8]

______________________________________________________________________

### 2.2 Compliance Task Execution Flow (Field User)

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLIANCE TASK EXECUTION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Receives Notification:
         • SMS: "CM-GIP Alert: Compliance task 'Monthly Safety Audit' due on 10-Sep. 
                 Login to app.cm-gip.gov.in"
         • Email: Detailed task description with regulatory reference
         • In-App: Push notification with direct link to task
         ↓
Step 2: User Logs In and Navigates to: Dashboard → My Tasks → Pending Compliance
         ↓
Step 3: User Views Task List with Details:
         • Task Title: "Monthly Safety Audit - Underground Mine"
         • Due Date: 10-Sep-2026 (highlighted: Green if >3 days, Yellow if 1-3 days, Red if today/overdue)
         • Priority: High (based on regulatory criticality)
         • Estimated Duration: 2 hours
         ↓
Step 4: User Clicks Task → Opens Task Detail Screen:
         • Compliance Description
         • Regulatory Reference (clickable link to DGMS regulation text)
         • Checklist Items (if defined in requirement)
         • Evidence Requirements (mandatory photos, fields, etc.)
         • Previous Completion History (last 3 audits with links to reports)
         ↓
Step 5: User Clicks "Start Task" Button:
         → System Logs: "Task Started by [UserID] at [Timestamp]"
         → Start Timer (for SLA tracking)
         → Change Task Status: "In Progress"
         ↓
Step 6: User Performs Compliance Activity (e.g., Safety Audit):
         ↓
Step 7: User Fills Compliance Form:
         Section A: Basic Information
         • Location: Auto-captured GPS coordinates (latitude, longitude)
         • Date & Time: Auto-captured (cannot be edited)
         • Inspector Name: Auto-filled from profile
         • Mine Section: Dropdown (e.g., "Panel A-12", "Haul Road-3")
         
         Section B: Checklist (if defined):
         • [✓] Roof support inspection completed
         • [✓] Ventilation measurements recorded (attach reading sheet)
         • [✓] Fire detection systems tested
         • [✓] Emergency exits verified clear
         • [✗] Water spraying system - Issue found (requires observation entry)
         
         Section C: Observations & Findings:
         • Text Area: "Water spraying system at Panel A-12 has low pressure. 
                      Requires immediate maintenance."
         • Severity: Dropdown (Critical / Major / Minor / Suggestion)
         • Photo Upload: Minimum 5 photos (system enforces count)
           - Photo 1: Overall panel view (GPS validated)
           - Photo 2: Water spraying nozzle (close-up)
           - Photo 3: Pressure gauge reading
           - Photo 4: Affected area
           - Photo 5: Inspector with PPE (selfie for authentication)
         ↓
Step 8: User Attaches Supporting Documents:
         • Upload scanned measurement sheets (OCR auto-extracts values)
         • Upload equipment test certificates
         • Upload signed checklist (if paper backup used)
         ↓
Step 9: User Adds Digital Signature:
         • Click "Sign" Button
         • System Captures: User's typed name + Timestamp + GPS Location
         • Optional: Biometric signature (fingerprint on mobile)
         ↓
Step 10: User Reviews All Entries:
          → System Validates:
            - All mandatory fields filled
            - Minimum photo count met
            - GPS coordinates within mine lease boundary (if outside, show warning)
            - No blank checklist items
          → [If Validation Fails] → Highlight missing fields → User Corrects
          ↓
Step 11: User Clicks "Submit for Review" Button:
          → System Saves Record with Status: "Submitted"
          → Generate Unique Compliance ID: COMP-EXEC-[MineCode]-[Date]-[Seq]
          → Send Notification to Reviewer (Safety Head/Manager):
            "Compliance task '[Title]' submitted by [UserName]. Pending review."
          → Log Event: "Compliance Submitted by [UserID] at [Timestamp]"
          → Update Dashboard: Task moves from "Pending" to "Submitted"
          ↓
Step 12: [Optional] User Prints/Saves PDF Copy:
          → System Generates PDF with:
            - All form data
            - Embedded photos (thumbnails)
            - Digital signature
            - QR code linking to tamper-evident logs hash
          → User Downloads or Shares via Email/WhatsApp
```

**Description:**
This flow guides field users through structured compliance execution with built-in validation to ensure data quality and regulatory adherence. GPS auto-capture and timestamp enforcement prevent backdated or remote submissions, ensuring inspections are physically conducted at mine sites. The checklist-based approach standardizes compliance activities across all mines, reducing variability in inspection quality.[^2_3][^2_2][^2_4][^2_1]

**Key Features:**

- **GPS Validation:** System checks coordinates against mine lease boundary GIS data; alerts if inspection conducted outside authorized area[^2_9][^2_2]
- **Photo Geotagging:** Each photo automatically tagged with GPS coordinates and timestamp metadata
- **OCR Integration:** Uploaded measurement sheets automatically scanned; extracted values compared against acceptable ranges (e.g., methane levels \<1.5%)
- **Offline Support:** All form fields cached locally; submission queued when connectivity restored[^2_2][^2_1]

______________________________________________________________________

### 2.3 Compliance Review \& Approval Flow (Manager/Safety Head)

```
┌─────────────────────────────────────────────────────────────────┐
│             COMPLIANCE REVIEW & APPROVAL FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Reviewer Receives Notification:
         • Email: "Action Required: Compliance submission pending review - [Title]"
         • In-App: Badge count on "Reviews Pending" menu item
         ↓
Step 2: Reviewer Navigates to: Compliance → Pending Reviews
         ↓
Step 3: Reviewer Views Submission Queue:
         • List sorted by submission date (oldest first)
         • Each row shows: Task Title, Submitted By, Mine Site, Submission Time, Status
         ↓
Step 4: Reviewer Clicks Submission → Opens Review Screen:
         
         Left Panel: Submission Details
         • All form data entered by inspector
         • Embedded photos (clickable to enlarge)
         • GPS location on map (shows inspection point relative to mine layout)
         • Attached documents (downloadable)
         • Digital signature verification status
         
         Right Panel: Review Actions
         • Checklist for Reviewer:
           [ ] Photos clear and relevant
           [ ] GPS location matches task location
           [ ] All mandatory fields completed
           [ ] Observations adequately documented
           [ ] Evidence sufficient for regulatory audit
         
         • Review Decision:
           ○ Approve (compliance accepted)
           ○ Approve with Comments (accepted but improvements needed)
           ○ Reject (requires resubmission)
         
         • Comments Text Area (mandatory if not "Approve"):
           "Photo #3 unclear. Please retake pressure gauge reading with better lighting."
         
         • Assign Corrective Action (if issues found):
           - Action Description: "Retake water spraying system photos"
           - Assigned To: Original inspector or different user
           - Due Date: [Date picker, default 2 days]
           - Priority: High/Medium/Low
         ↓
Step 5: Reviewer Makes Decision:
         
         Scenario A: APPROVE
         → Click "Approve" Button
         → System:
           - Change Status: "Approved"
           - Generate Tamper-Evident Logs (pg_audit) Hash: SHA-256(ComplianceData + Timestamp + ReviewerID)
           - Store Hash on Permissioned Tamper-Evident Logs (pg_audit) (Hyperledger)
           - Update Compliance Dashboard: Count as "Completed"
           - Send Notification to Inspector: "Compliance '[Title]' approved by [ReviewerName]"
           - Log Event: "Compliance Approved by [ReviewerID] at [Timestamp]"
           → Flow Ends
         
         Scenario B: APPROVE WITH COMMENTS
         → Enter Comments: "Good inspection. Next time, include ventilation reading sheet."
         → Click "Approve with Comments"
         → System:
           - Change Status: "Approved with Comments"
           - Generate Tamper-Evident Logs (pg_audit) Hash
           - Send Notification to Inspector with comments
           - Mark as "Completed" but flag for training review
           → Flow Ends
         
         Scenario C: REJECT
         → Enter Comments: "Photo #3 unclear. Pressure gauge not readable. Retake and resubmit."
         → Assign Corrective Action (optional)
         → Click "Reject" Button
         → System:
           - Change Status: "Rejected - Resubmission Required"
           - Send Notification to Inspector:
             "Compliance '[Title]' rejected. Reason: [Comments]. Please resubmit by [DueDate]."
           - Create Corrective Action Task (if assigned)
           - Reset Task Status to "Pending Resubmission"
           - Restart SLA Timer for resubmission
           → Inspector Receives Task Back in "My Tasks → Resubmissions Required"
           → Flow Returns to Step 2.2 (Compliance Task Execution)
         ↓
Step 6: System Generates Compliance Report (Post-Approval):
         → Auto-populate DGMS-prescribed format (Form I, Form II, etc.)
         → Embed all evidence (photos, documents) as appendices
         → Add Digital Signature of Reviewer and Inspector
         → Generate PDF with QR code linking to tamper-evident logs verification
         → Store in Document Repository
         → Send Copy to: Inspector, Reviewer, Mine Manager, Corporate Compliance Head
         ↓
Step 7: System Updates Analytics:
         → Increment "Compliance Completion Rate" for mine site
         → Update Inspector Performance Scorecard
         → Log Compliance Data for AI/ML Trend Analysis
```

**Description:**
The review flow implements a quality gate ensuring compliance submissions meet regulatory standards before being recorded as complete. Tamper-Evident Logs (pg_audit) hashing at approval creates an immutable audit trail, allowing DGMS officials to verify record integrity during inspections. The reject/resubmit mechanism ensures deficiencies are corrected without bypassing compliance requirements.[^2_4][^2_5][^2_1][^2_2]

**Tamper-Evident Logs (pg_audit) Verification Process:**
When a compliance record is approved, the system:

1. Concatenates all critical data fields (compliance ID, inspector ID, reviewer ID, timestamp, GPS coordinates, checklist responses)
2. Generates SHA-256 hash: `H = SHA256(data)`
3. Stores hash on permissioned tamper-evident logs with metadata (transaction ID, block number, timestamp)
4. Embeds transaction ID in PDF report as QR code
5. DGMS auditor can scan QR code → retrieve hash from tamper-evident logs → compare with local record hash → verify integrity[^2_4]

______________________________________________________________________

### 2.4 Compliance Dashboard \& Monitoring Flow (All Users)

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLIANCE DASHBOARD FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Logs In → System Detects Role → Loads Role-Based Dashboard
         ↓
Step 2: Dashboard Layout by Role:

         ┌──────────────────────────────────────────────────────┐
         │  MINE MANAGER DASHBOARD                              │
         ├──────────────────────────────────────────────────────┤
         │  Top Row: KPI Cards (Real-Time)                      │
         │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
         │  │ Compliance│ │ Overdue  │ │ Pending  │ │ This     │ │
         │  │ Rate     │ │ Tasks    │ │ Reviews  │ │ Month    │ │
         │  │ 87%      │ │ 12       │ │ 5        │ │ 94%      │ │
         │  │ ▲ 3%     │ │ ▼ 2      │ │          │ │          │ │
         │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
         │                                                      │
         │  Middle Row: Charts                                  │
         │  ┌────────────────────┐ ┌────────────────────┐       │
         │  │ Compliance Trend   │ │ Violations by      │       │
         │  │ (Last 6 Months)    │ │ Category           │       │
         │  │ [Line Chart]       │ │ [Pie Chart]        │       │
         │  └────────────────────┘ └────────────────────┘       │
         │                                                      │
         │  Bottom Row: Tables                                  │
         │  ┌──────────────────────────────────────────────┐    │
         │  │ Overdue Compliance Tasks (Action Required)   │    │
         │  │ Task | Assigned To | Due Date | Days Overdue │    │
         │  │ ──────────────────────────────────────────── │    │
         │  │ Monthly Safety Audit | R. Kumar | 03-Sep | 3 │    │
         │  │ Ventilation Check | S. Singh | 05-Sep | 1  │    │
         │  └──────────────────────────────────────────────┘    │
         └──────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────────────────┐
         │  SAFETY OFFICER DASHBOARD                            │
         ├──────────────────────────────────────────────────────┤
         │  My Tasks Today: 8                                   │
         │  Pending Reviews: 3                                  │
         │  Overdue Actions: 1                                  │
         │                                                      │
         │  Quick Actions:                                      │
         │  [Start Inspection] [Mark Attendance] [Report Issue] │
         │                                                      │
         │  Upcoming Deadlines (Next 7 Days):                   │
         │  • 08-Sep: Weekly Fire System Test                   │
         │  • 10-Sep: Monthly Safety Audit                      │
         │  • 12-Sep: Contractor Safety Review                  │
         └──────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────────────────┐
         │  CORPORATE MANAGEMENT DASHBOARD                      │
         ├──────────────────────────────────────────────────────┤
         │  Subsidiary Comparison:                              │
         │  ┌─────────────────────────────────────────────┐     │
         │  │ Subsidiary | Compliance Rate | Overdue | Risk│     │
         │  │ ─────────────────────────────────────────── │     │
         │  │ SECL       │ 92%           │ 8       │ Low │     │
         │  │ MCL        │ 88%           │ 15      │ Med │     │
         │  │ NCL        │ 76%           │ 34      │ High│     │
         │  │ WCL        │ 94%           │ 5       │ Low │     │
         │  └─────────────────────────────────────────────┘     │
         │                                                      │
         │  Risk Heatmap: [GIS Map of India with coloured mines]│
         │  Red = High Risk, Yellow = Medium, Green = Low       │
         └──────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────────────────┐
         │  DGMS OFFICIAL DASHBOARD                             │
         ├──────────────────────────────────────────────────────┤
         │  Regulatory Overview:                                │
         │  • Total Mines Under Jurisdiction: 487              │
         │  • Compliance Submissions (This Month): 12,453      │
         │  • Violations Reported: 234                         │
         │  • Critical Non-Conformities: 12                    │
         │                                                      │
         │  Audit Queue:                                        │
         │  [Mine Name] | [Last Audit Date] | [Risk Score]     │
         │  ─────────────────────────────────────────────────  │
         │  Dipka Mine | 15-Aug-2026 | 67/100 (Medium Risk)   │
         │  Gevra Mine | 02-Sep-2026 | 45/100 (High Risk)     │
         └──────────────────────────────────────────────────────┘
         ↓
Step 3: User Interacts with Dashboard:
         • Clicks KPI Card → Drill-down to detailed list
         • Clicks Chart Segment → Filter table by category
         • Clicks Table Row → Open detailed compliance record
         • Uses Date Range Picker → Filter data by custom period
         • Clicks Export Button → Download filtered data as Excel/PDF
         ↓
Step 4: Real-Time Updates:
         • WebSocket connection pushes live updates:
           - New compliance submission → Badge count increments
           - Task approved/rejected → Notification toast appears
           - SLA breach → Red alert banner displays
         ↓
Step 5: User Customizes Dashboard (optional):
         • Drag-and-drop widgets to rearrange
         • Add/remove widgets from library
         • Set default date range (7 days, 30 days, quarter, year)
         • Save layout as personal preference
```

**Description:**
Role-based dashboards provide contextual visibility into compliance performance, enabling each user to focus on their responsibilities. Real-time WebSocket updates ensure managers see compliance status changes immediately without manual refresh. The corporate dashboard's subsidiary comparison drives accountability through transparent benchmarking, while the DGMS dashboard supports regulatory oversight with risk-based audit prioritization.[^2_8][^2_3][^2_9][^2_1][^2_2]

**Dashboard Features:**

- **Drill-Down Analytics:** Click any KPI to see underlying records (e.g., click "12 Overdue Tasks" → see list of 12 tasks with details)
- **GIS Heatmap:** Interactive map showing mine locations coloured by compliance status; click mine pin to see site-specific dashboard[^2_9][^2_2]
- **Trend Analysis:** Line charts showing compliance rate trends over time with annotations for major events (e.g., "New safety regulation implemented")
- **Export Capabilities:** One-click export of any dashboard view to PDF (for presentations) or Excel (for further analysis)

______________________________________________________________________

## 3. Inspection \& Field Reporting Flows

### 3.1 Geo-Tagged Inspection Logging Flow (Mobile App)

```
┌─────────────────────────────────────────────────────────────────┐
│           MOBILE INSPECTION LOGGING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Step 1: Inspector Opens Mobile App → Logs In
         ↓
Step 2: Inspector Navigates to: Quick Actions → "Start Inspection"
         ↓
Step 3: App Requests Location Permission (if not already granted):
         → "CM-GIP needs location access to tag your inspection. Allow?"
         → User Taps "Allow"
         ↓
Step 4: App Captures Current GPS Coordinates:
         • Latitude: 23.2599° N
         • Longitude: 81.6863° E
         • Accuracy: ±5 meters
         • Timestamp: 06-Sep-2026 10:45:32 IST
         ↓
Step 5: App Validates Location:
         → Query GIS Database: Is location within any mine lease boundary?
         → [If YES] → Display: "Location verified: [Mine Name], [Lease ID]"
         → [If NO] → Display Warning:
            "⚠️ You are outside authorized mine boundaries. 
             Inspection at this location may not be valid. Continue anyway?"
            → User Confirms or Cancels
         ↓
Step 6: Select Inspection Type (dropdown):
         • Safety Inspection (General)
         • Environmental Inspection
         • Equipment Inspection
         • Fire Safety Check
         • Ventilation Measurement
         • Roof Support Assessment
         • Contractor Work Audit
         ↓
Step 7: App Displays Inspection Template (based on type selected):
         
         Example: Safety Inspection Template
         ┌────────────────────────────────────────────────────┐
         │ SAFETY INSPECTION CHECKLIST                        │
         ├────────────────────────────────────────────────────┤
         │ Location: [Auto-filled GPS + Mine Name]            │
         │ Time: [Auto-filled 10:45 AM]                       │
         │ Inspector: [Auto-filled Name + ID]                 │
         │                                                    │
         │ Section 1: General Safety                           │
         │ [ ] 1.1 All workers wearing PPE                     │
         │ [ ] 1.2 Emergency exits accessible                  │
         │ [ ] 1.3 Fire extinguishers present & charged        │
         │ [ ] 1.4 First aid kit available                     │
         │                                                    │
         │ Section 2: Equipment Safety                         │
         │ [ ] 2.1 Machinery guards in place                   │
         │ [ ] 2.2 Warning signs visible                       │
         │ [ ] 2.3 Lockout-tagout procedures followed          │
         │                                                    │
         │ Section 3: Observations                             │
         │ [+ Add Observation]                                 │
         │                                                    │
         │ Section 4: Photos                                   │
         │ [📷 Take Photo] [📁 Upload from Gallery]            │
         │ Photos Captured: 0/5 (minimum required)             │
         │                                                    │
         │ [Save as Draft]          [Submit Inspection]        │
         └────────────────────────────────────────────────────┘
         ↓
Step 8: Inspector Fills Checklist:
         • Taps checkboxes for each item (✓ or ✗)
         • For any ✗ item, app prompts: "Add observation for this item?"
           → If Yes → Opens observation form (see Step 9)
         ↓
Step 9: Add Observation (if issues found):
         → Tap "+ Add Observation"
         → Observation Form Opens:
           • Category: Dropdown (Roof Support / Ventilation / Fire Safety / 
                               Machinery / Electrical / Transportation / Other)
           • Severity: Dropdown (Critical / Major / Minor / Suggestion)
           • Description: Text area (min 20 characters)
             "Roof bolt #A-12-34 showing signs of corrosion. Requires replacement 
              within 48 hours to prevent collapse risk."
           • Immediate Action Taken: Text area
             "Area cordoned off. Workers relocated. Maintenance team notified."
           • Photo: Mandatory (tap camera icon → take photo)
             - App auto-tags photo with GPS + timestamp
             - Photo preview shows in observation card
           • Assign To: Dropdown (Maintenance Head / Safety Officer / Manager)
           • Due Date: Date picker (auto-suggested based on severity:
             - Critical: 24 hours
             - Major: 7 days
             - Minor: 30 days)
         → Tap "Save Observation"
         → Observation added to inspection as card:
           ┌──────────────────────────────────────────────┐
           │ ⚠️ OBSERVATION #1                            │
           │ Category: Roof Support | Severity: Major     │
           │ "Roof bolt #A-12-34 showing corrosion..."    │
           │ Assigned to: Maintenance Head | Due: 08-Sep  │
           │ [📷 Photo Attached]                          │
           └──────────────────────────────────────────────┘
         ↓
Step 10: Capture Photos:
          → Tap "📷 Take Photo" button
          → App Opens Camera with Overlay Guide:
            - Grid lines for composition
            - GPS coordinates displayed
            - Timestamp displayed
          → Inspector Takes Photo:
            - Photo 1: Overall inspection area (wide angle)
            - Photo 2: Specific issue (close-up)
            - Photo 3: Equipment/machinery inspected
            - Photo 4: Workers in area (for PPE verification)
            - Photo 5: Inspector selfie with PPE (authentication)
          → Each photo auto-saves with metadata:
            - Filename: INSPECT-[MineCode]-[Timestamp]-[Seq].jpg
            - EXIF Data: GPS, timestamp, device ID, inspector ID
          → Photo thumbnails appear in inspection form
          ↓
Step 11: Inspector Reviews Inspection:
          → Scroll through all checklist items
          → Verify observations are correctly recorded
          → Check photo count meets minimum requirement
          → [If Draft] → Save to local storage for later completion
          → [If Ready to Submit] → Proceed to Step 12
          ↓
Step 12: Inspector Taps "Submit Inspection" Button:
          → App Validates:
            - All mandatory checklist items answered
            - Minimum photo count met
            - At least 1 observation if any ✗ checklist items
            - GPS coordinates captured
          → [If Validation Fails] → Highlight missing items → User Corrects
          → [If Validation Passes] → Show Confirmation Dialog:
            "Submit inspection for [Mine Name] at [Time]? 
             This will create [X] corrective action tasks."
          → User Taps "Confirm Submit"
          ↓
Step 13: App Submits Data:
          → Compress photos (reduce size for faster upload)
          → Create JSON payload with all inspection data
          → Send HTTPS POST request to API endpoint
          → [If Online] → Immediate submission
          → [If Offline] → Save to local queue → Show "Queued for Sync" badge
          ↓
Step 14: Server Processing:
          → Receive inspection data
          → Validate GPS against mine boundaries (second check)
          → Store in database with status: "Submitted"
          → Generate Inspection ID: INS-[MineCode]-[Date]-[Seq]
          → Create corrective action tasks for each observation
          → Send notifications to assigned personnel:
            "New task assigned: Roof bolt replacement at Panel A-12. Due: 08-Sep"
          → Log event: "Inspection submitted by [InspectorID] at [Timestamp]"
          ↓
Step 15: App Receives Response:
          → [If Success] → Display: "✓ Inspection Submitted Successfully"
            → Show Inspection ID: INS-SECL-060926-047
            → Show Summary:
              "5 checklist items, 2 observations, 5 photos"
            → Button: "View Details" | "Start New Inspection"
          → [If Offline] → Display: "Saved Offline. Will sync when online."
            → Badge: "1 Pending Sync" in top-right corner
          ↓
Step 16: Sync When Online (if offline submission):
          → App detects network connectivity
          → Auto-sync queued inspections in background
          → Show notification: "Synced 1 inspection to server"
          → Clear "Pending Sync" badge
```

**Description:**
This mobile-first flow enables field inspectors to conduct comprehensive, geo-tagged inspections with offline support for remote mine locations. GPS validation ensures inspections are physically conducted at authorized mine sites, preventing fraudulent remote submissions. The structured checklist approach standardizes inspection quality across all mines while observations with severity-based SLAs ensure timely corrective actions.[^2_3][^2_1][^2_2][^2_9]

**Offline Mode Details:**

- All form data stored in encrypted SQLite database on device
- Photos compressed to ~500KB each (from typical 3MB) to minimize storage
- Sync queue persists across app restarts
- Conflict resolution: If server record modified during offline period, show merge screen to user
- Maximum offline duration: 7 days (after which app requires online validation)

______________________________________________________________________

### 3.2 Corrective Action Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           CORRECTIVE ACTION TRACKING FLOW                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: System Auto-Creates Corrective Action from Inspection:
         → Inspector submits observation with severity "Major"
         → System creates task:
           - Task ID: CA-[MineCode]-[Date]-[Seq]
           - Title: "Replace corroded roof bolt #A-12-34"
           - Description: Full observation text from inspection
           - Assigned To: Maintenance Head (selected by inspector)
           - Due Date: 08-Sep-2026 (7 days from creation, based on severity)
           - Priority: High
           - Status: "Open"
           - Linked Inspection: INS-SECL-060926-047
         ↓
Step 2: Assigned User Receives Notification:
         • Push Notification: "New corrective action assigned: Replace roof bolt #A-12-34. Due: 08-Sep"
         • SMS: "CM-GIP: Task CA-SECL-060926-089 assigned. Due in 7 days. Login to app."
         • Email: Detailed task description with inspection link
         ↓
Step 3: User Opens Task from Dashboard → "My Tasks → Corrective Actions"
         ↓
Step 4: Task Detail Screen Shows:
         ┌────────────────────────────────────────────────────┐
         │ CORRECTIVE ACTION: CA-SECL-060926-089              │
         ├────────────────────────────────────────────────────┤
         │ Status: 🔴 Open (Due: 08-Sep-2026)                 │
         │                                                    │
         │ Issue: Roof bolt #A-12-34 showing corrosion        │
         │ Location: Panel A-12, Gevra Mine                   │
         │ Reported By: R. Kumar (Inspector)                  │
         │ Reported On: 06-Sep-2026 10:45 AM                  │
         │                                                    │
         │ [📷 View Inspection Photos] [📍 View on Map]       │
         │                                                    │
         │ Action Required:                                   │
         │ "Replace corroded roof bolt with new Grade-8 bolt  │
         │  as per Regulation 119, CMR 2017"                  │
         │                                                    │
         │ [Start Work]  [Request Extension]  [Escalate]      │
         └────────────────────────────────────────────────────┘
         ↓
Step 5: User Clicks "Start Work" Button:
         → System Logs: "Work Started by [UserID] at [Timestamp]"
         → Change Status: "In Progress"
         → Start Timer (for SLA tracking)
         ↓
Step 6: User Completes Work:
         → physically replaces roof bolt
         → Takes before/after photos
         ↓
Step 7: User Opens App → Navigates to Task → Clicks "Mark Complete"
         ↓
Step 8: Completion Form Opens:
         ┌────────────────────────────────────────────────────┐
         │ TASK COMPLETION REPORT                             │
         ├────────────────────────────────────────────────────┤
         │ Work Completed: [Yes/No]                           │
         │                                                    │
         │ Completion Date: [Auto-filled today's date]        │
         │ Time Taken: [Auto-calculated from start time]      │
         │                                                    │
         │ Work Description:                                  │
         │ "Replaced roof bolt #A-12-34 with new Grade-8 bolt.│
         │  Torque applied: 450 Nm. Area cleared for work."  │
         │                                                    │
         │ Photos (mandatory, min 2):                         │
         │ [📷 Photo 1: New bolt installed]                   │
         │ [📷 Photo 2: Torque wrench reading]                │
         │                                                    │
         │ Additional Comments:                               │
         │ "Old bolt sent to lab for metallurgical analysis." │
         │                                                    │
         │ [Submit Completion Report]                         │
         └────────────────────────────────────────────────────┘
         ↓
Step 9: User Submits Completion Report:
         → App Validates: Minimum 2 photos attached
         → Submits to server
         → Change Status: "Completed - Pending Verification"
         ↓
Step 10: System Notifies Original Inspector (or Safety Head):
          • "Corrective action CA-SECL-060926-089 marked complete by [UserName]. 
             Please verify closure."
          ↓
Step 11: Verifier Opens Task → Reviews Completion Report:
          → Checks photos show work completed satisfactorily
          → [If Satisfied] → Click "Verify & Close"
          → [If Not Satisfied] → Click "Reopen" → Add Comments:
            "Photo unclear. Please retake with better lighting showing bolt ID."
          ↓
Step 12: [If Verified]:
          → Change Status: "Closed - Verified"
          → Log Event: "Corrective action closed by [VerifierID] at [Timestamp]"
          → Generate Tamper-Evident Logs (pg_audit) Hash for audit trail
          → Update Inspection Record: Link closed corrective action
          → Send Notification to All Stakeholders:
            "Corrective action CA-SECL-060926-089 closed successfully."
          ↓
Step 13: [If Reopened]:
          → Change Status: "Reopened - Requires Rework"
          → Send Notification to Assigned User:
            "Task CA-SECL-060926-089 reopened. Reason: [Comments]. 
             Please complete by [New Due Date]."
          → Return to Step 5
          ↓
Step 14: System Updates Analytics:
          → Increment "Corrective Action Closure Rate" for mine site
          → Update Maintenance Team Performance Scorecard
          → Log Data for AI/ML Analysis (e.g., recurring roof bolt issues)
```

**Description:**
This flow ensures every observation from inspections translates into trackable corrective actions with clear ownership and deadlines. The verification step prevents premature closure without actual remediation, maintaining accountability. Tamper-Evident Logs (pg_audit) hashing at closure creates an immutable record linking the original issue to its resolution, valuable for regulatory audits and incident investigations.[^2_1][^2_2][^2_4]

**SLA Enforcement:**

- **Critical:** 24 hours to complete, auto-escalate to Mine Manager after 12 hours
- **Major:** 7 days to complete, auto-escalate to Safety Head after 5 days
- **Minor:** 30 days to complete, auto-escalate to Department Head after 25 days
- Escalation includes SMS/email to higher authority with task details and delay reason

______________________________________________________________________

## 4. Worker Attendance \& Contractor Management Flows

### 4.1 Worker Attendance Marking Flow (Mobile/Kiosk)

```
┌─────────────────────────────────────────────────────────────────┐
│              WORKER ATTENDANCE MARKING FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Worker Arrives at Mine Entry Point
         ↓
Step 2: Worker Opens Mobile App OR Uses On-Site Kiosk
         ↓
Step 3: Authentication:
         
         Option A: Mobile App (Worker has smartphone)
         → Worker Logs In (mobile number + OTP, first-time setup)
         → Navigates to: "Mark Attendance"
         
         Option B: Kiosk (Worker uses shared device)
         → Worker Enters:
           - Employee ID / Aadhaar Number
           - Or Scans QR Code on Employee Badge
         → Kiosk Captures Photo (for face recognition verification)
         
         Option C: Biometric Device Integration
         → Worker Places Finger on Scanner
         → Device Sends Employee ID to CM-GIP API
         ↓
Step 4: App/Kiosk Captures Location:
         → GPS Coordinates: Must be within mine premises geofence
         → [If Outside Geofence] → Display Error:
           "Attendance can only be marked within mine premises. 
            Current location: [X meters] outside boundary."
         → [If Inside Geofence] → Proceed
         ↓
Step 5: System Validates Worker Eligibility:
         → Query Database:
           - Is worker active (not terminated)?
           - Is shift currently open (not marked attendance already)?
           - Is worker assigned to this mine site?
         → [If Validation Fails] → Display Specific Error:
           "You are not assigned to Gevra Mine. Contact HR."
           OR
           "Attendance already marked for today's shift at 06:15 AM."
         ↓
Step 6: Capture Attendance Photo (Mandatory):
         → App Opens Camera (front-facing)
         → Display Overlay: "Position face in frame"
         → Worker Takes Selfie:
           - Photo must show face clearly (AI face detection validates)
           - Photo auto-tagged with GPS + timestamp
           - Photo stored with attendance record
         → [If Face Not Detected] → Prompt: "Please ensure face is visible. Remove helmet/mask if safe."
         ↓
Step 7: Select Shift (if multiple shifts):
         → Dropdown:
           - Morning Shift (06:00 AM - 02:00 PM)
           - Afternoon Shift (02:00 PM - 10:00 PM)
           - Night Shift (10:00 PM - 06:00 AM)
         → Auto-selected based on current time (editable within 30-min window)
         ↓
Step 8: Worker Reviews & Submits:
         → Display Summary:
           ┌────────────────────────────────────────┐
           │ ATTENDANCE SUMMARY                     │
           ├────────────────────────────────────────┤
           │ Name: Ramesh Kumar                     │
           │ ID: WKR-SECL-04521                     │
           │ Mine: Gevra Mine, Panel A-12           │
           │ Time: 06-Sep-2026 06:42 AM             │
           │ Shift: Morning (06:00 AM - 02:00 PM)   │
           │ Location: 23.2599° N, 81.6863° E       │
           │                                        │
           │ [📷 Photo Attached]                    │
           │                                        │
           │ [Submit Attendance]                    │
           └────────────────────────────────────────┘
         → Worker Taps "Submit Attendance"
         ↓
Step 9: System Processes Attendance:
         → Validate:
           - GPS within geofence (±50m tolerance)
           - Time within shift window (±30 min early/late allowed)
           - Photo passes face detection (not a blank/invalid image)
         → [If Validation Passes] → Save Record:
           - Attendance ID: ATT-[MineCode]-[Date]-[Seq]
           - Status: "Present"
           - Late Flag: true if >30 min after shift start
         → [If Validation Fails] → Reject with Reason:
           "Location outside mine boundary. Attendance not recorded."
         ↓
Step 10: System Updates Real-Time Dashboards:
          → Increment "Workers Present" count on mine dashboard
          → Update contractor workforce count (if contractor worker)
          → Log Event: "Attendance marked by [WorkerID] at [Timestamp]"
          ↓
Step 11: Worker Receives Confirmation:
          → Display: "✓ Attendance Marked Successfully"
          → Show:
            - Attendance ID
            - Shift timings
            - Expected checkout time
          → Button: "Mark Checkout" (enabled at shift end)
          ↓
Step 12: [Optional] Safety Briefing Acknowledgment:
          → If mine requires pre-shift safety briefing:
            → Play 2-minute safety video (in Hindi/English)
            → Worker Taps "I Acknowledge Safety Instructions"
            → Log: "Safety briefing acknowledged by [WorkerID]"
          ↓
Step 13: End of Shift - Checkout:
          → Worker Returns to App/Kiosk at shift end
          → Taps "Mark Checkout"
          → System Captures:
            - Checkout time
            - GPS location (must be within mine premises)
            - Optional: Exit photo
          → Calculate:
            - Total hours worked
            - Overtime (if >8 hours)
            → Update Attendance Record: "Completed"
          → Send Notification to Contractor/HR:
            "Worker [Name] completed shift: 06:00 AM - 02:15 PM (8h 15m)"
```

**Description:**
This flow ensures accurate, fraud-resistant attendance tracking with geo-fencing and photo verification to prevent proxy marking. Integration with contractor management enables real-time workforce monitoring for safety compliance (e.g., ensuring only trained workers enter hazardous zones). The optional safety briefing acknowledgment reinforces safety culture and provides audit evidence for regulatory inspections.[^2_5][^2_2][^2_1][^2_4]

**Geofencing Details:**

- Each mine site has polygon boundaries defined in GIS database
- GPS accuracy threshold: ±50 meters (accounts for signal drift in open-pit mines)
- Offline mode: Attendance cached locally with GPS; validated against geofence when online
- Exception handling: If GPS unavailable (underground), use RFID gate entry logs as backup

______________________________________________________________________

### 4.2 Contractor Workforce Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│          CONTRACTOR WORKFORCE MANAGEMENT FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Contractor Company Registration (One-Time Setup):
         → Contractor Admin Navigates to: Contractor Portal → Register Company
         → Fills Form:
           - Company Name: "ABC Mining Services Pvt Ltd"
           - GST Number: (validated via GST API)
           - PAN Number: (validated)
           - Registered Address
           - Contact Person: Name, Mobile, Email
           - Bank Details: For payment integration
           - Safety Certifications: Upload ISO 45001, DGMS approvals
         → System Validates:
           - GST/PAN authenticity via government APIs
           - Email/mobile via OTP
         → Submit for Approval
         ↓
Step 2: Mine Safety Head Reviews Contractor Application:
         → Navigates to: Contractor Management → Pending Approvals
         → Reviews:
           - Company credentials
           - Safety certifications (validity dates)
           - Past performance (if previously worked with CIL)
         → [If Approved] → Click "Approve"
         → System:
           - Generate Contractor ID: CONT-[Subsidiary]-[Seq]
           - Activate Account
           → Send Email: "Contractor registration approved. Login credentials sent."
         ↓
Step 3: Contractor Adds Workers to Roster:
         → Contractor Admin Logs In → "Manage Workforce"
         → Clicks "Add Worker"
         → Enters Worker Details:
           - Full Name
           - Aadhaar Number (validated via UIDAI API)
           - Mobile Number
           - Emergency Contact
           - Blood Group
           - Medical Fitness Certificate (upload, expiry date tracked)
           - Safety Training Certificates (upload, expiry tracked)
           - Assigned Mine Site(s)
           - Designation: Helper, Driller, Blaster, Equipment Operator, etc.
         → System Validates:
           - Aadhaar format (12 digits)
           - Mobile uniqueness (worker not already registered with another contractor)
         → Submit
         ↓
Step 4: System Checks Mandatory Training:
         → Query: Does worker have valid safety training certificate?
         → [If No] → Flag: "Training Required"
         → Send Notification to Contractor:
           "Worker [Name] cannot be deployed until safety training completed. 
            Book training at [Link to CIL Training Portal]"
         → [If Yes] → Approve Worker for Deployment
         → Generate Worker QR Code Badge (printable):
           - Contains: Worker ID, Name, Photo, Contractor, Valid Until
           - QR code links to worker profile in CM-GIP
         ↓
Step 5: Daily Workforce Deployment:
         → Contractor Foreman Opens App → "Deploy Workers"
         → Selects Date: Today
         → Selects Mine Site: Gevra Mine
         → Selects Workers from Roster (checkboxes):
           [✓] Ramesh Kumar (WKR-CONT-001)
           [✓] Suresh Yadav (WKR-CONT-002)
           [✓] Mohan Lal (WKR-CONT-003)
         → Assigns Work Location:
           - Panel A-12 (for Ramesh, Suresh)
           - Haul Road-3 (for Mohan)
         → Assigns Task Category:
           - Roof Bolting (for Ramesh, Suresh)
           - Road Maintenance (for Mohan)
         → Submits Deployment Plan
         ↓
Step 6: System Validates Deployment:
         → Checks:
           - All selected workers have valid medical & training certificates
           - Workers not on leave/blocked
           - Work location within contractor's authorized scope
         → [If Validation Passes] → Approve Deployment
         → Send Notifications:
           - To Workers: "You are deployed to Gevra Mine, Panel A-12 today. 
                          Report by 06:00 AM."
           - To Mine Safety Officer: "Contractor ABC Mining deploying 3 workers 
                                      to Panel A-12 today."
         ↓
Step 7: Workers Mark Attendance (as per Flow 4.1):
         → Each worker marks attendance individually
         → System Links Attendance to Contractor Deployment Record
         ↓
Step 8: Real-Time Contractor Dashboard (Mine Safety Officer View):
         ┌────────────────────────────────────────────────────┐
         │ CONTRACTOR WORKFORCE - GEVRA MINE                  │
         ├────────────────────────────────────────────────────┤
         │ Today's Date: 06-Sep-2026                          │
         │                                                    │
         │ Contractor: ABC Mining Services                    │
         │ Deployed: 3 | Present: 3 | Absent: 0               │
         │                                                    │
         │ Worker List:                                       │
         │ ┌─────────────────────────────────────────────┐   │
         │ │ Name        | Status  | Location    | Time  │   │
         │ │ ─────────────────────────────────────────── │   │
         │ │ Ramesh K.   | ✓ Present| Panel A-12 | 06:42 │   │
         │ │ Suresh Y.   | ✓ Present| Panel A-12 | 06:45 │   │
         │ │ Mohan L.    | ✓ Present| Haul Road-3| 06:50 │   │
         │ └─────────────────────────────────────────────┘   │
         │                                                    │
         │ [View Attendance Logs] [Download Report]           │
         └────────────────────────────────────────────────────┘
         ↓
Step 9: End-of-Day Work Log Submission (Contractor Foreman):
         → Foreman Opens App → "Submit Work Log"
         → Selects Date: Today
         → For Each Worker, Enters:
           - Hours Worked: Auto-filled from attendance (editable with reason)
           - Task Completed: "Installed 12 roof bolts in Panel A-12"
           - Equipment Used: "Roof bolter machine #RB-04"
           - Materials Consumed: "12 roof bolts, 24 resin cartridges"
           - Safety Incidents: "None" (or link to incident report if any)
           - Photos: Upload work progress photos (mandatory)
         → Submits Work Log
         ↓
Step 10: Mine Manager Reviews Work Log:
          → Navigates to: Contractor → Work Logs → Pending Review
          → Reviews:
            - Work completed matches deployment plan
            - Photos show satisfactory progress
            - Materials consumed reasonable for work done
          → [If Approved] → Click "Approve"
          → System:
            - Update Contractor Performance Scorecard
            - Link work log to payment milestone (if integrated with billing)
            - Log data for productivity analytics
          ↓
Step 11: Monthly Contractor Performance Report (Auto-Generated):
          → System Aggregates Data for Month:
            - Total workers deployed
            - Attendance compliance rate
            - Safety incidents (if any)
            - Work quality score (from manager reviews)
            - On-time completion rate
          → Generates Report Card:
            ┌────────────────────────────────────────────┐
            │ CONTRACTOR PERFORMANCE: ABC Mining         │
            │ Month: August 2026                         │
            ├────────────────────────────────────────────┤
            │ Overall Score: 87/100 (Grade: A)           │
            │                                            │
            │ Attendance Compliance: 96%                 │
            │ Safety Incidents: 0                        │
            │ Work Quality: 4.5/5                        │
            │ On-Time Completion: 94%                    │
            │                                            │
            │ Status: Approved for Next Month Deployment │
            └────────────────────────────────────────────┘
          → Send to Contractor & Mine Management
```

**Description:**
This comprehensive contractor management flow ensures only certified, trained workers are deployed to mine sites with real-time visibility for safety officers. Integration of attendance, work logs, and performance scoring creates accountability and enables data-driven contractor selection. Mandatory training certificate validation prevents deployment of untrained workers, reducing accident risks.[^2_2][^2_5][^2_1][^2_4]

**Integration Points:**

- **GST/PAN Validation:** Real-time API calls to government databases for contractor verification
- **UIDAI Aadhaar:** Worker identity verification (with consent)
- **CIL Training Portal:** Direct link for booking mandatory safety courses
- **Payment System:** Work log approval triggers payment milestone tracking in finance module

______________________________________________________________________

## 5. Incident Reporting \& Grievance Handling Flows

### 5.1 Accident/Incident Reporting Flow (Mobile App)

```
┌─────────────────────────────────────────────────────────────────┐
│              ACCIDENT/INCIDENT REPORTING FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Incident Occurs at Mine Site
         ↓
Step 2: Witness/Supervisor Opens Mobile App → "Report Incident"
         ↓
Step 3: App Captures Immediate Context:
         → GPS Coordinates: Auto-captured (±5m accuracy)
         → Timestamp: Auto-captured (cannot be edited)
         → Reporter Info: Auto-filled (Name, ID, Role, Mobile)
         ↓
Step 4: Select Incident Type (dropdown, mandatory):
         • Fatal Accident
         • Serious Bodily Injury
         • Minor Injury (First Aid Only)
         • Dangerous Occurrence (near-miss)
         • Fire Outbreak
         • Roof Fall
         • Equipment Failure
         • Gas Leak (Methane, CO, etc.)
         • Transportation Accident
         • Electrical Shock
         • Other (specify)
         ↓
Step 5: Fill DGMS-Mandated Incident Form (Form I / Form II):
         ┌────────────────────────────────────────────────────┐
         │ INCIDENT REPORT (DGMS Form I)                      │
         ├────────────────────────────────────────────────────┤
         │ Section A: Basic Information                        │
         │ Mine Name: [Auto-filled]                           │
         │ Location: [GPS + Description: "Panel A-12, 450m    │
         │             from main shaft"]                       │
         │ Date & Time of Incident: [Auto-filled, editable    │
         │                          within 5-min tolerance]    │
         │                                                    │
         │ Section B: Persons Involved                         │
         │ [+ Add Person]                                      │
         │ ┌──────────────────────────────────────────────┐   │
         │ │ Person 1:                                     │   │
         │ │ Name: Ramesh Kumar                            │   │
         │ │ ID: WKR-SECL-04521                            │   │
         │ │ Role: Roof Bolter                             │   │
         │ │ Injury Type: Fracture (Left Leg)              │   │
         │ │ Severity: Serious (Hospitalized)              │   │
         │ │ Hospital: Gevra Mine Hospital                 │   │
         │ │ Treatment: Surgery scheduled                  │   │
         │ └──────────────────────────────────────────────┘   │
         │                                                    │
         │ Section C: Incident Description                     │
         │ "While installing roof bolts at Panel A-12, a      │
         │  loose rock fell from roof (approx 5kg) and       │
         │  struck worker's left leg. Worker was wearing     │
         │  safety boots but bone fracture occurred."        │
         │ (Min 50 characters)                                │
         │                                                    │
         │ Section D: Immediate Actions Taken                  │
         │ "• Area evacuated immediately                       │
         │  • First aid administered by on-site medic         │
         │  • Worker transported to mine hospital at 11:15 AM │
         │  • Roof area inspected by safety officer           │
         │  • Work suspended pending investigation"           │
         │                                                    │
         │ Section E: Root Cause (Preliminary)                 │
         │ "Inadequate roof inspection prior to work          │
         │  commencement. Loose rock not detected in pre-shift│
         │  examination."                                     │
         │                                                    │
         │ Section F: Photos & Evidence (mandatory, min 5)     │
         │ [📷 Photo 1: Incident location (wide)]             │
         │ [📷 Photo 2: Fallen rock]                          │
         │ [📷 Photo 3: Injured worker (with consent)]        │
         │ [📷 Photo 4: Roof condition after incident]        │
         │ [📷 Photo 5: Safety equipment at scene]            │
         │                                                    │
         │ Section G: Witnesses                                │
         │ [+ Add Witness]                                     │
         │ Witness 1: Suresh Yadav (WKR-SECL-04522)           │
         │            Mobile: 98765XXXXX                      │
         │                                                    │
         │ Section H: Reporter Declaration                     │
         │ [✓] I confirm this report is accurate to best of   │
         │     my knowledge.                                  │
         │                                                    │
         │ [Save as Draft]          [Submit Incident Report]  │
         └────────────────────────────────────────────────────┘
         ↓
Step 6: System Validates Form:
         → Checks:
           - All mandatory DGMS fields filled (per Mines Act 1952) [^2_18][^2_24]
           - Minimum 5 photos attached
           - At least 1 person involved (for injury incidents)
           - GPS coordinates within mine boundary
         → [If Validation Fails] → Highlight missing fields → User Corrects
         ↓
Step 7: Reporter Submits Incident Report:
         → Taps "Submit Incident Report"
         → System:
           - Generate Incident ID: INC-[MineCode]-[Date]-[Seq]
           - Status: "Reported - Under Investigation"
           - Priority: Critical (auto-set for all incidents)
         ↓
Step 8: System Triggers Immediate Alerts (Parallel Notifications):
         → SMS to Mine Manager:
           "URGENT: Incident INC-SECL-060926-012 reported at Panel A-12. 
            Serious injury. Reporter: R. Kumar. Time: 11:05 AM."
         → SMS to Safety Head:
           "Incident reported at Gevra Mine. DGMS Form I submitted. 
            Investigation required within 24 hours."
         → SMS to Subsidiary Head:
           "Critical incident at Gevra Mine. 1 serious injury. 
            Report ID: INC-SECL-060926-012"
         → Email to DGMS Regional Office (auto-generated):
           Subject: "Incident Report - Gevra Mine - 06-Sep-2026"
           Body: DGMS Form I data (as per regulatory requirement) [^2_18][^2_23]
         → Push Notification to Emergency Response Team:
           "Incident at Panel A-12. Assemble at mine entrance immediately."
         ↓
Step 9: System Creates Investigation Task:
         → Auto-assigns to Safety Head + Mine Manager
         → Due Date: 24 hours from incident (DGMS requirement) [^2_18]
         → Task: "Conduct incident investigation for INC-SECL-060926-012"
         → Attachments: Full incident report, photos, witness statements
         ↓
Step 10: Incident Dashboard Updates (Real-Time):
          → Mine Dashboard: Red alert banner "Critical Incident Reported"
          → Corporate Dashboard: Increment incident count for subsidiary
          → DGMS Dashboard: New incident appears in "Recent Incidents" queue
          ↓
Step 11: Investigation Process (Separate Flow):
          → Safety Head Opens Investigation Module
          → Conducts root cause analysis (5-Why, Fishbone diagram)
          → Interviews witnesses (statements recorded in app)
          → Uploads investigation report with findings:
            - Root cause
            - Contributing factors
            - Corrective actions (immediate & long-term)
            - Responsible persons for each action
            - Prevention measures
          → Submits to Mine Manager for review
          → Mine Manager Approves → Final Report Generated
          → Submit to DGMS within 24 hours (regulatory compliance) [^2_18][^2_23]
          ↓
Step 12: Post-Incident Actions:
          → System Tracks All Corrective Actions from Investigation
          → Sends Reminders Until Closure
          → Updates Safety Training Modules (if training gap identified)
          → Logs Incident in Historical Database for AI/ML Analysis
          → Generates Monthly Safety Report with Incident Trends
```

**Description:**
This flow ensures rapid, compliant incident reporting aligned with DGMS Form I/Form II requirements under Mines Act 1952. Immediate multi-level notifications enable swift emergency response and regulatory compliance. The structured form captures all mandatory data points for statutory reporting while photos and witness statements support thorough investigations.[^2_6][^2_7][^2_8][^2_3][^2_5]

**Regulatory Compliance:**

- **DGMS Form I:** Reportable within 24 hours for serious bodily injury[^2_5]
- **DGMS Form II:** Monthly summary of all incidents (auto-generated by system)
- **Fatal Accidents:** Immediate telephonic intimation to DGMS required (system provides one-tap call feature)
- **Investigation Timeline:** 24 hours for preliminary report, 30 days for final report with root cause analysis

______________________________________________________________________

### 5.2 Worker Grievance Redressal Flow

```
┌─────────────────────────────────────────────────────────────────┐
│             WORKER GRIEVANCE REDRESSAL FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Worker Opens Mobile App → "Submit Grievance"
         ↓
Step 2: Select Grievance Category (dropdown):
         • Salary/Payment Delay
         • Safety Concern
         • Harassment/Discrimination
         • Working Conditions
         • Equipment/Facility Issue
         • Contractor Misconduct
         • Medical/Health Issue
         • Leave/Attendance Dispute
         • Other (specify)
         ↓
Step 3: Choose Submission Mode:
         ○ Identified (my details will be shown)
         ○ Anonymous (my identity hidden from recipient)
         → [If Anonymous] → System Generates Random Grievance ID:
           "ANON-SECL-060926-089"
           → Worker Noted: "Save this ID to track your grievance status"
         ↓
Step 4: Fill Grievance Form:
         ┌────────────────────────────────────────────────────┐
         │ GRIEVANCE SUBMISSION FORM                          │
         ├────────────────────────────────────────────────────┤
         │ Category: Safety Concern                           │
         │                                                    │
         │ Subject: "Inadequate ventilation at Panel A-12"    │
         │ (Max 100 characters)                               │
         │                                                    │
         │ Description:                                       │
         │ "For past 3 days, air flow at Panel A-12 working   │
         │  face is very low. Dust accumulation causing       │
         │  breathing difficulty for 8 workers. Ventilation   │
         │  duct has tear at 200m from main road. Request     │
         │  immediate repair."                                │
         │ (Min 50 characters, max 1000)                      │
         │                                                    │
         │ Location: Panel A-12, Gevra Mine                   │
         │ (Auto-filled GPS if submitted from site)           │
         │                                                    │
         │ Affected Workers: 8 (including myself)             │
         │                                                    │
         │ Upload Evidence (optional):                        │
         │ [📷 Photo 1: Ventilation duct tear]                │
         │ [📄 Document: Dust measurement reading]            │
         │                                                    │
         │ Priority: [Auto-set based on category]             │
         │ • Safety Concern → High Priority                   │
         │                                                    │
         │ Preferred Resolution Timeline:                     │
         │ ○ Urgent (within 24 hours)                         │
         │ ○ Within 3 days                                    │
         │ ○ Within 7 days                                    │
         │                                                    │
         │ [✓] I confirm this grievance is genuine and not    │
         │     malicious.                                     │
         │                                                    │
         │ [Submit Grievance]                                 │
         └────────────────────────────────────────────────────┘
         ↓
Step 5: System Validates & Submits:
         → Checks:
           - Category selected
           - Subject & description within character limits
           - No profanity/abusive language (AI content filter)
         → [If Validation Passes] → Generate Grievance ID:
           - GRV-SECL-060926-047 (identified)
           - ANON-SECL-060926-089 (anonymous)
         → Save to Database with Status: "Submitted"
         ↓
Step 6: System Routes Grievance Based on Category:
         ┌────────────────────────────────────────────────────┐
         │ Category          | Escalation Path                │
         ├────────────────────────────────────────────────────┤
         │ Safety Concern    → Safety Head → Mine Manager     │
         │ Salary/Payment    → Contractor → HR → Finance      │
         │ Harassment        → HR Head → Subsidiary MD        │
         │ Working Conditions→ Supervisor → Safety Officer    │
         │ Medical Issue     → Mine Medical Officer → HR      │
         └────────────────────────────────────────────────────┘
         ↓
Step 7: Assigned Officer Receives Notification:
         • SMS: "New grievance GRV-SECL-060926-047: Safety concern at Panel A-12. 
                Respond within 48 hours."
         • Email: Full grievance details with worker info (if identified)
         • In-App: Badge on "Grievances" menu item
         ↓
Step 8: Officer Reviews Grievance → Opens Detail Screen:
         ┌────────────────────────────────────────────────────┐
         │ GRIEVANCE: GRV-SECL-060926-047                     │
         ├────────────────────────────────────────────────────┤
         │ Status: 🔵 Submitted (Due: 08-Sep-2026)            │
         │ Priority: High                                     │
         │                                                    │
         │ Worker: Ramesh Kumar (WKR-SECL-04521)              │
         │ [If Anonymous: "Anonymous Worker"]                 │
         │ Mine: Gevra Mine, Panel A-12                       │
         │ Submitted: 06-Sep-2026 02:15 PM                    │
         │                                                    │
         │ Subject: Inadequate ventilation at Panel A-12      │
         │                                                    │
         │ Description:                                       │
         │ "For past 3 days, air flow at Panel A-12..."       │
         │ (full text)                                        │
         │                                                    │
         │ [📷 View Attached Photos]                          │
         │                                                    │
         │ [Take Action]  [Request More Info]  [Escalate]     │
         └────────────────────────────────────────────────────┘
         ↓
Step 9: Officer Takes Action (Multiple Paths):
         
         Path A: Direct Resolution
         → Officer Investigates (visits site, checks ventilation)
         → Finds: Ventilation duct torn, orders immediate repair
         → Repairs completed within 4 hours
         → Officer Opens Grievance → "Mark Resolved"
         → Enters Resolution Details:
           "Ventilation duct repaired at 6:00 PM. Air flow restored 
            to 3.5 m/s. Dust levels normalized."
         → Uploads Photo: Repaired duct
         → Submits
         → System:
           - Change Status: "Resolved"
           - Send Notification to Worker:
             "Your grievance GRV-SECL-060926-047 has been resolved. 
              View details in app."
         
         Path B: Request More Information
         → Officer Clicks "Request More Info"
         → Enters Question:
           "Please specify exact location of duct tear (distance from 
            main road, height from floor)."
         → Submits
         → System:
           - Change Status: "Awaiting Worker Response"
           - Send Notification to Worker:
             "Safety Head requests more info on your grievance. 
              Please respond within 24 hours."
         → Worker Receives → Opens App → Provides Info
         → Officer Receives Response → Continues Investigation
         
         Path C: Escalate to Higher Authority
         → Officer Determines: Issue requires mine manager approval
         → Clicks "Escalate"
         → Selects Escalate To: Mine Manager
         → Adds Comments:
           "Ventilation duct requires replacement (not repair). 
            Budget approval needed."
         → Submits
         → System:
           - Change Status: "Escalated"
           - Assign to Mine Manager
           - Reset SLA Timer (new 48-hour deadline for manager)
           - Notify Manager
         ↓
Step 10: SLA Tracking & Auto-Escalation:
          → System Monitors Grievance Age:
            - High Priority: 48 hours to resolve
            - Medium Priority: 7 days
            - Low Priority: 15 days
          → [If SLA Breach Imminent (80% time elapsed)] → Send Reminder:
            "Grievance GRV-SECL-060926-047 due in 10 hours. Please resolve."
          → [If SLA Breached] → Auto-Escalate:
            - Change Status: "Overdue - Escalated"
            - Notify Next Level Authority (Mine Manager → Subsidiary Head)
            - Log Delay Reason: "No action by assigned officer"
          ↓
Step 11: Worker Receives Resolution → Reviews & Provides Feedback:
          → Worker Opens App → "My Grievances" → Selects GRV-SECL-060926-047
          → Views Resolution Details & Photos
          → System Prompts:
            "Are you satisfied with the resolution?"
            ○ Yes, Satisfied
            ○ Partially Satisfied
            ○ Not Satisfied
          → Worker Selects: "Yes, Satisfied"
          → Optional Comment: "Ventilation restored. Thank you."
          → Submits Feedback
          → System:
            - Change Status: "Closed - Worker Satisfied"
            - Log Feedback for Performance Analytics
          ↓
Step 12: [If Worker Not Satisfied]:
          → Worker Selects: "Not Satisfied"
          → Enters Reason: "Duct repair temporary. Tearing again after 2 days."
          → Submits
          → System:
            - Change Status: "Reopened"
            - Notify Officer: "Worker not satisfied. Grievance reopened."
            - Reset SLA Timer
            → Return to Step 9
          ↓
Step 13: Monthly Grievance Analytics Report (Auto-Generated):
          → System Aggregates:
            - Total grievances submitted
            - Average resolution time
            - Satisfaction rate (% resolved with worker satisfaction)
            - Category-wise breakdown
            - Repeat grievances (same issue, same location)
          → Generates Report for Mine Manager:
            ┌────────────────────────────────────────────┐
            │ GRIEVANCE ANALYTICS: GEVRA MINE            │
            │ Month: August 2026                         │
            ├────────────────────────────────────────────┤
            │ Total Grievances: 47                       │
            │ Resolved: 45 (96%)                         │
            │ Avg Resolution Time: 1.8 days              │
            │ Worker Satisfaction: 91%                   │
            │                                            │
            │ Top Categories:                            │
            │ • Safety Concern: 18                       │
            │ • Equipment Issue: 12                      │
            │ • Working Conditions: 9                    │
            │                                            │
            │ Repeat Issues: 3 (Ventilation at Panel A-12│
            │              addressed in safety meeting)  │
            └────────────────────────────────────────────┘
          → Send to: Mine Manager, Safety Head, HR Head, Subsidiary Head
```

**Description:**
This grievance redressal flow provides workers a safe, accessible channel to report concerns with anonymous option for sensitive issues. Category-based routing ensures grievances reach appropriate authorities while SLA tracking and auto-escalation prevent delays. Worker feedback mechanism ensures resolutions are genuine and not just checkbox closures, improving trust in the system.[^2_10][^2_3][^2_1][^2_2]

**Key Features:**

- **Anonymous Submission:** Protects workers from retaliation; grievance tracked via random ID
- **AI Content Filter:** Scans for abusive language, false allegations, or malicious content before submission
- **Multi-Level Escalation:** Automatic escalation path ensures grievances never get stuck
- **Feedback Loop:** Worker satisfaction rating drives performance metrics for officers
- **Repeat Issue Detection:** AI identifies recurring grievances from same location/category, triggering systemic fixes

______________________________________________________________________

## 6. AI/ML Analytics \& Predictive Alerting Flows

### 6.1 AI-Powered Risk Prediction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            AI-POWERED RISK PREDICTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: Data Ingestion (Continuous, Real-Time):
         → System Aggregates Data from Multiple Sources:
           • Historical compliance records (last 3 years)
           • Inspection observations (categorized by type, severity, location)
           • Incident/accident database
           • Corrective action closure rates
           • Worker attendance patterns
           • Contractor performance scores
           • Environmental sensor data (methane levels, dust, ventilation)
           • Equipment maintenance logs
           • Weather data (rainfall, temperature, humidity)
         → Data Stored in Data Warehouse (ClickHouse/Redshift)
         ↓
Step 2: Feature Engineering (Daily Batch Process):
         → AI Pipeline Extracts Features:
           • Compliance completion rate (per mine, per category)
           • Average days overdue for compliance tasks
           • Number of critical observations in last 30 days
           • Incident frequency (per 100,000 work hours)
           • Corrective action closure rate (%)
           • Worker turnover rate (contractor workforce)
           • Equipment downtime hours
           • Methane level exceedances (count per month)
           • Roof fall incidents (last 6 months)
           • Safety training completion rate (%)
         → Features Normalized (0-1 scale) for ML Model
         ↓
Step 3: ML Model Inference (Real-Time Scoring):
         → Load Pre-Trained Model (Random Forest / XGBoost):
           - Trained on 3 years historical data from all CIL mines
           - Target Variable: "Risk Score" (0-100, derived from incident frequency 
             and severity)
         → Input: Current feature vector for each mine site
         → Output: Risk Score (0-100) + Risk Category:
           - 0-30: Low Risk (Green)
           - 31-60: Medium Risk (Yellow)
           - 61-85: High Risk (Orange)
           - 86-100: Critical Risk (Red)
         → Example Output:
           ┌────────────────────────────────────────────┐
           │ Mine: Gevra (SECL)                         │
           │ Risk Score: 72/100                         │
           │ Category: HIGH RISK (Orange)               │
           │                                            │
           │ Top Risk Factors:                          │
           │ 1. Compliance overdue: 34 tasks (↑ 12%)    │
           │ 2. Critical observations: 8 in last 30 days│
           │ 3. Corrective action closure: 67% (↓ 15%)  │
           │ 4. Methane exceedances: 3 in last week     │
           │ 5. Contractor turnover: 23% (high)         │
           └────────────────────────────────────────────┘
         ↓
Step 4: Risk Dashboard Update (Real-Time):
         → Corporate Dashboard:
           - GIS Map: Mine pins coloured by risk category
           - Click Pin → See detailed risk factors
         → Subsidiary Dashboard:
           - Table: All mines sorted by risk score (descending)
           - Trend Arrow: ↑ Risk increasing, ↓ Risk decreasing (vs last month)
         → Mine Manager Dashboard:
           - Personalized Risk Score with breakdown
           - Recommended Actions (AI-generated)
         ↓
Step 5: AI-Generated Recommendations:
         → Model Outputs Actionable Insights:
           ┌────────────────────────────────────────────┐
           │ RECOMMENDED ACTIONS (Priority Order)       │
           ├────────────────────────────────────────────┤
           │ 1. [CRITICAL] Clear 34 overdue compliance  │
           │    tasks within 7 days. Focus on:          │
           │    - Ventilation inspections (12 overdue)  │
           │    - Roof support audits (8 overdue)       │
           │                                            │
           │ 2. [HIGH] Investigate 8 critical           │
           │    observations from last 30 days.         │
           │    Pattern: 5 related to roof bolting.     │
           │    Suggest: Refresher training for roof    │
           │    bolting team.                           │
           │                                            │
           │ 3. [MEDIUM] Improve corrective action      │
           │    closure rate from 67% to 85%.           │
           │    Assign dedicated follow-up officer.     │
           │                                            │
           │ 4. [MEDIUM] Address methane exceedances.   │
           │    Install additional sensors at Panel A-12│
           │    and B-07.                               │
           │                                            │
           │ 5. [LOW] Reduce contractor turnover.       │
           │    Conduct worker satisfaction survey.     │
           └────────────────────────────────────────────┘
         → Recommendations Sent to Mine Manager via Email & In-App
         ↓
Step 6: Predictive Alert Generation (Proactive Warnings):
         → AI Model Predicts Future Risks (Next 30 Days):
           • "Gevra Mine: 78% probability of roof fall incident in Panel A-12 
              within 30 days based on:
              - 5 critical roof observations in last 2 weeks
              - Compliance overdue: Roof support audits (8 tasks)
              - Historical pattern: 3 roof falls in monsoon season"
           • "Methane accumulation risk HIGH at Panel B-07:
              - Ventilation compliance overdue (12 days)
              - 2 methane exceedances in last week
              - Weather forecast: Low pressure, high humidity"
         → System Generates Predictive Alerts:
           ┌────────────────────────────────────────────┐
           │ ⚠️ PREDICTIVE ALERT                        │
           ├────────────────────────────────────────────┤
           │ Risk: Roof Fall at Panel A-12              │
           │ Probability: 78% (High)                    │
           │ Timeframe: Next 30 days                    │
           │ Confidence: 85% (based on 5 similar        │
           │          historical patterns)              │
           │                                            │
           │ Recommended Actions:                        │
           │ • Conduct emergency roof inspection        │
           │   within 24 hours                          │
           │ • Clear 8 overdue roof support audits      │
           │ • Install additional roof bolts as         │
           │   preventive measure                       │
           │ • Suspend work until inspection complete   │
           │                                            │
           │ [Acknowledge Alert] [Assign Action]        │
           └────────────────────────────────────────────┘
         → Alerts Sent to:
           - Mine Manager (SMS + Email + In-App)
           - Safety Head (Email + In-App)
           - Subsidiary Head (Email, if risk score >80)
         ↓
Step 7: Manager Acknowledges Alert → Assigns Actions:
         → Mine Manager Opens Alert → Clicks "Assign Action"
         → Creates Tasks:
           - Task 1: "Emergency roof inspection at Panel A-12"
             Assigned to: Safety Officer
             Due: Tomorrow 10:00 AM
           - Task 2: "Clear 8 overdue roof support audits"
             Assigned to: Inspection Team
             Due: Within 3 days
         → System Tracks Task Completion
         ↓
Step 8: AI Monitors Risk Mitigation Progress:
         → Daily Re-Scoring:
           - Day 1: Risk Score 72 (no action taken yet)
           - Day 2: Risk Score 68 (inspection completed, 3 audits cleared)
           - Day 5: Risk Score 54 (all audits cleared, corrective actions 80% closed)
           - Day 10: Risk Score 42 (all tasks completed, risk mitigated)
         → Dashboard Updates:
           - Risk Category: High → Medium
           - Mine Pin on Map: Orange → Yellow
         → AI Sends Follow-Up:
           "Risk score reduced from 72 to 42. Excellent progress. 
            Continue monitoring Panel A-12 for 2 more weeks."
         ↓
Step 9: Model Retraining (Monthly):
         → At Month End:
           - Collect New Data: All incidents, compliance, inspections from past month
           - Add to Training Dataset
           - Retrain Model (overnight batch job)
           - Validate Accuracy: Compare predicted risks vs actual incidents
           - Deploy Updated Model (if accuracy improved)
         → Model Performance Metrics:
           - Precision: 87% (of predicted high-risk mines, 87% had incidents)
           - Recall: 92% (of actual incidents, 92% were predicted as high-risk)
           - False Positive Rate: 13% (acceptable for safety-critical system)
```

**Description:**
This AI/ML flow transforms reactive compliance monitoring into proactive risk prediction, enabling mines to prevent incidents before they occur. The model leverages historical data patterns across all CIL mines to identify risk factors unique to each site, generating personalized recommendations. Predictive alerts with probability scores help managers prioritize interventions based on data-driven insights rather than intuition.[^2_3][^2_9][^2_1][^2_2]

**Model Architecture:**

- **Algorithm:** XGBoost (gradient boosting) for tabular data, LSTM for time-series patterns
- **Features:** 50+ engineered features from compliance, inspections, incidents, sensors, HR data
- **Training Data:** 3 years historical data from 400+ CIL mines (anonymized)
- **Inference Frequency:** Real-time scoring every 6 hours, full retraining monthly
- **Accuracy:** 87% precision, 92% recall (validated on test dataset)

______________________________________________________________________

## 7. Reporting \& Export Flows

### 7.1 Statutory Report Generation Flow (DGMS Compliance)

```
┌─────────────────────────────────────────────────────────────────┐
│          STATUTORY REPORT GENERATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: System Auto-Schedules Report Generation:
         → Based on DGMS Regulatory Calendar: [^2_18][^2_23]
           • Daily: Ventilation measurement report (Regulation 119)
           • Weekly: Fire detection system test report
           • Monthly: Form I (incident summary), Form II (accident details), 
                      Production report, Environmental monitoring report
           • Quarterly: Safety audit summary, Emergency drill report
           • Annually: DGMS annual return, Environmental clearance renewal
         → Report Generation Job Triggers at Scheduled Time (e.g., 1st of month, 9:00 AM)
         ↓
Step 2: System Aggregates Data for Report Period:
         → Query Database:
           • All incidents in period (from Incident Module)
           • All inspections completed (from Inspection Module)
           • All compliance tasks completed (from Compliance Module)
           • Production data (from ERP integration)
           • Environmental sensor readings (from IoT integration)
           • Worker attendance & contractor data (from HR Module)
         → Data Validated:
           - Completeness: All mandatory fields present
           - Consistency: No contradictory data (e.g., incident without location)
           - Accuracy: Outliers flagged for manual review
         ↓
Step 3: System Populates DGMS-Prescribed Template:
         → Load Template (PDF/Excel format as per DGMS specification) [^2_18][^2_30]
         → Auto-Fill Fields:
           ┌────────────────────────────────────────────────────┐
           │ DGMS FORM II (Monthly Accident Return)             │
           ├────────────────────────────────────────────────────┤
           │ Mine Name: Gevra Mine                              │
           │ Subsidiary: SECL                                   │
           │ Month: August 2026                                 │
           │                                                    │
           │ Part A: Fatal Accidents                            │
           │ Total: 0                                           │
           │                                                    │
           │ Part B: Serious Bodily Injuries                    │
           │ Total: 2                                           │
           │ ┌──────────────────────────────────────────────┐   │
           │ │ Incident ID | Date      | Nature of Injury   │   │
           │ │ ──────────────────────────────────────────── │   │
           │ │ INC-SECL-012| 15-Aug-26 | Fracture (Leg)     │   │
           │ │ INC-SECL-019| 23-Aug-26 | Burn (2nd degree)  │   │
           │ └──────────────────────────────────────────────┘   │
           │                                                    │
           │ Part C: Dangerous Occurrences                      │
           │ Total: 5                                           │
           │ • Roof fall (no injury): 2                         │
           │ • Fire outbreak (extinguished): 1                  │
           │ • Gas exceedance: 2                                │
           │                                                    │
           │ Part D: Analysis                                   │
           │ Total Man-Days Worked: 45,678                      │
           │ Injury Rate (per 1000 man-days): 0.044             │
           │ Comparison vs Last Month: ▼ 12% (improvement)      │
           │                                                    │
           │ Part E: Corrective Actions Taken                   │
           │ [Auto-generated from investigation reports]        │
           │                                                    │
           │ Certified By:                                      │
           │ Mine Manager: [Digital Signature]                  │
           │ Safety Head: [Digital Signature]                   │
           │ Date: 01-Sep-2026                                  │
           └────────────────────────────────────────────────────┘
         ↓
Step 4: System Adds Digital Signatures:
         → Retrieve Digital Signature Certificates (DSC) from:
           - Mine Manager (Class 3 DSC, DGMS-registered)
           - Safety Head (Class 2 DSC)
         → Apply Signatures to PDF:
           - Signature Field: "Certified By" section
           - Timestamp: Current date/time from NTP server
           - Certificate Details: Embedded in PDF metadata
         → Validate Signatures:
           - Certificate Validity: Not expired
           - Certificate Chain: Trusted by DGMS CA
         ↓
Step 5: System Generates QR Code for Tamper-Evident Logs (pg_audit) Verification:
         → Create Hash of Final PDF: SHA-256(PDF Content)
         → Store Hash on Permissioned Tamper-Evident Logs (pg_audit):
           - Transaction ID: 0x7f8a9b3c4d5e6f...
           - Block Number: 1,234,567
           - Timestamp: 01-Sep-2026 09:15:32 IST
         → Generate QR Code:
           - Encodes: Tamper-Evident Logs (pg_audit) Transaction ID + Report ID
           - Embedded in PDF Footer
         → DGMS Auditor Can:
           - Scan QR Code → Retrieve Hash from Tamper-Evident Logs (pg_audit)
           - Compare with Local PDF Hash → Verify Integrity
         ↓
Step 6: Report Review & Approval Workflow:
         → System Sends Draft Report to Safety Head:
           "Monthly Form II report for August 2026 ready for review. 
            Login to approve and submit to DGMS."
         → Safety Head Logs In → Opens Report → Reviews:
           - Data accuracy (spot-check incidents)
           - Completeness (all sections filled)
           - Signatures applied correctly
         → [If Approved] → Clicks "Approve & Submit to DGMS"
         → [If Changes Needed] → Clicks "Request Revision" → Adds Comments:
           "Incident INC-SECL-019 injury type incorrect. Should be 'Burn' not 'Fracture'. 
            Please correct and regenerate."
         → System Regenerates Report with Corrections → Return to Step 3
         ↓
Step 7: System Submits Report to DGMS Portal:
         → API Integration with DGMS e-Submission Portal [^2_18][^2_23]
         → Upload PDF with Metadata:
           - Mine Code: SECL-GEV
           - Report Type: Form II
           - Period: August 2026
           - Submission Date: 01-Sep-2026 (within regulatory deadline)
         → DGMS Portal Returns:
           - Acknowledgment Number: DGMS-ACK-2026-08-SECL-047
           - Submission Timestamp: 01-Sep-2026 09:32:15 IST
         → System Saves Acknowledgment in Database
         → Log Event: "Form II submitted to DGMS. ACK: DGMS-ACK-2026-08-SECL-047"
         ↓
Step 8: System Distributes Report to Stakeholders:
         → Email to:
           - Mine Manager: "Form II submitted to DGMS. ACK: [Number]"
           - Subsidiary Head: "Monthly compliance report submitted for Gevra Mine"
           - Corporate Compliance Head: Attached PDF for records
           - DGMS Regional Office: Automated email with PDF attachment
         → Upload to Document Repository:
           - Folder: /Gevra Mine/Statutory Reports/2026/August/
           - Filename: "Form-II_Aug2026_Gevra_DGMS-ACK-047.pdf"
         → Update Dashboard:
           - Compliance Module: "Form II - Submitted ✓"
           - Green Checkmark for August 2026
         ↓
Step 9: System Tracks DGMS Acknowledgment & Feedback:
         → Monitors DGMS Portal for:
           - Report Acceptance Status
           - Queries/Clarifications Raised by DGMS
         → [If DGMS Raises Query] → Send Alert:
           "DGMS query on Form II (August 2026): 'Clarify incident INC-SECL-019 
            root cause. Was equipment failure involved?' Respond within 7 days."
         → Safety Head Responds via DGMS Portal → System Logs Response
         → [If DGMS Accepts] → Update Status: "Accepted by DGMS"
         ↓
Step 10: Report Analytics & Historical Archive:
          → System Adds Report to Historical Database:
            - Searchable by: Mine, Report Type, Period, DGMS ACK Number
            - Full-Text Search: Query any incident/observation mentioned in reports
          → Generates Trend Analysis:
            ┌────────────────────────────────────────────┐
            │ INCIDENT TREND: GEVRA MINE (Last 12 Months)│
            ├────────────────────────────────────────────┤
            │ Month       | Fatal | Serious | Minor      │
            │ ────────────────────────────────────────── │
            │ Sep-2025    | 0     | 3       | 12         │
            │ Oct-2025    | 0     | 2       | 9          │
            │ ...         | ...   | ...     | ...        │
            │ Aug-2026    | 0     | 2       | 7          │
            │                                            │
            │ Trend: Serious injuries ↓ 33% YoY          │
            │ Minor injuries ↓ 42% YoY                   │
            └────────────────────────────────────────────┘
          → Data Feeds AI/ML Model for Risk Prediction (Flow 6.1)
```

**Description:**
This flow automates generation and submission of DGMS-mandated statutory reports, eliminating manual compilation errors and ensuring timely submissions. Digital signatures and tamper-evident logs verification provide legal validity and tamper evidence, meeting IT Act 2000 compliance. Integration with DGMS e-submission portal enables seamless regulatory reporting without manual uploads.[^2_7][^2_11][^2_8][^2_4][^2_5]

**Report Types Supported:**

- **Form I:** Individual incident report (within 24 hours)
- **Form II:** Monthly accident summary (by 1st of next month)
- **Form III:** Annual return (by 15th January)
- **Ventilation Reports:** Daily/weekly measurements (Regulation 119)
- **Environmental Reports:** Monthly dust, noise, water quality monitoring
- **Production Reports:** Monthly coal production, OMS (Output per Man Shift)

______________________________________________________________________

## 8. Administrator \& Configuration Flows

### 8.1 Workflow Configuration Flow (No-Code Designer)

```
┌─────────────────────────────────────────────────────────────────┐
│          WORKFLOW CONFIGURATION FLOW (NO-CODE)                   │
└─────────────────────────────────────────────────────────────────┘

Step 1: Admin Navigates to: Settings → Workflow Designer
         ↓
Step 2: Admin Selects Workflow Type to Configure:
         • Compliance Escalation Workflow
         • Incident Investigation Workflow
         • Grievance Redressal Workflow
         • Corrective Action Approval Workflow
         • Contractor Onboarding Workflow
         ↓
Step 3: Admin Opens Visual Workflow Designer:
         ┌────────────────────────────────────────────────────┐
         │ WORKFLOW DESIGNER: Compliance Escalation           │
         ├────────────────────────────────────────────────────┤
         │ [Start: Compliance Task Created]                   │
         │           ↓                                        │
         │ [Reminder: 7 Days Before Due] → Email to Assignee  │
         │           ↓                                        │
         │ [Reminder: 3 Days Before Due] → SMS + Email        │
         │           ↓                                        │
         │ [Reminder: 1 Day Before Due] → SMS + Email + Push  │
         │           ↓                                        │
         │ [Decision: Task Completed?]                        │
         │      ├─ Yes → [End: Task Closed]                  │
         │      └─ No → Continue                              │
         │           ↓                                        │
         │ [On Due Date] → Escalate to Reporting Manager      │
         │           ↓                                        │
         │ [Decision: Completed in 2 Days?]                   │
         │      ├─ Yes → [End: Task Closed with Delay]       │
         │      └─ No → Continue                              │
         │           ↓                                        │
         │ [3 Days Overdue] → Escalate to Mine Manager        │
         │           ↓                                        │
         │ [Decision: Completed in 3 Days?]                   │
         │      ├─ Yes → [End: Task Closed with Delay]       │
         │      └─ No → Continue                              │
         │           ↓                                        │
         │ [7 Days Overdue] → Escalate to Subsidiary Head     │
         │           ↓                                        │
         │ [End: Task Closed with Critical Delay]             │
         │                                                    │
         │ [+ Add Step]  [Delete Step]  [Save Workflow]       │
         └────────────────────────────────────────────────────┘
         ↓
Step 4: Admin Configures Each Step (Click to Edit):
         
         Example: Edit "Escalate to Reporting Manager" Step
         ┌────────────────────────────────────────────────────┐
         │ STEP CONFIGURATION                                 │
         ├────────────────────────────────────────────────────┤
         │ Step Type: Escalation                              │
         │                                                    │
         │ Trigger: On Due Date (if task not completed)       │
         │                                                    │
         │ Action:                                            │
         │ • Change Task Status: "Overdue - Escalated"        │
         │ • Reassign To: Reporting Manager (from user profile│
         │              hierarchy)                            │
         │ • Send Notification:                               │
         │   - SMS: "Compliance task [Title] overdue.         │
         │           Assigned to you for action."             │
         │   - Email: Detailed task info with link            │
         │   - In-App: High-priority alert                    │
         │ • Log Event: "Escalated to [ManagerName] at [Time]"│
         │                                                    │
         │ SLA: Manager must act within 48 hours              │
         │                                                    │
         │ [Save Step]  [Cancel]                              │
         └────────────────────────────────────────────────────┘
         ↓
Step 5: Admin Configures Notification Templates:
         → Clicks "Notification Templates" Tab
         → Selects Template: "Compliance Overdue Escalation"
         → Edits Template:
           ┌────────────────────────────────────────────────────┐
           │ SMS Template:                                      │
           │ "CM-GIP: Compliance task '{task_title}' is overdue │
           │  by {days_overdue} days. Assigned to you for       │
           │  immediate action. Mine: {mine_name}.              │
           │  Login: app.cm-gip.gov.in"                         │
           │                                                    │
           │ Email Template:                                    │
           │ Subject: "URGENT: Compliance Task Overdue -        │
           │         {task_title}"                              │
           │ Body:                                              │
           │ "Dear {manager_name},                              │
           │                                                  │
           │ A compliance task has been escalated to you:       │
           │                                                  │
           │ Task: {task_title}                                 │
           │ Mine: {mine_name}                                  │
           │ Original Assignee: {assignee_name}                 │
           │ Overdue By: {days_overdue} days                    │
           │ Due Date: {original_due_date}                      │
           │                                                  │
           │ Please take immediate action to complete this      │
           │ task or reassign to appropriate personnel.         │
           │                                                  │
           │ [View Task] [Reassign]                             │
           │                                                  │
           │ Regards,                                           │
           │ CM-GIP System"                                     │
           └────────────────────────────────────────────────────┘
         → Saves Template (supports variables in {curly_braces})
         ↓
Step 6: Admin Tests Workflow (Simulation Mode):
         → Clicks "Test Workflow" Button
         → System Opens Simulation:
           - Creates Test Compliance Task
           - Simulates Time Progression (fast-forward 10 days)
           - Shows Each Step Execution:
             ┌────────────────────────────────────────────┐
             │ WORKFLOW SIMULATION RESULTS                │
             ├────────────────────────────────────────────┤
             │ Day 0: Task Created → Assigned to Inspector│
             │ Day 3: Reminder Sent (Email)               │
             │ Day 6: Reminder Sent (SMS + Email)         │
             │ Day 9: Reminder Sent (SMS + Email + Push)  │
             │ Day 10: Task NOT Completed                 │
             │ Day 10: Escalated to Reporting Manager     │
             │ Day 12: Manager Still Not Acted            │
             │ Day 13: Escalated to Mine Manager          │
             │ ...                                        │
             │                                            │
             │ ✓ Workflow Executed Successfully           │
             │ Total Steps: 8                             │
             │ Notifications Sent: 12                     │
             └────────────────────────────────────────────┘
         → Admin Reviews Simulation → Confirms Workflow Logic
         ↓
Step 7: Admin Saves & Publishes Workflow:
         → Clicks "Save Workflow"
         → System Validates:
           - No circular loops (A → B → A)
           - All decision branches have endpoints
           - All notifications have valid templates
         → [If Validation Passes] → Publish Workflow
         → System:
           - Saves Workflow Definition (JSON format)
           - Deploys to Workflow Engine (Camunda/Activiti)
           - Activates for All New Compliance Tasks
         → Log Event: "Workflow 'Compliance Escalation v2.0' published by [AdminID]"
         ↓
Step 8: Workflow Executes for Live Tasks:
         → New Compliance Task Created
         → Workflow Engine Picks Up Task
         → Executes Steps Automatically:
           - Sends reminders at configured intervals
           - Escalates on due date if not completed
           - Reassigns tasks based on hierarchy
           - Logs all actions for audit
         → Admin Monitors Workflow Performance:
           - Average time to completion
           - Escalation frequency
           - Bottleneck identification (which step causes most delays)
```

**Description:**
This no-code workflow designer empowers administrators to configure complex escalation and approval workflows without programming. Visual drag-and-drop interface with simulation testing ensures workflows behave as intended before going live. Customizable notification templates with variables enable personalized, context-rich communications.[^2_1][^2_2][^2_3][^2_4]

**Workflow Engine Features:**

- **Parallel Branches:** Support for concurrent actions (e.g., notify multiple stakeholders simultaneously)
- **Conditional Logic:** Decision diamonds for if-then-else branching based on data values
- **Timers:** Time-based triggers for reminders and escalations
- **Sub-Workflows:** Reusable workflow components (e.g., "Standard Escalation" used in multiple workflows)
- **Version Control:** Workflow versions tracked; can rollback to previous version if needed

______________________________________________________________________

This comprehensive documentation covers all major end-user flows and application workflows for the CM-GIP platform, providing implementers with clear, step-by-step guidance for each user interaction and system process.[^2_2][^2_3][^2_1]

<div align="center">⁂</div>

[^2_1]: https://zaidsayyed.in/tools/sih-problem-statements/sih26024

[^2_2]: https://sih2026.vuce.in/ps/SIH26024

[^2_3]: https://coal.nic.in/sites/default/files/2026-02/chap14AnnualReport2026en.pdf

[^2_4]: https://www.ijraset.com/research-paper/deepshift-ai-powered-shift-management-and-safety-analytics

[^2_5]: https://www.dgms.gov.in/UserView/index?mid=1648

[^2_6]: https://www.coal.gov.in/major-statistics/safety-coal-mines

[^2_7]: https://www.dgms.net/Coal Mines Regulation 2017.pdf

[^2_8]: https://coal.gov.in/sites/default/files/2025-08/Pib180825.pdf

[^2_9]: https://indianmasterminds.com/news/coal-india-isro-nrsc-ai-satellite-dashboard-smart-mine-monitoring-216077/

[^2_10]: https://www.coalindia.in/

[^2_11]: https://www.arihantcapital.com/company-information/directors-report/12019

