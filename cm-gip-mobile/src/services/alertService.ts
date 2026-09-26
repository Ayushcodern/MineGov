import { supabase } from '../config/supabaseClient';
import { logAudit } from './auditService';
import { getCurrentOfficer } from './authService';

export interface MineGovAlert {
  id: string;
  mine_id?: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  read?: boolean;
}

export const getAlerts = async (userId?: string): Promise<MineGovAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Default DEMO safety and escalation alerts
      return [
        {
          id: 'alert_demo_esc_1',
          type: 'escalation',
          priority: 'critical',
          message: '[ESCALATION] Overdue Action: "DEMO Repair Ventilation Duct at 200m" is past due date. Escalated to Regulatory Head.',
          created_at: new Date().toISOString(),
          read: false
        },
        {
          id: 'alert_demo_con_1',
          type: 'contract_expiry',
          priority: 'critical',
          message: '[CONTRACT EXPIRY] Contractor "DEMO Eastern Mining Haulage Ltd" contract expires in 7 day(s).',
          created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          read: false
        },
        {
          id: 'alert_demo_gas_1',
          type: 'gas_leak',
          priority: 'critical',
          message: '[GAS-001] Sensor Node #4: Elevated Methane Level (0.82%) detected in Shaft 2.',
          created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
          read: true
        }
      ];
    }
    
    return data.map(item => ({
      ...item,
      read: Boolean(item.acknowledged_at)
    }));
  } catch (error) {
    return [
      {
        id: 'alert_demo_esc_1',
        type: 'escalation',
        priority: 'critical',
        message: '[ESCALATION] Overdue Action: "DEMO Repair Ventilation Duct at 200m" is past due date. Escalated to Regulatory Head.',
        created_at: new Date().toISOString(),
        read: false
      }
    ];
  }
};

export const markAlertAsRead = async (alertId: string): Promise<void> => {
  try {
    const officer = await getCurrentOfficer();
    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from('alerts')
      .update({
        acknowledged_by: officer.id,
        acknowledged_at: timestamp
      })
      .eq('id', alertId);

    if (error) {
      console.log('Supabase alert ack notice:', error.message);
    }
    await logAudit('ack_alert', 'alerts', alertId, { acknowledged_by: officer.name });
  } catch (error) {
    console.warn('Alert ack error:', error);
  }
};
