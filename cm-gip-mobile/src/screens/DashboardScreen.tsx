import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KPICard from '../components/KPICard';
import TaskCard from '../components/TaskCard';
import { useAppTheme } from '../context/ThemeContext';
import { useAppLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { getUserTasks } from '../services/taskService';
import { aiService } from '../services/aiService';
import { getCurrentOfficer, OfficerProfile } from '../services/authService';
import { calculateSustainabilityScore, detectStatisticalAnomalies } from '../services/complianceService';
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryBar } from 'victory-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen({ navigation, route }: any) {
  const { theme, isDarkMode } = useAppTheme() as any;
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useAppLanguage();
  const [officer, setOfficer] = useState<OfficerProfile | null>(route?.params?.officer || null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [complianceRate, setComplianceRate] = useState('94%');
  const [predictedRisks, setPredictedRisks] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const sustainabilityData = calculateSustainabilityScore({
    safety: 92,
    compliance: 88,
    environmental: 81,
    welfare: 85
  });

  const anomalyFlags = detectStatisticalAnomalies();

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  const loadData = async () => {
    try {
      const current = await getCurrentOfficer();
      setOfficer(current);

      const fetchedTasks = await getUserTasks(current.id);
      setTasks(fetchedTasks || []);
      
      const riskPredictions = await aiService.predictRisks();
      setPredictedRisks(riskPredictions.predictedIncidents || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const recentDeadlines = pendingTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3);

  const userRole = officer?.role || 'field_inspector';
  const isReadOnlyRole = userRole === 'corporate' || userRole === 'regulator';

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const reportPayload = {
        title: 'MineGOV Regulatory Compliance & Safety Audit Summary',
        generatedAt: new Date().toISOString(),
        officer: officer?.name || 'Officer',
        role: userRole,
        complianceRate: '94%',
        sustainabilityScore: sustainabilityData.score,
        sustainabilityGrade: 'Grade A - High Sustainability',
        activeMines: [
          { name: 'DEMO Dhanbad Colliery Block-B', riskScore: 28, status: 'Active - Compliant' },
          { name: 'DEMO Gevra OpenCast Mine', riskScore: 42, status: 'Active - Monitored' },
          { name: 'DEMO Singareni Underground Shaft 3', riskScore: 18, status: 'Active - High Standard' }
        ],
        ruleAnomalies: anomalyFlags
      };

      const baseDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
      const fileUri = `${baseDir}MineGOV_Regulatory_Report_${Date.now()}.json`;
      await (FileSystem as any).writeAsStringAsync(fileUri, JSON.stringify(reportPayload, null, 2), {
        encoding: (FileSystem as any).EncodingType?.UTF8 || 'utf8'
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export MineGOV Regulatory Report'
        });
      } else {
        Alert.alert('Report Generated', `Saved locally at: ${fileUri}`);
      }
    } catch (err: any) {
      Alert.alert('Export Error', err.message || 'Could not export report');
    } finally {
      setIsExporting(false);
    }
  };

  // Mine Risk Heat Grid Data
  const heatMapData = [
    { x: 'Dhanbad', y: 28, fill: '#48BB78' },
    { x: 'Gevra', y: 64, fill: '#ED8936' },
    { x: 'Singareni', y: 18, fill: '#38A169' },
    { x: 'Korba-East', y: 82, fill: '#F56565' },
    { x: 'Raniganj', y: 45, fill: '#ECC94B' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Header with Language Switcher */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.welcomeText, { color: theme.colors.textLight }]}>{t('welcome')}</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {officer?.name || 'Officer'}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.roleBadgeText, { color: theme.colors.primary }]}>
                {userRole.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleLanguage} style={[styles.langToggleBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Ionicons name="language" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 12 }}>
                {currentLanguage === 'hi' ? 'EN' : 'हिन्दी'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.colors.card, marginLeft: 8 }]} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {isReadOnlyRole && (
          <View style={[styles.readOnlyNotice, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EBF8FF' }]}>
            <Ionicons name="information-circle" size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.readOnlyNoticeText, { color: theme.colors.primary }]}>
              {userRole === 'regulator' 
                ? 'DGMS Statutory Oversight Mode • Read-Only Compliance Tracking'
                : 'Executive ESG Oversight Mode • Read-Only Enterprise Analytics'}
            </Text>
          </View>
        )}

        {/* ROLE-SPECIFIC WORKSPACE HERO CARDS */}
        {userRole === 'field_inspector' && (
          <View style={[styles.roleHeroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroBadge, { color: theme.colors.primary }]}>⚡ ACTIVE INSPECTION DUTY</Text>
                <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Mine Site Safety Audit</Text>
                <Text style={[styles.heroDesc, { color: theme.colors.textLight }]}>
                  GPS geofencing locked • 20 CMR safety checklist items ready
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.heroCtaBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('InspectionFlow')}
            >
              <Ionicons name="clipboard" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.heroCtaText}>{t('start_inspection')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {userRole === 'compliance_officer' && (
          <View style={[styles.roleHeroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.warning }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroBadge, { color: theme.colors.warning }]}>🛡️ COMPLIANCE & AUDIT DESK</Text>
                <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Inspection Review Queue</Text>
                <Text style={[styles.heroDesc, { color: theme.colors.textLight }]}>
                  Pending safety endorsements & CMR 2017 PPT rule matching
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.heroCtaBtn, { backgroundColor: theme.colors.warning }]}
              onPress={() => navigation.navigate('Review')}
            >
              <Ionicons name="shield-checkmark" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.heroCtaText}>{t('review_reports')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {userRole === 'mining_official' && (
          <View style={[styles.roleHeroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.success }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroBadge, { color: theme.colors.success }]}>⛏️ MINE OPERATIONS DESK</Text>
                <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Dispatch & Shift Operations</Text>
                <Text style={[styles.heroDesc, { color: theme.colors.textLight }]}>
                  Weighbridge QR validation & Biometric shift attendance active
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity 
                style={[styles.heroSubBtn, { backgroundColor: theme.colors.success, flex: 1, marginRight: 6 }]}
                onPress={() => navigation.navigate('CheckpointScan')}
              >
                <Ionicons name="qr-code" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.heroCtaText}>Weighbridge QR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.heroSubBtn, { backgroundColor: theme.colors.primary, flex: 1, marginLeft: 6 }]}
                onPress={() => navigation.navigate('Attendance')}
              >
                <Ionicons name="people" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.heroCtaText}>Labour Shift</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {userRole === 'regulator' && (
          <View style={[styles.roleHeroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.danger }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroBadge, { color: theme.colors.danger }]}>🏛️ DGMS STATUTORY REGULATORY DESK</Text>
              <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Regulatory Violation Tracking</Text>
              <Text style={[styles.heroDesc, { color: theme.colors.textLight }]}>
                Enforcement notices, safety orders & statutory compliance audits
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.heroCtaBtn, { backgroundColor: theme.colors.danger }]}
              onPress={handleExportReport}
              disabled={isExporting}
            >
              {isExporting ? <ActivityIndicator color="#FFF" /> : (
                <>
                  <Ionicons name="document-text" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.heroCtaText}>{t('export_report')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {userRole === 'corporate' && (
          <View style={[styles.roleHeroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroBadge, { color: theme.colors.primary }]}>📊 ENTERPRISE ESG GOVERNANCE</Text>
              <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Multi-Mine ESG Analytics</Text>
              <Text style={[styles.heroDesc, { color: theme.colors.textLight }]}>
                Executive scorecard, sustainability ratings and production risk correlation
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.heroCtaBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleExportReport}
              disabled={isExporting}
            >
              {isExporting ? <ActivityIndicator color="#FFF" /> : (
                <>
                  <Ionicons name="cloud-download-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.heroCtaText}>{t('export_report')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Governance Overview KPIs */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 14 }]}>{t('overview')}</Text>
        <View style={styles.kpiContainer}>
          <KPICard value={complianceRate} label={t('compliance_rate')} trend="+2%" colorType="primary" />
          <KPICard value={pendingTasks.length} label={t('pending_tasks')} trend="-1" colorType="warning" />
        </View>

        {/* Clean Mine Sustainability Scorecard (No formula, clean score & grade) */}
        <View style={[styles.sustainabilityCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <View style={styles.sustHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="leaf" size={24} color={theme.colors.success} style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.sustTitle, { color: theme.colors.text }]}>{t('sustainability_score')}</Text>
                <Text style={[styles.sustStatus, { color: theme.colors.success }]}>{t('sustainability_status')}</Text>
              </View>
            </View>
            <View style={[styles.scorePill, { backgroundColor: theme.colors.success + '20' }]}>
              <Text style={[styles.scoreText, { color: theme.colors.success }]}>{sustainabilityData.score} / 100</Text>
            </View>
          </View>

          <View style={styles.breakdownGrid}>
            <View style={[styles.metricPill, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.textLight }]}>Safety</Text>
              <Text style={[styles.metricVal, { color: theme.colors.text }]}>92%</Text>
            </View>
            <View style={[styles.metricPill, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.textLight }]}>Compliance</Text>
              <Text style={[styles.metricVal, { color: theme.colors.text }]}>88%</Text>
            </View>
            <View style={[styles.metricPill, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.textLight }]}>Environment</Text>
              <Text style={[styles.metricVal, { color: theme.colors.text }]}>81%</Text>
            </View>
            <View style={[styles.metricPill, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.textLight }]}>Welfare</Text>
              <Text style={[styles.metricVal, { color: theme.colors.text }]}>85%</Text>
            </View>
          </View>
        </View>

        {/* Mine Risk Heat Map Grid */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 14 }]}>{t('risk_heatmap')}</Text>
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.card, shadowColor: theme.colors.border }]}>
          <VictoryChart height={190} padding={{ top: 20, bottom: 40, left: 40, right: 20 }} theme={VictoryTheme.material}>
            <VictoryAxis dependentAxis tickFormat={(val) => `${val}%`} style={{ tickLabels: { fill: theme.colors.textLight, fontSize: 10 } }} />
            <VictoryAxis style={{ tickLabels: { fill: theme.colors.text, fontSize: 10, fontWeight: 'bold' } }} />
            <VictoryBar
              data={heatMapData}
              style={{
                data: {
                  fill: ({ datum }) => datum.fill,
                  width: 24
                }
              }}
              cornerRadius={{ top: 6 }}
              animate={{ duration: 800 }}
            />
          </VictoryChart>
        </View>

        {/* Safety Rule Deviations & Violation Alerts (Plain Language) */}
        <View style={{ marginTop: 14, marginBottom: 6 }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 2 }]}>
            {t('rule_violations_title')}
          </Text>
          <Text style={[styles.subDesc, { color: theme.colors.textLight }]}>
            {t('rule_violations_desc')}
          </Text>
        </View>
        {anomalyFlags.map((flag, idx) => (
          <View key={idx} style={[styles.anomalyCard, { backgroundColor: theme.colors.card, borderColor: flag.severity === 'critical' ? theme.colors.danger : theme.colors.warning }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.anomalyMine, { color: theme.colors.text }]}>{flag.mineName}</Text>
              <View style={[styles.rulePill, { backgroundColor: theme.colors.primary }]}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{flag.ruleId}</Text>
              </View>
            </View>
            <Text style={[styles.anomalyMsg, { color: theme.colors.textLight }]}>{flag.message}</Text>
            <Text style={{ color: theme.colors.danger, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
              CMR Safety Flag: Incident frequency exceeds historical baseline
            </Text>
          </View>
        ))}

        {/* AI Risk Predictions */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 18 }]}>
          {t('ai_risk_predictions')}
        </Text>
        {predictedRisks.length > 0 ? (
          predictedRisks.map((risk, idx) => (
            <View key={idx} style={[styles.riskCard, { backgroundColor: theme.colors.card, borderLeftColor: risk.probability > 70 ? theme.colors.danger : theme.colors.warning }]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[styles.riskTitle, { color: theme.colors.text }]}>{risk.type}</Text>
                <Text style={{color: risk.probability > 70 ? theme.colors.danger : theme.colors.warning, fontWeight: 'bold'}}>{risk.probability}% Risk</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Ionicons name="location" size={14} color={theme.colors.textLight} style={{ marginRight: 4 }} />
                <Text style={{ color: theme.colors.textLight, fontSize: 13 }}>{risk.location}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="time" size={14} color={theme.colors.textLight} style={{ marginRight: 4 }} />
                <Text style={{ color: theme.colors.textLight, fontSize: 13 }}>{risk.timeframe}</Text>
              </View>
            </View>
          ))
        ) : (
          <ActivityIndicator color={theme.colors.primary} style={{marginTop: 10}} />
        )}

        {/* Quick Operational Modules */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 18 }]}>{t('quick_actions')}</Text>
        <View style={styles.quickGrid}>
          {userRole !== 'contractor' && (
            <TouchableOpacity 
              style={[styles.gridAction, { backgroundColor: theme.colors.card }]} 
              onPress={() => navigation.navigate('InspectionFlow')}
            >
              <Ionicons name="clipboard-outline" size={26} color={theme.colors.primary} />
              <Text style={[styles.gridText, { color: theme.colors.text }]}>{t('inspection')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.gridAction, { backgroundColor: theme.colors.card }]} 
            onPress={() => navigation.navigate('CheckpointScan')}
          >
            <Ionicons name="qr-code-outline" size={26} color={theme.colors.primary} />
            <Text style={[styles.gridText, { color: theme.colors.text }]}>{t('coal_transport')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridAction, { backgroundColor: theme.colors.card }]} 
            onPress={() => navigation.navigate('Attendance')}
          >
            <Ionicons name="people-outline" size={26} color={theme.colors.primary} />
            <Text style={[styles.gridText, { color: theme.colors.text }]}>{t('labour_attendance')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridAction, { backgroundColor: theme.colors.card }]} 
            onPress={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <>
                <Ionicons name="share-social-outline" size={26} color={theme.colors.success} />
                <Text style={[styles.gridText, { color: theme.colors.text }]}>{t('export_report')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Upcoming Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Actionable Deadlines</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>View All ({pendingTasks.length})</Text>
          </TouchableOpacity>
        </View>

        {recentDeadlines.length === 0 ? (
          <Text style={{color: theme.colors.textLight, marginTop: 8}}>No pending tasks!</Text>
        ) : (
          recentDeadlines.map(task => (
            <TaskCard key={task.id} task={task} onPress={() => {
              if (userRole !== 'contractor') {
                navigation.navigate('InspectionFlow');
              }
            }} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  welcomeText: { fontSize: 13 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  roleBadgeText: { fontSize: 11, fontWeight: '800' },
  langToggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  profileButton: { borderRadius: 20 },
  readOnlyNotice: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, marginBottom: 14 },
  readOnlyNoticeText: { fontSize: 12, fontWeight: '700' },
  roleHeroCard: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 16 },
  heroBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 3 },
  heroDesc: { fontSize: 12, marginTop: 2 },
  heroCtaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 8, marginTop: 12 },
  heroSubBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  heroCtaText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  subDesc: { fontSize: 12, marginBottom: 10 },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sustainabilityCard: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  sustHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sustTitle: { fontSize: 15, fontWeight: '700' },
  sustStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  scorePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  scoreText: { fontSize: 14, fontWeight: '800' },
  breakdownGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  metricPill: { flex: 1, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  metricLabel: { fontSize: 10, fontWeight: '600' },
  metricVal: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  chartContainer: { borderRadius: 12, padding: 8, alignItems: 'center', elevation: 2, overflow: 'hidden', marginBottom: 16 },
  anomalyCard: { borderRadius: 10, borderWidth: 1.5, padding: 12, marginBottom: 8 },
  anomalyMine: { fontSize: 14, fontWeight: '700' },
  rulePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  anomalyMsg: { fontSize: 12, marginTop: 4 },
  riskCard: { padding: 14, borderRadius: 10, borderLeftWidth: 4, marginBottom: 10, elevation: 1 },
  riskTitle: { fontSize: 15, fontWeight: 'bold' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  gridAction: { width: '48%', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 10, elevation: 2 },
  gridText: { fontSize: 13, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAllText: { fontSize: 13, fontWeight: '600' }
});
