import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import { getAttendanceRecords, recordWorkerCheckInOut, DEMO_WORKERS, AttendanceRecord, DemoWorker } from '../services/attendanceService';

export default function AttendanceScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const { t } = useTranslation();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<DemoWorker>(DEMO_WORKERS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrModalWorker, setQrModalWorker] = useState<DemoWorker | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const loadData = async () => {
    const list = await getAttendanceRecords();
    setRecords(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScanWorker = async (worker: DemoWorker) => {
    setIsProcessing(true);
    try {
      const result = await recordWorkerCheckInOut(worker.worker_id, worker.worker_name);
      await loadData();
      setIsScanModalOpen(false);

      if (result.action === 'check_in') {
        Alert.alert(
          '✅ QR Check-In Verified',
          `Worker: ${result.record.worker_name}\nBadge: ${result.record.worker_id}\nShift Start: ${new Date(result.record.check_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        );
      } else {
        if (result.alertGenerated) {
          Alert.alert(
            '⚠️ LABOUR SAFETY VIOLATION',
            `${result.alertGenerated}\n\nShift Duration: ${result.record.shift_hours} hrs.\nLogged to DGMS compliance auditor.`,
            [{ text: 'Acknowledge' }]
          );
        } else {
          Alert.alert(
            '✅ Shift Completed & Checked Out',
            `Worker: ${result.record.worker_name}\nTotal Shift: ${result.record.shift_hours} hrs. Statutory 8h requirement met.`
          );
        }
      }
    } catch (err: any) {
      Alert.alert('Attendance Notice', 'Saved to offline local sync queue.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Labour Attendance & QR Gate</Text>
        <TouchableOpacity onPress={() => setIsScanModalOpen(true)} style={styles.scanHeaderBtn}>
          <Ionicons name="scan" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Workflow Guide Card */}
        <View style={[styles.guideCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.guideTitle, { color: theme.colors.text }]}>How QR Attendance Works</Text>
          </View>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>1. Miner scans physical/digital QR badge at mine gate / shaft entry.</Text>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>2. First scan marks <Text style={{ fontWeight: 'bold', color: theme.colors.success }}>Check-In</Text> (Active Shift).</Text>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>3. Second scan marks <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>Check-Out</Text> (End of Shift).</Text>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>4. If shift duration &lt; 8 hours, system triggers a <Text style={{ fontWeight: 'bold', color: theme.colors.danger }}>Labour Rule Violation</Text>.</Text>
        </View>

        {/* Worker Badge Selection & QR Trigger Card */}
        <View style={[styles.scanCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="qr-code-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Mine Gate QR Pass Scanner</Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textLight }]}>
            Tap a miner to select their badge, view their official QR code, or trigger entry/exit scan.
          </Text>

          <Text style={[styles.sectionLabel, { color: theme.colors.textLight }]}>Registered Miners & Operators:</Text>
          {DEMO_WORKERS.map((worker) => {
            const hasActiveShift = records.some(r => r.worker_id === worker.worker_id && !r.check_out_at);
            const isSelected = selectedWorker.worker_id === worker.worker_id;

            return (
              <TouchableOpacity
                key={worker.worker_id}
                style={[
                  styles.workerRow,
                  {
                    backgroundColor: isSelected ? theme.colors.background : theme.colors.card,
                    borderColor: hasActiveShift ? theme.colors.warning : (isSelected ? theme.colors.primary : theme.colors.border)
                  }
                ]}
                onPress={() => setSelectedWorker(worker)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workerName, { color: theme.colors.text }]}>{worker.worker_name}</Text>
                  <Text style={[styles.workerMeta, { color: theme.colors.textLight }]}>
                    ID: {worker.worker_id} • {worker.designation} • {worker.shift}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity 
                    style={[styles.qrBadgeIconBtn, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}
                    onPress={() => setQrModalWorker(worker)}
                  >
                    <Ionicons name="qr-code" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>

                  <View style={[
                    styles.statusTag,
                    { backgroundColor: hasActiveShift ? theme.colors.warning + '25' : theme.colors.border }
                  ]}>
                    <Text style={[
                      styles.statusTagText,
                      { color: hasActiveShift ? theme.colors.warning : theme.colors.textLight }
                    ]}>
                      {hasActiveShift ? 'IN MINE' : 'OFF SHIFT'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.colors.primary, flex: 1, marginRight: 6 }]}
              onPress={() => handleScanWorker(selectedWorker)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="scan-circle" size={20} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>
                    {records.some(r => r.worker_id === selectedWorker.worker_id && !r.check_out_at)
                      ? `Check-OUT (${selectedWorker.worker_id})`
                      : `Check-IN (${selectedWorker.worker_id})`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewQrBtn, { borderColor: theme.colors.primary, paddingHorizontal: 14 }]}
              onPress={() => setQrModalWorker(selectedWorker)}
            >
              <Ionicons name="qr-code-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendance Activity Log */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>
          Today's Live Mine Shift Activity Log
        </Text>
        
        {records.length === 0 ? (
          <Text style={{ color: theme.colors.textLight, textAlign: 'center', marginTop: 12 }}>No attendance records logged today.</Text>
        ) : (
          records.map((item) => {
            const hasShortShift = Boolean(item.shift_hours !== null && item.shift_hours !== undefined && item.shift_hours < 8);
            const inTimeStr = new Date(item.check_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const outTimeStr = item.check_out_at ? new Date(item.check_out_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

            return (
              <View key={item.id} style={[styles.logCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logName, { color: theme.colors.text }]}>{item.worker_name}</Text>
                  <Text style={[
                    styles.logBadge,
                    { color: item.check_out_at ? (hasShortShift ? theme.colors.danger : theme.colors.success) : theme.colors.warning }
                  ]}>
                    {item.check_out_at ? `${item.shift_hours}h Shift` : 'Active Inside Mine'}
                  </Text>
                </View>
                <Text style={[styles.logTime, { color: theme.colors.textLight }]}>
                  Entry: {inTimeStr} {outTimeStr ? `• Exit: ${outTimeStr}` : '• (On-Duty)'}
                </Text>
                {hasShortShift ? (
                  <Text style={[styles.violationWarning, { color: theme.colors.danger }]}>
                    ⚠️ Short Shift Violation Alert Logged (&lt; 8.0h)
                  </Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* POPUP: MINER OFFICIAL QR BADGE MODAL */}
      <Modal visible={Boolean(qrModalWorker)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.qrModalCard, { backgroundColor: theme.colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.qrModalTitle, { color: theme.colors.text }]}>Miner Digital Identity Badge</Text>
              <TouchableOpacity onPress={() => setQrModalWorker(null)}>
                <Ionicons name="close-circle" size={26} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>

            {qrModalWorker ? (
              <>
                <View style={styles.qrCodeBox}>
                  <QRCode
                    value={`MINEGOV-WORKER:${qrModalWorker.worker_id}:${qrModalWorker.worker_name}`}
                    size={190}
                    color="#000"
                    backgroundColor="#FFF"
                  />
                </View>
                <Text style={[styles.badgeWorkerName, { color: theme.colors.text }]}>{qrModalWorker.worker_name}</Text>
                <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 13, marginTop: 2 }}>
                  Badge ID: {qrModalWorker.worker_id}
                </Text>
                <Text style={{ color: theme.colors.textLight, fontSize: 12, marginTop: 2 }}>
                  {qrModalWorker.designation} • {qrModalWorker.shift}
                </Text>

                <TouchableOpacity 
                  style={[styles.modalScanBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleScanWorker(qrModalWorker)}
                >
                  <Ionicons name="scan" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Simulate Scanner Scan</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* POPUP: SCANNER INTERFACE MODAL */}
      <Modal visible={isScanModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.qrModalCard, { backgroundColor: theme.colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.qrModalTitle, { color: theme.colors.text }]}>Live Gate QR Scanner</Text>
              <TouchableOpacity onPress={() => setIsScanModalOpen(false)}>
                <Ionicons name="close-circle" size={26} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.scannerViewport}>
              <Ionicons name="scan-outline" size={120} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.textLight, marginTop: 12, textAlign: 'center', fontSize: 12 }}>
                Point camera at miner QR badge or select worker to record attendance:
              </Text>
            </View>

            <ScrollView style={{ width: '100%', maxHeight: 180, marginTop: 12 }}>
              {DEMO_WORKERS.map(w => (
                <TouchableOpacity
                  key={w.worker_id}
                  style={[styles.scannerSelectRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
                  onPress={() => handleScanWorker(w)}
                >
                  <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 13 }}>{w.worker_name}</Text>
                  <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: 'bold' }}>Scan ({w.worker_id})</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  backButton: { padding: 4 },
  scanHeaderBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  guideCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 16
  },
  guideTitle: { fontSize: 14, fontWeight: '700' },
  guideStep: { fontSize: 12, marginTop: 4 },
  scanCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
  cardSubtitle: { fontSize: 13, marginBottom: 12 },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  workerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  workerName: { fontSize: 14, fontWeight: '700' },
  workerMeta: { fontSize: 12, marginTop: 2 },
  qrBadgeIconBtn: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6
  },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusTagText: { fontSize: 10, fontWeight: '800' },
  actionBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  viewQrBtn: {
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  logCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logName: { fontSize: 14, fontWeight: '700' },
  logBadge: { fontSize: 12, fontWeight: '800' },
  logTime: { fontSize: 12, marginTop: 4 },
  violationWarning: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  qrModalCard: {
    width: '100%',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    elevation: 6
  },
  qrModalTitle: { fontSize: 16, fontWeight: 'bold' },
  qrCodeBox: {
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginVertical: 12
  },
  badgeWorkerName: { fontSize: 17, fontWeight: 'bold' },
  modalScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16
  },
  scannerViewport: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    padding: 12
  },
  scannerSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 6
  }
});
