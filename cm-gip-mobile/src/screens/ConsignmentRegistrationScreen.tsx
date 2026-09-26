import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import QRCode from 'react-native-qrcode-svg';
import { registerConsignment, Consignment } from '../services/transportService';

export default function ConsignmentRegistrationScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const [vehicleNo, setVehicleNo] = useState('');
  const [coalType, setCoalType] = useState('Thermal Coal High Grade');
  const [qualityGrade, setQualityGrade] = useState('G-3 Grade');
  const [quantityTonnes, setQuantityTonnes] = useState('32.5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdConsignment, setCreatedConsignment] = useState<Consignment | null>(null);

  const handleRegister = async () => {
    if (!vehicleNo.trim() || !quantityTonnes.trim()) {
      Alert.alert('Validation Error', 'Please enter Vehicle Number and Quantity in tonnes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerConsignment({
        vehicle_no: vehicleNo,
        coal_type: coalType,
        quality_grade: qualityGrade,
        quantity_tonnes: parseFloat(quantityTonnes) || 30.0,
        source_mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        source_mine_name: 'DEMO Dhanbad Colliery Block-B'
      });
      setCreatedConsignment(result);
      Alert.alert('DEMO Success', `Consignment registered! QR Code generated for vehicle ${result.vehicle_no}.`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to register consignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Coal Consignment Registration</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Source Registration Details</Text>
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>DEMO Mining Official Portal</Text>

          <Text style={[styles.label, { color: theme.colors.textLight }]}>Source Mine</Text>
          <View style={[styles.readOnlyBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontWeight: '600' }}>DEMO Dhanbad Colliery Block-B</Text>
          </View>

          <Text style={[styles.label, { color: theme.colors.textLight }]}>Vehicle Registration No.</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="e.g. JH-10-DEMO-4821"
            placeholderTextColor={theme.colors.textLight}
            value={vehicleNo}
            onChangeText={setVehicleNo}
            autoCapitalize="characters"
          />

          <Text style={[styles.label, { color: theme.colors.textLight }]}>Coal Type</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={coalType}
            onChangeText={setCoalType}
          />

          <Text style={[styles.label, { color: theme.colors.textLight }]}>Quality / Grade</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={qualityGrade}
            onChangeText={setQualityGrade}
          />

          <Text style={[styles.label, { color: theme.colors.textLight }]}>Quantity (Metric Tonnes)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="e.g. 32.5"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="decimal-pad"
            value={quantityTonnes}
            onChangeText={setQuantityTonnes}
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Generate Digital Pass & QR Code</Text>
            )}
          </TouchableOpacity>
        </View>

        {createdConsignment && (
          <View style={[styles.qrContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
            <Text style={[styles.qrTitle, { color: theme.colors.text }]}>Digital Dispatch QR Pass</Text>
            <Text style={[styles.qrSubtitle, { color: theme.colors.textLight }]}>
              Code: {createdConsignment.consignment_code}
            </Text>

            <View style={styles.qrWrapper}>
              <QRCode
                value={createdConsignment.consignment_code}
                size={180}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: theme.colors.textLight }]}>Vehicle:</Text>
              <Text style={[styles.metaVal, { color: theme.colors.text }]}>{createdConsignment.vehicle_no}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: theme.colors.textLight }]}>Quantity:</Text>
              <Text style={[styles.metaVal, { color: theme.colors.text }]}>{createdConsignment.quantity_tonnes} Tonnes</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: theme.colors.textLight }]}>Status:</Text>
              <Text style={[styles.statusBadge, { color: theme.colors.success }]}>REGISTERED / READY</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 12,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  badgeText: { fontSize: 12, fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  readOnlyBox: { borderWidth: 1, borderRadius: 8, padding: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  qrContainer: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  qrTitle: { fontSize: 18, fontWeight: '700' },
  qrSubtitle: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  qrWrapper: { padding: 14, backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 4 },
  metaLabel: { fontSize: 14, fontWeight: '500' },
  metaVal: { fontSize: 14, fontWeight: '700' },
  statusBadge: { fontSize: 13, fontWeight: '800' }
});
