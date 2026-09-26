import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app_title: 'MineGOV',
      welcome: 'Welcome back,',
      dashboard: 'Dashboard',
      tasks: 'Tasks',
      alerts: 'Alerts',
      profile: 'Profile',
      inspection: 'Inspection',
      review: 'Compliance Review',
      start_inspection: 'Start Inspection',
      review_reports: 'Review Reports',
      overview: 'Overview',
      compliance_rate: 'Compliance Rate',
      pending_tasks: 'Pending Tasks',
      ai_risk_predictions: '✨ AI Risk Predictions',
      sustainability_score: 'Mine Sustainability Score',
      sustainability_status: 'Grade A - High Sustainability',
      risk_heatmap: 'Mine Risk Heat Grid',
      quick_actions: 'Quick Actions',
      coal_transport: 'Coal Transport QR',
      labour_attendance: 'Labour Attendance',
      export_report: 'Export Regulatory Report',
      switch_language: 'हिन्दी में बदलें',
      current_lang: 'English',
      
      // Anomaly & Rule Violations (Easy Language)
      rule_violations_title: '⚠️ Safety Rule Deviations & Violation Alerts',
      rule_violations_desc: 'Non-compliance incidents flagged under Coal Mines Regulations (CMR) 2017.',

      // Inspection Flow
      step_1_title: 'Step 1: Mine & Geofence Lock',
      step_2_title: 'Step 2: Safety Checklist',
      step_3_title: 'Step 3: Evidence & Observations',
      select_mine: 'Select Mine Location',
      gps_locked: 'GPS Geofence Verified',
      photo_evidence: 'Photo Evidence',
      video_evidence: 'Video Evidence (Max 30s)',
      capture_video: 'Record Video Evidence',
      video_attached: 'Video Evidence Attached (SHA-256 Verified)',
      ocr_badge: 'AI-extracted, requires human review',
      submit_report: 'Submit Inspection Report',
      rule_catalog: 'Matched Compliance Rule',
      observation_placeholder: 'Describe hazard or safety finding...',
      extract_ocr: 'Extract Document Text (OCR)',
      extract_doc_btn: '📄 Extract Document / Logbook Text',
      extracting_doc: 'Extracting text with Gemini AI...',

      // Role Views
      field_inspector_title: 'Field Safety Inspector',
      mining_official_title: 'Mine Operations Manager',
      compliance_officer_title: 'Compliance & Audit Officer',
      contractor_title: 'Contractor Action Plan',
      corporate_title: 'Corporate Executive ESG Overview',
      regulator_title: 'DGMS Regulatory Oversight'
    }
  },
  hi: {
    translation: {
      app_title: 'माइनगोव (MineGOV)',
      welcome: 'स्वागत है,',
      dashboard: 'डैशबोर्ड',
      tasks: 'कार्य सूची',
      alerts: 'अलर्ट व सूचनाएं',
      profile: 'प्रोफ़ाइल',
      inspection: 'खदान निरीक्षण',
      review: 'अनुपालन समीक्षा',
      start_inspection: 'निरीक्षण शुरू करें',
      review_reports: 'रिपोर्ट समीक्षा',
      overview: 'अवलोकन सारांश',
      compliance_rate: 'अनुपालन दर',
      pending_tasks: 'लंबित कार्य',
      ai_risk_predictions: '✨ एआई जोखिम पूर्वानुमान',
      sustainability_score: 'खदान स्थिरता स्कोर',
      sustainability_status: 'ग्रेड ए - उत्कृष्ट स्थिरता',
      risk_heatmap: 'खदान जोखिम हीट ग्रिड',
      quick_actions: 'त्वरित कार्रवाइयां',
      coal_transport: 'कोयला परिवहन क्यूआर',
      labour_attendance: 'श्रमिक उपस्थिति',
      export_report: 'नियामक रिपोर्ट निर्यात',
      switch_language: 'Switch to English',
      current_lang: 'हिंदी',
      
      // Anomaly & Rule Violations (Easy Language)
      rule_violations_title: '⚠️ सुरक्षा नियम विचलन एवं उल्लंघन चेतावनियां',
      rule_violations_desc: 'कोयला खान विनियम (CMR) 2017 के तहत दर्ज सुरक्षा कमियां।',

      // Inspection Flow
      step_1_title: 'चरण 1: खदान और जीपीएस लॉक',
      step_2_title: 'चरण 2: सुरक्षा चेकलिस्ट',
      step_3_title: 'चरण 3: साक्ष्य और अवलोकन',
      select_mine: 'खदान स्थान चुनें',
      gps_locked: 'जीपीएस जियोफेंस सत्यापित',
      photo_evidence: 'फोटो साक्ष्य',
      video_evidence: 'वीडियो साक्ष्य (अधिकतम 30 सेकंड)',
      capture_video: 'वीडियो साक्ष्य रिकॉर्ड करें',
      video_attached: 'वीडियो साक्ष्य संलग्न (SHA-256 सत्यापित)',
      ocr_badge: 'एआई-निकाला गया, मानवीय समीक्षा आवश्यक है',
      submit_report: 'निरीक्षण रिपोर्ट जमा करें',
      rule_catalog: 'संबद्ध अनुपालन नियम',
      observation_placeholder: 'खतरे या सुरक्षा निष्कर्ष का विवरण लिखें...',
      extract_ocr: 'दस्तावेज़ पाठ निकालें (OCR)',
      extract_doc_btn: '📄 दस्तावेज़ / लॉगबुक टेक्स्ट निकालें',
      extracting_doc: 'जेमिनी एआई द्वारा पाठ निकाला जा रहा है...',

      // Role Views
      field_inspector_title: 'फील्ड सुरक्षा निरीक्षक',
      mining_official_title: 'खदान संचालन प्रबंधक',
      compliance_officer_title: 'अनुपालन एवं लेखापरीक्षा अधिकारी',
      contractor_title: 'ठेकेदार कार्य योजना',
      corporate_title: 'कॉर्पोरेट कार्यकारी ईएसजी अवलोकन',
      regulator_title: 'डीजीएमएस नियामक निरीक्षण'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
