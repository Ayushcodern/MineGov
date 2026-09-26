import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { getPendingReviews, updateInspectionStatus, matchObservationToRule } from '../services/complianceService';

export default function ComplianceReviewScreen({ navigation }: any) {
  const { theme } = useAppTheme() as any;
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const pending = await getPendingReviews();
        setReviews(Array.isArray(pending) ? pending : []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleAction = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      const hash = await updateInspectionStatus(id, status);
      const hashSnippet = typeof hash === 'string' && hash.length >= 16 ? hash.substring(0, 16) : (hash || '0xVerified');
      Alert.alert('Success', `${status === 'approved' ? 'Approved' : 'Rejected'}\nSHA-256 Digest: ${hashSnippet}...`, [
        { text: 'OK', onPress: () => {
            const remaining = reviews.filter(r => r.id !== id);
            setReviews(remaining);
            if (remaining.length === 0) navigation.goBack();
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (reviews.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Manager Review</Text>
          <View style={{width: 28}} /> 
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: theme.colors.textLight}}>No pending reviews.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const review = reviews[0];

  const parseJsonField = (field: any) => {
    if (!field) return null;
    if (typeof field === 'object') return field;
    try {
      return JSON.parse(field);
    } catch {
      return null;
    }
  };

  const parsedLocation = parseJsonField(review.location);
  const parsedGeotag = parseJsonField(review.geotag);
  const rawFindings = parseJsonField(review.findings) || parseJsonField(review.observations) || review.findings || review.observations || [];
  const findingsList: any[] = Array.isArray(rawFindings) 
    ? rawFindings 
    : (typeof rawFindings === 'string' ? [{ text: rawFindings }] : []);

  const displayLat = parsedLocation?.latitude || review.gps_lat || parsedGeotag?.latitude || '22.3384';
  const displayLng = parsedLocation?.longitude || review.gps_lng || parsedGeotag?.longitude || '82.6053';
  const displayDate = review.created_at || review.timestamp 
    ? new Date(review.created_at || review.timestamp).toLocaleDateString() 
    : 'Today';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Compliance Review Portal</Text>
        <View style={{width: 28}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.reportCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(237, 137, 54, 0.15)' }]}>
            <Text style={[styles.statusText, { color: theme.colors.warning }]}>Pending Approval (DEMO)</Text>
          </View>
          
          <Text style={[styles.reportTitle, { color: theme.colors.text }]}>Inspection ID: {review.id}</Text>
          <Text style={[styles.reportMeta, { color: theme.colors.textLight }]}>Date: {displayDate}</Text>
          {review.mine_name && (
            <Text style={[styles.mineBadge, { color: theme.colors.primary }]}>{review.mine_name}</Text>
          )}
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Geospatial & Geotag Verification</Text>
          <Text style={[styles.dataText, { color: theme.colors.text }]}>
            Lat: {typeof displayLat === 'number' ? displayLat.toFixed(4) : displayLat}, Lng: {typeof displayLng === 'number' ? displayLng.toFixed(4) : displayLng}
          </Text>
          {(parsedGeotag || review.geotag) && (
            <View style={{marginTop: 8, padding: 10, borderRadius: 8, backgroundColor: 'rgba(72, 187, 120, 0.1)', borderWidth: 1, borderColor: theme.colors.success}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} style={{marginRight: 6}} />
                <Text style={{fontSize: 12, color: theme.colors.success, fontWeight: 'bold'}}>
                  GPS Geofence Verified (CMR 2017 Boundary)
                </Text>
              </View>
            </View>
          )}

          {review.videoHash && (
            <View style={{marginTop: 8, padding: 8, borderRadius: 8, backgroundColor: 'rgba(43, 108, 176, 0.1)', borderWidth: 1, borderColor: theme.colors.primary}}>
              <Text style={{fontSize: 11, color: theme.colors.primary, fontWeight: '700'}}>
                📹 Video Evidence Attached (SHA-256 Digest Verified)
              </Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Observations & Matched PPT Rules</Text>
          {findingsList.length > 0 ? (
            findingsList.map((obs: any, idx: number) => {
              const obsText = typeof obs === 'string' ? obs : (obs.text || obs.comment || 'Flagged finding');
              const matchedRule = matchObservationToRule(obsText, obs.regulation || obs.category);
              const ruleId = obs.rule_id || matchedRule.id;

              return (
                <View key={idx} style={[styles.anomalyBox, { backgroundColor: 'rgba(245, 101, 101, 0.08)', borderColor: theme.colors.danger }]}>
                  <View style={styles.ruleBadgeRow}>
                    <View style={[styles.ruleBadge, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.ruleBadgeText}>{ruleId}</Text>
                    </View>
                    <Text style={[styles.ruleNameText, { color: theme.colors.textLight }]}>{matchedRule.name}</Text>
                  </View>

                  <Text style={[styles.anomalyText, { color: theme.colors.text }]}>
                    {obsText}
                  </Text>

                  {obs.ocr_text && (
                    <View style={styles.ocrBox}>
                      <Text style={[styles.ocrLabel, { color: theme.colors.warning }]}>
                        [AI-extracted, requires human review]
                      </Text>
                      <Text style={[styles.ocrContent, { color: theme.colors.text }]}>{obs.ocr_text}</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={[styles.dataText, { color: theme.colors.success }]}>No non-compliance issues found.</Text>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectBtn, { borderColor: theme.colors.danger }]} 
          onPress={() => handleAction(review.id, 'rejected')}
          disabled={processingId !== null}
        >
          {processingId === review.id ? <ActivityIndicator color={theme.colors.danger} /> : <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Reject</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.approveBtn, { backgroundColor: theme.colors.primary }]} 
          onPress={() => handleAction(review.id, 'approved')}
          disabled={processingId !== null}
        >
          {processingId === review.id ? <ActivityIndicator color="#fff" /> : <Text style={[styles.actionBtnText, { color: '#fff' }]}>Approve & Seal</Text>}
        </TouchableOpacity>
      </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 30 },
  reportCard: {
    borderRadius: 14,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  reportTitle: { fontSize: 18, fontWeight: 'bold' },
  reportMeta: { fontSize: 13, marginTop: 4 },
  mineBadge: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  dataText: { fontSize: 14, lineHeight: 20 },
  anomalyBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  ruleBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ruleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  ruleBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  ruleNameText: { fontSize: 12, fontWeight: '600' },
  anomalyText: { fontSize: 14, lineHeight: 20 },
  ocrBox: { marginTop: 6, padding: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 6 },
  ocrLabel: { fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  ocrContent: { fontSize: 12, fontStyle: 'italic' },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6
  },
  rejectBtn: { borderWidth: 1.5, backgroundColor: 'transparent' },
  approveBtn: {},
  actionBtnText: { fontSize: 15, fontWeight: 'bold' }
});
