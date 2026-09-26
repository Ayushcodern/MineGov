# CM-GIP Mobile App: Reverse Engineering & Architecture Document

This document provides a comprehensive reverse-engineered architectural overview of the **CM-GIP (CoalMine Governance Intelligence Platform) Mobile Application**. It details the structural design, navigation hierarchies, styling methodologies, component interactions, database mappings, role governance, and compliance engines developed in this React Native (Expo) system.

---

## 1. Tech Stack & Fundamentals
- **Framework:** React Native 0.86.3 (managed by Expo SDK 57).
- **Language:** TypeScript with strict typing.
- **Routing & Navigation:** React Navigation v7 (`@react-navigation/stack`, `@react-navigation/bottom-tabs`).
- **Icons:** `@expo/vector-icons` (`Ionicons`).
- **Styling:** Native `StyleSheet` paired with a central `ThemeContext.tsx` design token system.
- **Backend & DB:** Supabase (`@supabase/supabase-js` 2.115) with PostgreSQL + PostGIS geofencing.
- **Offline Storage & Network:** `@react-native-async-storage/async-storage` 2.2.0 + `@react-native-community/netinfo`.
- **AI Engine:** `@google/generative-ai` (Gemini 1.5 Flash Vision & Text).
- **Crypto & Integrity:** `expo-crypto` (SHA-256 deterministic hashes for approvals, video, and photos).
- **Data Visualization:** `victory-native` 36.6.1 (Mine Risk Heat Grid & Compliance Trends).
- **Logistics & Hardware:** `react-native-qrcode-svg` (QR generator) + `expo-camera` / `expo-image-picker` (QR reader, photo geotagging, 30s video recording).
- **Localization:** `i18next` + `react-i18next` (English & Hindi localization).
- **Reporting & Sharing:** `expo-file-system` + `expo-sharing`.

---

## 2. Directory Structure

```text
cm-gip-mobile/
├── App.tsx                        # Root Application Entry & Context Providers
├── package.json                   # Dependencies and Scripts
├── tsconfig.json                  # Strict TypeScript Config
└── src/
    ├── config/
    │   ├── i18n.ts                # Hindi / English Translation Dictionaries
    │   └── supabaseClient.ts      # Supabase Client & Local Session Storage
    ├── context/
    │   └── ThemeContext.tsx       # Dark/Light Theme Provider
    ├── navigation/
    │   └── AppNavigator.tsx       # Dynamic Role-Based Routing & Flow Guards
    ├── services/
    │   ├── aiService.ts           # Gemini 1.5 Vision OCR & Severity Classification
    │   ├── alertService.ts        # Notifications & Escalation Management
    │   ├── attendanceService.ts   # Labour QR Attendance & 8h Shift Rule Hooks
    │   ├── auditService.ts        # Centralized Immutable Audit Logging
    │   ├── authService.ts         # 6 Stakeholder DEMO Logins & Officer Session State
    │   ├── complianceService.ts   # 5 Canonical PPT Rules, SHA-256 Hashes, Sustainability Score & Anomaly Detection
    │   ├── escalationService.ts   # Daily Overdue Escalation Engine & 30/14/7 Contract Expiry
    │   ├── inspectionService.ts   # Inspection Engine, Rule Auto-Matching & Video SHA-256
    │   ├── syncService.ts         # Offline Queue Processor & Auto-Sync
    │   └── taskService.ts         # Corrective Action Tasks
    ├── screens/
    │   ├── AccessDeniedScreen.tsx # Role-Based Authorization Guard Screen
    │   ├── AlertsScreen.tsx       # Notifications, Escalations & Contract Expiries
    │   ├── AttendanceScreen.tsx   # Worker QR Check-In/Out & Shift Monitoring
    │   ├── CheckpointScanScreen.tsx # Coal Transport QR Scanner, Weighbridge Verification & Timeline
    │   ├── ComplianceReviewScreen.tsx # Managerial Review with PPT Rule Badges & SHA-256 Seal
    │   ├── ConsignmentRegistrationScreen.tsx # Source Coal Dispatch & QR Pass Generator
    │   ├── DashboardScreen.tsx    # Governance KPIs, Heat Grid, Sustainability Score, AI Risk & Report Sharing
    │   ├── InspectionScreen.tsx   # 5-Step Reporting Wizard (GPS, Checklist, AI, Video, OCR, Hindi/Eng)
    │   ├── LoginScreen.tsx        # Entry Portal with 6 One-Tap Stakeholder DEMO Logins
    │   ├── PasswordChangeScreen.tsx # Mandatory First-Time Password Reset
    │   ├── ProfileScreen.tsx      # User Profile, Offline Queue Status & Theme Toggle
    │   └── TasksScreen.tsx        # Corrective Action Task Queue with Contractor Resolution
    └── styles/
        └── theme.js               # Centralized Design Tokens
```

---

## 3. Database Schema & Supabase Data Model

Defined in [supabase_schema.sql](file:///d:/sihminegov/minegov/MineGOV/supabase_schema.sql):

1. **`mines`**: Geo-coordinates (`latitude`, `longitude`), active/inactive state.
2. **`officers`**: 6 canonical roles constrained by `CHECK (role IN ('field_inspector','mining_official','contractor','compliance_officer','corporate','regulator'))`.
3. **`inspections`**: GPS coords, risk score (0–100), `file_type` ('IMAGE' | 'VIDEO'), `videoHash`, `status` ('draft','submitted','reviewed').
4. **`inspection_checklist_items`**: Pass/fail/na checks.
5. **`observations`**: `text`, `severity`, `rule_id` (matched to PPT rules), `ocr_text`, `photo_url`.
6. **`corrective_actions`**: Overdue action tracking, priority, due date.
7. **`alerts`**: Multi-severity alerts (`escalation`, `contract_expiry`, `gas_leak`, `short_shift_violation`).
8. **`audit_log`**: Immutable audit trails (`actor`, `action`, `entity_type`, `entity_id`, `timestamp`).
9. **`sync_queue`**: Shadow table for offline queued actions.
10. **`contractor_contracts`**: Expiry tracking (`contract_end_date`, `mine_id`).
11. **`consignments`**: Coal dispatch passes (`vehicle_no`, `coal_type`, `quality_grade`, `quantity_tonnes`, `status`).
12. **`checkpoints`**: Waypoint weighbridge scans (`quantity_verified`, `vehicle_status`, `mismatch_detected`).
13. **`attendance`**: Labour shifts (`worker_id`, `check_in_at`, `check_out_at`, `shift_hours`, `method`).

---

## 4. Phase-by-Phase Engine Breakdown

### Phase 1: Canonical PPT Compliance Rules
The compliance engine in [complianceService.ts](file:///d:/sihminegov/minegov/MineGOV/cm-gip-mobile/src/services/complianceService.ts) enforces 5 canonical PPT rules:
- `SAF-001`: Personal Protective Equipment (PPE & Safety Gear)
- `GAS-001`: Gas & Ventilation Monitoring (Methane CH4, CO, Airflow)
- `GEO-001`: Slopes & Strata / Roof Control (Bench stability, roof bolting)
- `EQP-001`: Equipment & Machinery Safety (Dumpers, conveyors, brakes)
- `TRN-001`: Worker Training & Certifications (Vocational training, competency)
Observations are automatically matched using semantic category keywords during inspection creation.

### Phase 2: 6 Stakeholder Governance Roles
Managed in [authService.ts](file:///d:/sihminegov/minegov/MineGOV/cm-gip-mobile/src/services/authService.ts) and guarded in [AppNavigator.tsx](file:///d:/sihminegov/minegov/MineGOV/cm-gip-mobile/src/navigation/AppNavigator.tsx):
- `field_inspector`: Full access (Dashboard, InspectionFlow, Tasks, Alerts, Profile)
- `mining_official`: Read-only InspectionFlow, Dispatch QR Registration, Tasks, Alerts
- `contractor`: Task resolution, Alerts, Profile (InspectionFlow blocked via `AccessDeniedScreen`)
- `compliance_officer`: Managerial ReviewFlow, Alerts, Profile
- `corporate`: Executive read-only Dashboard (Heat grid, Sustainability score), Alerts, Profile
- `regulator`: Regulatory oversight read-only Dashboard, Alerts, Profile

### Phase 3: Daily Escalation & Contract Expiry Engine
- Triggered on app foreground (`AppState`) and on background sync (`syncService.ts`).
- Overdue corrective actions produce exactly one escalation alert per day.
- Contractor contracts produce expiry warnings at 30, 14, and 7 days before deadline.

### Phase 4: Coal Transport QR Logistics
- Source Registration generates secure QR pass encoding consignment details.
- Checkpoint scanner records intermediate weighbridge checks and verifies seal status.
- Final destination scan updates status to `delivered` and automatically flags deviations exceeding 0.5 tonnes.

### Phase 5: Labour Attendance & 8h Shift Rule Hooks
- Miner badge QR scanning logs check-in and check-out timestamps.
- Rule hook automatically triggers a safety alert if shift duration is under 8.0 hours (Mines Act 1952).

### Phase 6: Video Evidence & Document OCR
- Supports 30s video capture with SHA-256 hash generation for tamper-evident validation.
- Gemini Vision OCR extracts handwritten text from shift log photos, labeled: `"AI-extracted, requires human review"`.

### Phase 7: Analytics, Polish & Multilingual Support
- **Mine Risk Heat Grid:** Visualized using `victory-native` across active mines.
- **Mine Sustainability Score (0–100):**
  $$\text{Score} = (\text{Safety} \times 0.35) + (\text{Compliance} \times 0.30) + (\text{Environmental} \times 0.20) + (\text{Welfare} \times 0.15)$$
- **Regulatory Report Export:** Generates structured audit JSON/text and shares via `expo-sharing`.
- **Statistical Anomaly Detection:** Rule-based detection flagging weekly violations $> 2\times$ the 4-week average (clearly labeled *Rule-Based, Not ML*).
- **Multilingual Support:** English and Hindi toggle via `react-i18next`.
