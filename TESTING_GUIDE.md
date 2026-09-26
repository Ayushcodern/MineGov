# 🇮🇳 MineGOV — Official Testing & Demonstration Guide

**Project Path:** `d:\sihminegov\minegov\MineGOV\cm-gip-mobile`  
**Universal Password for All Officers:** `Demo@1234`  
**Live Supabase Backend:** `https://nvxxukxiqlvujuticiqd.supabase.co`  
**Google AI Engine:** `gemini-3.5-flash-lite`

---

## 1. Quick Launch Instructions

### A. Run on Physical Device via Expo Go (Android & iOS)
1. Open PowerShell / Command Prompt:
   ```bash
   cd d:\sihminegov\minegov\MineGOV\cm-gip-mobile
   npx expo start -c
   ```
2. Scan the generated QR code using the **Expo Go** app on your phone.
3. If your phone and PC are on separate networks / mobile hotspot:
   ```bash
   npx expo start -c --tunnel
   ```

### B. Run Web Browser Interface
```bash
npm run web
```
*(Runs at `http://localhost:8081`)*

### C. Verify TypeScript Compile Check
```bash
npm run typecheck
```

---

## 2. Indian Officer Login Accounts & Role Portals

| Officer Name | Role / Designation | Username / Badge ID | Official Email | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Rajesh Sharma** | Mining Inspector | `RAJESH_INSPECTOR` (or `OFF-001`) | `rajesh.sharma@minegov.in` | GPS-geofenced inspections, Gemini OCR, SHA-256 video evidence |
| **Priya Nair** | Mining Official / Operations Mgr | `PRIYA_OFFICIAL` (or `OFF-002`) | `priya.nair@minegov.in` | Weighbridge QR check, labour shift attendance, dispatch |
| **Amit Verma** | Compliance & Audit Officer | `AMIT_COMPLIANCE` (or `OFF-004`) | `amit.verma@minegov.in` | Inspection report reviews, PPT rule validation, escalation tracking |
| **Vikram Malhotra** | Mining Contractor Lead | `VIKRAM_CONTRACTOR` (or `OFF-003`) | `vikram.malhotra@minegov.in` | Corrective tasks execution (Inspection flow restricted) |
| **Sunita Deshmukh** | Corporate Governance Director | `SUNITA_CORP` (or `OFF-005`) | `sunita.deshmukh@minegov.in` | Multi-mine ESG sustainability scorecard & risk heat grid |
| **Dr. Alok Kumar** | DGMS Regulatory Commissioner | `ALOK_REGULATOR` (or `OFF-006`) | `alok.kumar@minegov.in` | Statutory CMR violation audits, regulatory export sharing |

---

## 3. Step-by-Step Feature Test Matrix

### Test 1: Real-Time Hindi & English Multilingual Switching
- **Action:** Tap the `EN / हिन्दी` toggle badge in the header or in the **Profile** tab.
- **Expected Result:** The entire app instantly switches between English and Hindi, including bottom navigation tab labels (`डैशबोर्ड`, `निरीक्षण`, `कार्य सूची`, `अनुपालन समीक्षा`, `अलर्ट`, `प्रोफ़ाइल`), forms, cards, and alerts.

### Test 2: Document / Logbook Text Extraction (OCR)
- **Action:**
  1. Log in as `RAJESH_INSPECTOR` (`Demo@1234`).
  2. Navigate to the **Inspection** tab and proceed to Step 3 (Observations) or Step 4 (Evidence).
  3. Tap **`📄 Extract Document / Logbook Text`**.
  4. Select or capture an image of any written notice, logbook entry, or document (in English or Hindi).
- **Expected Result:** Gemini AI extracts the text cleanly and appends it directly to your inspection observation notes with the tag `[AI-extracted, requires human review]`.

### Test 3: Dedicated Role-Specific Workspace Screens
- **Action:** Log in as different officers and observe the tailored home dashboard:
  - **Rajesh Sharma (Inspector):** Immediate CTA for **Start Field Inspection**, GPS Geofence status, and AI Risk Predictions.
  - **Priya Nair (Mining Official):** Fast-action buttons for **Weighbridge QR Scanner** and **Labour Shift Attendance**.
  - **Amit Verma (Compliance Officer):** **Review & Endorse Reports** desk and PPT Rule Catalog matching.
  - **Sunita Deshmukh (Corporate):** Enterprise ESG Sustainability matrix and Multi-Mine Risk Heat Grid.
  - **Dr. Alok Kumar (Regulator):** Statutory CMR 2017 Violation alerts and official audit export.

### Test 4: Simplified Mine Sustainability Score (No Formula)
- **Action:** Open Dashboard and view the **Mine Sustainability Score** card.
- **Expected Result:** Shows a clean score `92 / 100`, status badge `Grade A - High Sustainability` (or `ग्रेड ए - उत्कृष्ट स्थिरता`), and component pills (Safety: 92%, Compliance: 88%, Env: 81%, Welfare: 85%) without mathematical multiplication formulas.

### Test 5: Plain-Language Safety Rule Deviations & Violations
- **Action:** View the violation section on the Dashboard.
- **Expected Result:** Clean title `⚠️ Safety Rule Deviations & Violation Alerts` (Hindi: `⚠️ सुरक्षा नियम विचलन एवं उल्लंघन चेतावनियां`) and description `Non-compliance incidents flagged under Coal Mines Regulations (CMR) 2017.`

### Test 6: Zero-Error Offline Synchronization
- **Action:**
  1. Turn ON Airplane Mode on your device.
  2. Complete and submit an inspection or consignment QR code.
  3. Notice it saves smoothly to local storage (`Offline Queue: 1 Item`).
  4. Turn Airplane Mode OFF and tap **Sync Offline Queue** in the Profile tab.
- **Expected Result:** Queue processes cleanly with 0 in-app errors and synchronizes to Supabase.

### Test 7: Dark Mode & Light Mode Theme Support
- **Action:** Open **Profile** -> toggle **Dark Mode**.
- **Expected Result:** Seamlessly adapts background, cards, text, borders, and charts across all tabs.

---

## 4. System Architectural Integrity
- **Database:** Supabase Cloud PostgreSQL
- **AI Processing:** Gemini 3.5 Flash-Lite Vision + Text
- **Security:** SHA-256 Hashes for Multimedia Evidence Integrity
- **Visualization:** Victory Native Charts
- **Storage:** Safe Local Storage with Automatic Network Queue Dispatcher
