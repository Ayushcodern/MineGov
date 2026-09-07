import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { getPendingReviews, updateInspectionStatus } from '../services/complianceService';

export default function ComplianceReviewScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const pending = await getPendingReviews();
        setReviews(pending);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleAction = async (id, status) => {
    setProcessingId(id);
    try {
      const hash = await updateInspectionStatus(id, status);
      Alert.alert('Success', `${status === 'approved' ? 'Approved' : 'Rejected'}\nBlockchain Hash: ${hash.substring(0, 16)}...`, [
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Manager Review</Text>
        <View style={{width: 28}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.reportCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(237, 137, 54, 0.1)' }]}>
            <Text style={[styles.statusText, { color: theme.colors.warning }]}>Pending Approval</Text>
          </View>
          
          <Text style={[styles.reportTitle, { color: theme.colors.text }]}>Inspection ID: {review.id}</Text>
          <Text style={[styles.reportMeta, { color: theme.colors.textLight }]}>Date: {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Today'}</Text>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Geospatial Data</Text>
          <Text style={[styles.dataText, { color: theme.colors.text }]}>
            Lat: {review.location?.latitude || '23.7957'}, Lng: {review.location?.longitude || '86.4304'}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Observations</Text>
          {review.observations && review.observations.length > 0 ? (
            review.observations.map((obs, idx) => (
              <View key={idx} style={[styles.anomalyBox, { backgroundColor: 'rgba(245, 101, 101, 0.1)', borderColor: theme.colors.danger }]}>
                <Ionicons name="warning" size={20} color={theme.colors.danger} />
                <Text style={[styles.anomalyText, { color: theme.colors.danger }]}>{obs.text}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.dataText, { color: theme.colors.success }]}>No issues found.</Text>
          )}
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectBtn, { borderColor: theme.colors.danger }]} 
          onPress={() => handleAction(review.id, 'rejected')}
          disabled={processingId !== null}
        >
          <Text style={[styles.rejectText, { color: theme.colors.danger }]}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.success }]} 
          onPress={() => handleAction(review.id, 'approved')}
          disabled={processingId !== null}
        >
          {processingId === review.id ? <ActivityIndicator color="#FFF" /> : <Text style={styles.approveText}>Approve & Sign</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  reportCard: { borderRadius: 12, padding: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  reportTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  reportMeta: { fontSize: 14, marginBottom: 4 },
  divider: { height: 1, marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  dataText: { fontSize: 15 },
  anomalyBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  anomalyText: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
  footer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, justifyContent: 'space-between' },
  actionButton: { width: '48%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { backgroundColor: 'transparent', borderWidth: 2 },
  rejectText: { fontSize: 16, fontWeight: 'bold' },
  approveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
