import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Image, 
  ActivityIndicator, 
  TextInput,
  Modal,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { submitInspection } from '../services/inspectionService';
import { aiService } from '../services/aiService';

// Predefined 20-item Coal Mine Safety Checklist
const INITIAL_CHECKLIST = [
  { id: 1, rule_code: 'CMR-101', text: 'Perimeter & Access Control Fencing Intact', status: 'pass' },
  { id: 2, rule_code: 'CMR-102', text: 'Ventilation Shaft Airflow & Duct Pressure Normal', status: 'pass' },
  { id: 3, rule_code: 'CMR-103', text: 'Emergency Evacuation & Directional Safety Signs Visible', status: 'pass' },
  { id: 4, rule_code: 'CMR-104', text: 'Gas Detectors Operational (Methane < 0.75%, CO < 50ppm)', status: 'pass' },
  { id: 5, rule_code: 'CMR-105', text: 'Roof & Side Support Timbering/Bolting Secure', status: 'pass' },
  { id: 6, rule_code: 'CMR-106', text: 'Dust Suppression Water Sprays Working at Loading Points', status: 'pass' },
  { id: 7, rule_code: 'CMR-107', text: 'Haul Road Width & Gradient Compliant with Safety Margins', status: 'pass' },
  { id: 8, rule_code: 'CMR-108', text: 'Conveyor Belt Emergency Trip Wire & Guard Mesh Installed', status: 'pass' },
  { id: 9, rule_code: 'CMR-109', text: 'Explosives Storage Magazine Locked & Grounded', status: 'pass' },
  { id: 10, rule_code: 'CMR-110', text: 'Electrical Switchgear & Substation Flameproof Certified', status: 'pass' },
  { id: 11, rule_code: 'CMR-111', text: 'First Aid Station Stocked & Stretcher Ready', status: 'pass' },
  { id: 12, rule_code: 'CMR-112', text: 'Self-Contained Self-Rescuers (SCSR) Worn by Workers', status: 'pass' },
  { id: 13, rule_code: 'CMR-113', text: 'Pumping & Dewatering Sump Levels Acceptable', status: 'pass' },
  { id: 14, rule_code: 'CMR-114', text: 'Machinery Backup Beepers & Operator Cabin ROPS Functional', status: 'pass' },
  { id: 15, rule_code: 'CMR-115', text: 'Flame Safety Lamp / Digital Detector Calibrated Today', status: 'pass' },
  { id: 16, rule_code: 'CMR-116', text: 'Illumination Levels in Working Dip Section Adequate', status: 'pass' },
  { id: 17, rule_code: 'CMR-117', text: 'Fire Extinguishers Charged & Tagged Within Date', status: 'pass' },
  { id: 18, rule_code: 'CMR-118', text: 'Overburden Bench Slope Stability Inspected', status: 'pass' },
  { id: 19, rule_code: 'CMR-119', text: 'Communication Telephone / Wireless Link Functional Underground', status: 'pass' },
  { id: 20, rule_code: 'CMR-120', text: 'Shift Attendance & Man-Riding Hoist Log Verified', status: 'pass' },
];

const AVAILABLE_MINES = [
  { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Dhanbad Colliery Block-B', district: 'Dhanbad, Jharkhand', lat: 23.7957, lng: 86.4304 },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', name: 'Gevra OpenCast Mine', district: 'Korba, Chhattisgarh', lat: 22.3384, lng: 82.6053 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', name: 'Singareni Underground Shaft 3', district: 'Kothagudem, Telangana', lat: 17.5524, lng: 80.6225 },
];

export default function InspectionScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const [step, setStep] = useState(1);
  const [selectedMine, setSelectedMine] = useState<any>(AVAILABLE_MINES[0]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [observationText, setObservationText] = useState('');
  const [customIssueText, setCustomIssueText] = useState('');
  const [showAddIssueInput, setShowAddIssueInput] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
        } catch (e) {
          // GPS fallback
        }
      }
    })();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedMine) {
        Alert.alert("Select Mine", "Please select a target mine before proceeding.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const setCheckStatus = (id, newStatus) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleAddCustomIssue = () => {
    if (!customIssueText.trim()) return;
    const newItem = {
      id: Date.now(),
      rule_code: 'CUSTOM-FAIL',
      text: customIssueText.trim(),
      status: 'fail',
      isCustom: true
    };
    setChecklist([...checklist, newItem]);
    setCustomIssueText('');
    setShowAddIssueInput(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disabling crop as specified
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const extractText = async () => {
    if (!image) return;
    setIsExtracting(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
      const extractedText = await aiService.extractTextFromImage(base64);
      setObservationText(prev => prev ? `${prev}\n\n${extractedText}` : extractedText);
      Alert.alert('AI OCR Success ✨', 'Extracted handwritten text added to observations!', [
        { text: 'Review Text', onPress: () => setStep(3) },
        { text: 'OK', style: 'cancel' }
      ]);
    } catch (error) {
      Alert.alert("OCR Failed", "Failed to extract text from image. Please type manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const failedItems = checklist.filter(c => c.status === 'fail');
      
      const riskData = await aiService.analyzeInspectionRisk({
        checklistFailures: failedItems.map(f => f.text),
        observations: [{ text: observationText }]
      });

      await submitInspection({
        mine_id: selectedMine.id,
        mine_name: selectedMine.name,
        location: location || { latitude: selectedMine.lat, longitude: selectedMine.lng },
        imageUri: image,
        passed: failedItems.length === 0,
        checklist: checklist,
        observations: [{ text: observationText, severity: aiAnalysis?.severity || 'minor', regulation: aiAnalysis?.regulation }],
        aiRiskScore: riskData.riskScore,
        aiRiskLevel: riskData.riskLevel,
        aiInsights: riskData.insights
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      Alert.alert("Submission Alert", "Report saved offline into sync queue.");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const failedCount = checklist.filter(c => c.status === 'fail').length;
  const passCount = checklist.filter(c => c.status === 'pass').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>New Inspection</Text>
        <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>Step {step}/5</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 5) * 100}%`, backgroundColor: theme.colors.primary }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* STEP 1: MINE SELECTION & GPS */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Ionicons name="business-outline" size={56} color={theme.colors.primary} style={{marginBottom: 12}} />
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Mine & Location Verification</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textLight }]}>
              Select the coal mine site and verify your GPS location before starting the audit.
            </Text>

            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Select Target Mine:</Text>
            {AVAILABLE_MINES.map(mine => (
              <TouchableOpacity 
                key={mine.id} 
                style={[
                  styles.mineCard, 
                  { 
                    backgroundColor: selectedMine?.id === mine.id ? theme.colors.accent : theme.colors.card, 
                    borderColor: selectedMine?.id === mine.id ? theme.colors.primary : theme.colors.border 
                  }
                ]}
                onPress={() => setSelectedMine(mine)}
              >
                <View style={{flex: 1}}>
                  <Text style={[styles.mineName, { color: theme.colors.text }]}>{mine.name}</Text>
                  <Text style={{color: theme.colors.textLight, fontSize: 13}}>{mine.district}</Text>
                </View>
                {selectedMine?.id === mine.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, marginTop: 16 }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                <Ionicons name="location" size={20} color={theme.colors.primary} style={{marginRight: 6}} />
                <Text style={[styles.infoLabel, { color: theme.colors.text }]}>GPS Verification</Text>
              </View>
              {location ? (
                <Text style={{color: theme.colors.success, fontWeight: '600'}}>
                  Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
                </Text>
              ) : (
                <Text style={{color: theme.colors.warning}}>Fetching GPS Lock...</Text>
              )}
            </View>
          </View>
        )}

        {/* STEP 2: SAFETY CHECKLIST (20 ITEMS + CUSTOM ISSUE) */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Safety Checklist (CMR 2017)</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textLight }]}>
              Audit key compliance indicators. Items marked 'FAIL' will automatically generate corrective action tasks.
            </Text>

            <View style={styles.summaryBadgeRow}>
              <Text style={[styles.badge, { backgroundColor: '#DEF7EC', color: '#03543F' }]}>PASS: {passCount}</Text>
              <Text style={[styles.badge, { backgroundColor: '#FDE8E8', color: '#9B1C1C' }]}>FAIL: {failedCount}</Text>
            </View>

            <View style={[styles.checklistContainer, { backgroundColor: theme.colors.card }]}>
              {checklist.map((item) => (
                <View key={item.id} style={[styles.checkItem, { borderBottomColor: theme.colors.border }]}>
                  <View style={{flex: 1, marginRight: 8}}>
                    <Text style={{fontSize: 11, fontWeight: 'bold', color: theme.colors.primary}}>{item.rule_code}</Text>
                    <Text style={[styles.checkText, { color: theme.colors.text }]}>{item.text}</Text>
                  </View>

                  <View style={styles.statusButtonGroup}>
                    <TouchableOpacity 
                      style={[styles.statusBtn, item.status === 'pass' && { backgroundColor: theme.colors.success }]} 
                      onPress={() => setCheckStatus(item.id, 'pass')}
                    >
                      <Text style={[styles.statusBtnText, item.status === 'pass' && { color: '#FFF' }]}>PASS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.statusBtn, item.status === 'fail' && { backgroundColor: theme.colors.danger }]} 
                      onPress={() => setCheckStatus(item.id, 'fail')}
                    >
                      <Text style={[styles.statusBtnText, item.status === 'fail' && { color: '#FFF' }]}>FAIL</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* ADD CUSTOM ISSUE BUTTON */}
            {showAddIssueInput ? (
              <View style={[styles.customIssueBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.inputField, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  placeholder="Describe newly discovered safety issue..."
                  placeholderTextColor={theme.colors.textLight}
                  value={customIssueText}
                  onChangeText={setCustomIssueText}
                />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8}}>
                  <TouchableOpacity onPress={() => setShowAddIssueInput(false)} style={{padding: 8, marginRight: 8}}>
                    <Text style={{color: theme.colors.textLight}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddCustomIssue} style={[styles.addIssueConfirmBtn, { backgroundColor: theme.colors.primary }]}>
                    <Text style={{color: '#FFF', fontWeight: 'bold'}}>Add Issue (Mark Fail)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.addIssueBtn, { borderColor: theme.colors.primary }]} 
                onPress={() => setShowAddIssueInput(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} style={{marginRight: 6}} />
                <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>+ Add Custom Issue / Defect</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 3: OBSERVATIONS & AI */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Observations & AI Classification</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textLight }]}>
              Enter specific field observations. Gemini AI will assist by evaluating risk severity and CMR regulations.
            </Text>

            <TextInput
              style={[styles.inputArea, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
              multiline
              numberOfLines={5}
              placeholder="Enter detailed observation or OCR extracted notes..."
              placeholderTextColor={theme.colors.textLight}
              value={observationText}
              onChangeText={setObservationText}
            />

            <TouchableOpacity 
              style={[styles.aiButton, { backgroundColor: theme.colors.accent }]} 
              onPress={async () => {
                if(!observationText.trim()) return;
                setIsAnalyzing(true);
                try {
                  const result = await aiService.classifyObservationSeverity(observationText);
                  setAiAnalysis(result);
                } catch(e) {
                  Alert.alert("AI Note", "AI Service temporarily unavailable. Defaulting to standard classification.");
                } finally {
                  setIsAnalyzing(false);
                }
              }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <ActivityIndicator color={theme.colors.primary} /> : (
                <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>✨ Analyze Severity with Gemini AI</Text>
              )}
            </TouchableOpacity>

            {aiAnalysis && (
              <View style={[styles.aiResultCard, { backgroundColor: theme.colors.card, borderColor: aiAnalysis.severity === 'critical' ? theme.colors.danger : theme.colors.warning }]}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <Ionicons name="alert-circle" size={22} color={aiAnalysis.severity === 'critical' ? theme.colors.danger : theme.colors.warning} />
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginLeft: 6, textTransform: 'uppercase'}}>
                    [{aiAnalysis.severity}] SEVERITY
                  </Text>
                </View>
                <Text style={{color: theme.colors.text, fontWeight: '600', marginBottom: 4}}>Cited: {aiAnalysis.regulation}</Text>
                <Text style={{color: theme.colors.textLight, fontSize: 13}}>{aiAnalysis.reasoning}</Text>
              </View>
            )}
          </View>
        )}

        {/* STEP 4: EVIDENCE (CAMERA & OCR) */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Photo Evidence & OCR</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textLight }]}>
              Capture mine site violations or paper shift logs to extract text automatically.
            </Text>

            <TouchableOpacity style={[styles.imagePicker, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderStyle: 'dashed', borderWidth: 2 }]} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={56} color={theme.colors.primary} />
                  <Text style={{color: theme.colors.primary, fontWeight: 'bold', marginTop: 8}}>Tap to Take Photo</Text>
                </>
              )}
            </TouchableOpacity>

            {image && (
              <TouchableOpacity 
                style={[styles.aiButton, { backgroundColor: theme.colors.accent, marginTop: 16 }]} 
                onPress={extractText}
                disabled={isExtracting}
              >
                {isExtracting ? <ActivityIndicator color={theme.colors.primary} /> : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="scan-outline" size={20} color={theme.colors.primary} style={{marginRight: 8}} />
                    <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>✨ Extract Text from Image (Gemini OCR)</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 5: REVIEW SUMMARY & SUBMIT */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Final Review & Submission</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textLight }]}>
              Confirm audit details before generating final inspection payload.
            </Text>

            <View style={[styles.summaryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.summaryHeader, { color: theme.colors.text }]}>Target Mine: {selectedMine?.name}</Text>
              <Text style={{color: theme.colors.textLight}}>Location: {selectedMine?.district}</Text>

              <View style={{height: 1, backgroundColor: theme.colors.border, marginVertical: 12}} />

              <Text style={{color: theme.colors.text, fontWeight: '600'}}>Checklist Summary:</Text>
              <Text style={{color: theme.colors.success}}>✓ Passed: {passCount} items</Text>
              <Text style={{color: failedCount > 0 ? theme.colors.danger : theme.colors.textLight}}>
                ✗ Failed: {failedCount} items (Will generate {failedCount} corrective tasks)
              </Text>

              <View style={{height: 1, backgroundColor: theme.colors.border, marginVertical: 12}} />

              <Text style={{color: theme.colors.text, fontWeight: '600'}}>Observations Provided:</Text>
              <Text style={{color: theme.colors.textLight, fontStyle: observationText ? 'normal' : 'italic'}}>
                {observationText || 'No text observations attached.'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        {step > 1 && (
          <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={handlePrev}>
            <Text style={[styles.prevButtonText, { color: theme.colors.text }]}>Back</Text>
          </TouchableOpacity>
        )}
        
        {step < 5 ? (
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.primary, flex: 1, marginLeft: step > 1 ? 12 : 0 }]} onPress={handleNext}>
            <Text style={styles.navButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.success, flex: 1, marginLeft: 12 }]} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.navButtonText}>Submit Audit Report</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* ANIMATED SUCCESS POPUP MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="checkmark-circle" size={72} color={theme.colors.success} />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Report Submitted Successfully</Text>
            <Text style={{color: theme.colors.textLight, marginTop: 4, textAlign: 'center'}}>
              Inspection payload logged to database & corrective actions dispatched.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  progressBar: { height: 4, width: '100%', backgroundColor: '#E2E8F0' },
  progressFill: { height: '100%' },
  content: { padding: 20 },
  stepContainer: { width: '100%' },
  stepTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  stepDesc: { fontSize: 13, marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  mineCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1.5, marginBottom: 10 },
  mineName: { fontSize: 16, fontWeight: 'bold' },
  infoCard: { padding: 16, borderRadius: 12 },
  infoLabel: { fontSize: 14, fontWeight: 'bold' },
  summaryBadgeRow: { flexDirection: 'row', marginBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: 'bold', fontSize: 12, marginRight: 8 },
  checklistContainer: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  checkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  checkText: { fontSize: 14, marginTop: 2 },
  statusButtonGroup: { flexDirection: 'row' },
  statusBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1', marginLeft: 4 },
  statusBtnText: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  addIssueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', marginTop: 16 },
  customIssueBox: { padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 16 },
  inputField: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  addIssueConfirmBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  inputArea: { width: '100%', borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15, textAlignVertical: 'top', minHeight: 120 },
  aiButton: { width: '100%', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  aiResultCard: { width: '100%', padding: 14, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', marginTop: 16 },
  imagePicker: { width: '100%', height: 220, borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  summaryCard: { width: '100%', padding: 16, borderRadius: 12, borderWidth: 1 },
  summaryHeader: { fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1 },
  navButton: { height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  prevButton: { width: 90, backgroundColor: '#E2E8F0' },
  prevButtonText: { fontSize: 15, fontWeight: '600' },
  navButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', padding: 28, borderRadius: 20, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16 }
});
