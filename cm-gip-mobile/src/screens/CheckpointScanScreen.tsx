import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import QRCode from 'react-native-qrcode-svg';
import { getConsignments, recordCheckpointScan, getConsignmentTimeline, Consignment, CheckpointRecord } from '../services/transportService';

export default function CheckpointScanScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [selectedConsignment, setSelectedConsignment] = useState<Consignment | null>(null);
  const [locationName, setLocationName] = useState('Checkpoint Intermediate Weighbridge');
  const [verifiedQty, setVerifiedQty] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('Seal Intact - GPS Online');
  const [isDestination, setIsDestination] = useState(false);
  const [timeline, setTimeline] = useState<CheckpointRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrModalConsignment, setQrModalConsignment] = useState<Consignment | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const loadData = async () => {
    const list = await getConsignments();
    setConsignments(list);
    if (list.length > 0 && !selectedConsignment) {
      setSelectedConsignment(list[0]);
      setVerifiedQty(String(list[0].quantity_tonnes));
      const t = await getConsignmentTimeline(list[0].id);
      setTimeline(t);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectConsignment = async (item: Consignment) => {
    setSelectedConsignment(item);
    setVerifiedQty(String(item.quantity_tonnes));
    const t = await getConsignmentTimeline(item.id);
    setTimeline(t);
  };

  const handleRecordCheckpoint = async () => {
    if (!selectedConsignment) {
      Alert.alert('Selection Error', 'Please select or scan a consignment.');
      return;
    }

    const qtyNumber = parseFloat(verifiedQty);
    if (isNaN(qtyNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid verified quantity.');
      return;
    }

    setIsProcessing(true);
    try {
      const { checkpoint, updatedConsignment } = await recordCheckpointScan({
        consignment_id: selectedConsignment.id,
        location: locationName,
        quantity_verified: qtyNumber,
        vehicle_status: vehicleStatus,
        isDestination: isDestination,
        notes: isDestination ? 'Final Destination Weighbridge Clearance' : 'Intermediate Transit Check'
      });

      setSelectedConsignment(updatedConsignment);
      const updatedTimeline = await getConsignmentTimeline(updatedConsignment.id);
      setTimeline(updatedTimeline);

      if (checkpoint.mismatch_detected) {
        Alert.alert(
          '⚠️ QUANTITY MISMATCH FLAGGED',
          `Expected: ${selectedConsignment.quantity_tonnes} Tonnes\nVerified: ${qtyNumber} Tonnes (Discrepancy: ${(selectedConsignment.quantity_tonnes - qtyNumber).toFixed(1)}T)\n\nFlagged to DGMS Audit & Safety Officer.`,
          [{ text: 'Acknowledge' }]
        );
      } else {
        Alert.alert(
          '✅ Checkpoint Verified',
          `Consignment ${updatedConsignment.consignment_code} updated to status: ${updatedConsignment.status.toUpperCase()}`,
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to record checkpoint');
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Coal Transport QR Verification</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ConsignmentRegistration')} style={styles.newBtn}>
          <Ionicons name="add-circle" size={26} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Workflow Explanation Banner */}
        <View style={[styles.guideCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="git-network" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.guideTitle, { color: theme.colors.text }]}>Coal Transport QR Flow</Text>
          </View>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>1. Mine Dispatch registers truck & generates digital QR pass (Tap "+" top-right).</Text>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>2. Checkpoints & Weighbridges scan the QR code from driver's pass.</Text>
          <Text style={[styles.guideStep, { color: theme.colors.textLight }]}>3. Official enters weighed weight. Weight loss &gt;0.5T fires an Anomaly Alert.</Text>
        </View>

        {/* Consignment Selector / QR Scanned Pass */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>
            Active Consignments (QR Scanned)
          </Text>
          <TouchableOpacity onPress={() => setIsScanModalOpen(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="scan" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700' }}>Scan QR</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {consignments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.consignmentCard,
                {
                  backgroundColor: selectedConsignment?.id === item.id ? theme.colors.primary : theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => handleSelectConsignment(item)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.cardCode, { color: selectedConsignment?.id === item.id ? '#FFF' : theme.colors.text }]}>
                  {item.consignment_code}
                </Text>
                <TouchableOpacity onPress={() => setQrModalConsignment(item)}>
                  <Ionicons name="qr-code" size={16} color={selectedConsignment?.id === item.id ? '#FFF' : theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.cardVehicle, { color: selectedConsignment?.id === item.id ? '#E2E8F0' : theme.colors.textLight }]}>
                {item.vehicle_no} • {item.quantity_tonnes} T
              </Text>
              <Text style={[
                styles.cardStatus, 
                { color: item.status === 'flagged' ? theme.colors.danger : (item.status === 'delivered' ? theme.colors.success : theme.colors.warning) }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedConsignment && (
          <View style={[styles.actionCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={[styles.cardHeader, { color: theme.colors.text }]}>
                  Weighbridge Checkpoint Scan
                </Text>
                <Text style={[styles.subText, { color: theme.colors.textLight }]}>
                  Pass: {selectedConsignment.consignment_code} • {selectedConsignment.vehicle_no}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.qrIconBadge, { backgroundColor: theme.colors.accent, borderColor: theme.colors.primary }]}
                onPress={() => setQrModalConsignment(selectedConsignment)}
              >
                <Ionicons name="qr-code" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.colors.textLight }]}>Checkpoint Location Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={locationName}
              onChangeText={setLocationName}
            />

            <Text style={[styles.label, { color: theme.colors.textLight }]}>
              Verified Weight (Tonnes) [Registered Dispatch: {selectedConsignment.quantity_tonnes} T]
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              keyboardType="decimal-pad"
              value={verifiedQty}
              onChangeText={setVerifiedQty}
              placeholder="Enter measured scale weight"
              placeholderTextColor={theme.colors.textLight}
            />

            <Text style={[styles.label, { color: theme.colors.textLight }]}>Vehicle & Seal Integrity</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={vehicleStatus}
              onChangeText={setVehicleStatus}
            />

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Final Destination Delivery</Text>
              <Switch
                value={isDestination}
                onValueChange={setIsDestination}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
              />
            </View>

            <TouchableOpacity
              style={[styles.scanBtn, { backgroundColor: isDestination ? theme.colors.success : theme.colors.primary }]}
              onPress={handleRecordCheckpoint}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.scanBtnText}>
                  {isDestination ? 'Confirm Final Delivery' : 'Log Weighbridge Verification'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Traceability Timeline */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Consignment Audit Timeline</Text>
        <View style={[styles.timelineCard, { backgroundColor: theme.colors.card }]}>
          {timeline.length === 0 ? (
            <Text style={{ color: theme.colors.textLight, textAlign: 'center' }}>No checkpoint logs yet.</Text>
          ) : (
            timeline.map((point, index) => {
              const hasMismatch = Boolean(point.mismatch_detected);
              const timeStr = new Date(point.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <View key={point.id || index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineDot,
                      { backgroundColor: hasMismatch ? theme.colors.danger : theme.colors.primary }
                    ]} />
                    {index < timeline.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineLoc, { color: theme.colors.text }]}>{point.location}</Text>
                    <Text style={[styles.timelineMeta, { color: theme.colors.textLight }]}>
                      Verified: {point.quantity_verified} T • {timeStr}
                    </Text>
                    <Text style={[styles.timelineStatus, { color: hasMismatch ? theme.colors.danger : theme.colors.success }]}>
                      {point.vehicle_status} {hasMismatch ? '⚠️ MISMATCH' : ''}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* POPUP: QR PASS VIEWER */}
      <Modal visible={Boolean(qrModalConsignment)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.qrModalCard, { backgroundColor: theme.colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.qrModalTitle, { color: theme.colors.text }]}>Truck Dispatch QR Pass</Text>
              <TouchableOpacity onPress={() => setQrModalConsignment(null)}>
                <Ionicons name="close-circle" size={26} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>

            {qrModalConsignment ? (
              <>
                <View style={styles.qrCodeBox}>
                  <QRCode
                    value={`MINEGOV-CONSIGNMENT:${qrModalConsignment.consignment_code}:${qrModalConsignment.vehicle_no}:${qrModalConsignment.quantity_tonnes}`}
                    size={190}
                    color="#000"
                    backgroundColor="#FFF"
                  />
                </View>
                <Text style={[styles.badgeWorkerName, { color: theme.colors.text }]}>{qrModalConsignment.consignment_code}</Text>
                <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 13, marginTop: 2 }}>
                  Vehicle: {qrModalConsignment.vehicle_no}
                </Text>
                <Text style={{ color: theme.colors.textLight, fontSize: 12, marginTop: 2 }}>
                  Quantity: {qrModalConsignment.quantity_tonnes} Tonnes • {qrModalConsignment.coal_type}
                </Text>
                <TouchableOpacity
                  style={[styles.modalScanBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={() => {
                    handleSelectConsignment(qrModalConsignment);
                    setQrModalConsignment(null);
                  }}
                >
                  <Ionicons name="checkmark-done" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Load to Weighbridge</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* POPUP: LIVE CAMERA SCANNER SIMULATOR */}
      <Modal visible={isScanModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.qrModalCard, { backgroundColor: theme.colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.qrModalTitle, { color: theme.colors.text }]}>Weighbridge QR Scanner</Text>
              <TouchableOpacity onPress={() => setIsScanModalOpen(false)}>
                <Ionicons name="close-circle" size={26} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.scannerViewport}>
              <Ionicons name="scan-outline" size={120} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.textLight, marginTop: 12, textAlign: 'center', fontSize: 12 }}>
                Point camera at driver QR pass or select active consignment:
              </Text>
            </View>

            <ScrollView style={{ width: '100%', maxHeight: 180, marginTop: 12 }}>
              {consignments.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.scannerSelectRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
                  onPress={() => {
                    handleSelectConsignment(c);
                    setIsScanModalOpen(false);
                  }}
                >
                  <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 13 }}>{c.consignment_code}</Text>
                  <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: 'bold' }}>Select ({c.vehicle_no})</Text>
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
  newBtn: { padding: 4 },
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
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  horizontalScroll: { marginBottom: 16 },
  consignmentCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 170
  },
  cardCode: { fontSize: 13, fontWeight: '700' },
  cardVehicle: { fontSize: 12, marginTop: 4 },
  cardStatus: { fontSize: 11, fontWeight: '800', marginTop: 6 },
  actionCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  cardHeader: { fontSize: 16, fontWeight: '700' },
  subText: { fontSize: 13, marginTop: 2, marginBottom: 12 },
  qrIconBadge: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1
  },
  label: { fontSize: 12, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14
  },
  switchLabel: { fontSize: 14, fontWeight: '600' },
  scanBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  scanBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  timelineCard: {
    borderRadius: 12,
    padding: 16
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 10
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4
  },
  timelineContent: { flex: 1 },
  timelineLoc: { fontSize: 14, fontWeight: '700' },
  timelineMeta: { fontSize: 12, marginTop: 2 },
  timelineStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
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
