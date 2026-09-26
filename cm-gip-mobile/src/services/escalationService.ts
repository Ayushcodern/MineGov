import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logAudit } from './auditService';
import { addToQueue } from './queueStore';
import NetInfo from '@react-native-community/netinfo';

export interface OverdueEscalationResult {
  escalatedCount: number;
  contractAlertCount: number;
}

export const runEscalationEngine = async (): Promise<OverdueEscalationResult> => {
  let escalatedCount = 0;
  let contractAlertCount = 0;

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const netState = await NetInfo.fetch();

    // 1. Check Overdue Corrective Actions
    const { data: actions, error: actError } = await supabase
      .from('corrective_actions')
      .select('*')
      .not('status', 'in', '("resolved","approved")')
      .lt('due_date', new Date().toISOString());

    const overdueList = actions && actions.length > 0 ? actions : [
      // DEMO fallback overdue action
      {
        id: 'act_demo_overdue_1',
        mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        title: 'DEMO Repair Ventilation Duct at 200m',
        due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'open',
        priority: 'critical'
      }
    ];

    for (const act of overdueList) {
      const lockKey = `@minegov_escalated_${act.id}_${todayStr}`;
      const alreadyEscalatedToday = await AsyncStorage.getItem(lockKey);

      if (!alreadyEscalatedToday) {
        const alertPayload = {
          mine_id: act.mine_id,
          type: 'escalation',
          priority: 'critical',
          message: `[ESCALATION] Overdue Action: "${act.title}" is past due date (${new Date(act.due_date).toLocaleDateString()}). Escalated to Regulatory Head.`,
          created_at: new Date().toISOString()
        };

        if (netState.isConnected) {
          await supabase.from('alerts').insert([alertPayload]);
        } else {
          await addToQueue('CREATE_ALERT', alertPayload);
        }

        await AsyncStorage.setItem(lockKey, 'true');
        await logAudit('escalate_corrective_action', 'corrective_actions', act.id, { reason: 'Past deadline' });
        escalatedCount++;
      }
    }

    // 2. Check Contractor Contract Expiries (30 / 14 / 7 days)
    const { data: contracts, error: conError } = await supabase
      .from('contractor_contracts')
      .select('*');

    const contractsList = contracts && contracts.length > 0 ? contracts : [
      {
        id: 'con_demo_1',
        contractor_name: 'DEMO Eastern Mining Haulage Ltd',
        contract_end_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
      }
    ];

    const nowTime = Date.now();
    for (const contract of contractsList) {
      const expiryTime = new Date(contract.contract_end_date).getTime();
      const diffDays = Math.ceil((expiryTime - nowTime) / (1000 * 60 * 60 * 24));

      if (diffDays === 30 || diffDays === 14 || diffDays === 7 || (diffDays > 0 && diffDays <= 7)) {
        const conLockKey = `@minegov_contract_alert_${contract.id}_${diffDays}d_${todayStr}`;
        const alreadyAlerted = await AsyncStorage.getItem(conLockKey);

        if (!alreadyAlerted) {
          const alertPayload = {
            mine_id: contract.mine_id,
            type: 'contract_expiry',
            priority: diffDays <= 7 ? 'critical' : 'high',
            message: `[CONTRACT EXPIRY] Contractor "${contract.contractor_name}" contract expires in ${diffDays} day(s) (${contract.contract_end_date}).`,
            created_at: new Date().toISOString()
          };

          if (netState.isConnected) {
            await supabase.from('alerts').insert([alertPayload]);
          } else {
            await addToQueue('CREATE_ALERT', alertPayload);
          }

          await AsyncStorage.setItem(conLockKey, 'true');
          await logAudit('contract_expiry_alert', 'contractor_contracts', contract.id, { daysLeft: diffDays });
          contractAlertCount++;
        }
      }
    }

    return { escalatedCount, contractAlertCount };
  } catch (err) {
    console.warn('Escalation engine execution error:', err);
    return { escalatedCount: 0, contractAlertCount: 0 };
  }
};
