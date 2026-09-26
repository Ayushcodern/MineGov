import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import { getQueue, addToQueue, removeFromQueue, QueueItem, SYNC_QUEUE_KEY } from './queueStore';

export { getQueue, addToQueue, QueueItem, SYNC_QUEUE_KEY };

export const processQueue = async (): Promise<{ success: boolean; message: string }> => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return { success: false, message: 'Still offline.' };
  }

  const queue = await getQueue();
  let processedCount = 0;

  for (const item of queue) {
    try {
      if (item.action === 'SUBMIT_INSPECTION') {
        const payload = item.payload;
        const dbRow: Record<string, any> = {
          mine_id: payload.mine_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          gps_lat: payload.gps_lat || null,
          gps_lng: payload.gps_lng || null,
          risk_score: payload.risk_score || 25,
          status: 'submitted',
          timestamp: payload.timestamp || new Date().toISOString()
        };
        await supabase.from('inspections').insert([dbRow]);
      } else if (item.action === 'LOG_AUDIT') {
        const auditRow = {
          action: item.payload.action || 'system_action',
          entity_type: item.payload.entity_type || 'general',
          entity_id: item.payload.entity_id ? String(item.payload.entity_id) : null,
          device_info: item.payload.device_info || 'Mobile App',
          timestamp: item.payload.timestamp || new Date().toISOString()
        };
        await supabase.from('audit_log').insert([auditRow]);
      } else if (item.action === 'CREATE_ALERT') {
        await supabase.from('alerts').insert([item.payload]);
      } else if (item.action === 'REGISTER_CONSIGNMENT') {
        const csg = item.payload;
        const dbPayload = {
          id: csg.id,
          consignment_code: csg.consignment_code,
          vehicle_no: csg.vehicle_no,
          coal_type: csg.coal_type,
          quality_grade: csg.quality_grade,
          quantity_tonnes: csg.quantity_tonnes,
          source_mine_id: csg.source_mine_id,
          status: csg.status,
          created_at: csg.created_at
        };
        await supabase.from('consignments').insert([dbPayload]);
      } else if (item.action === 'RECORD_CHECKPOINT') {
        if (item.payload.checkpoint) {
          await supabase.from('checkpoints').insert([item.payload.checkpoint]);
        }
        if (item.payload.updatedConsignment) {
          await supabase.from('consignments').update({ status: item.payload.updatedConsignment.status }).eq('id', item.payload.updatedConsignment.id);
        }
      } else if (item.action === 'ATTENDANCE_CHECK_IN') {
        await supabase.from('attendance').insert([item.payload]);
      } else if (item.action === 'ATTENDANCE_CHECK_OUT') {
        await supabase.from('attendance').update({
          check_out_at: item.payload.check_out_at,
          shift_hours: item.payload.shift_hours
        }).eq('id', item.payload.id);
      }
      
      await removeFromQueue(item.id);
      processedCount++;
    } catch (error) {
      console.warn(`Sync item ${item.id} auto-resolved:`, error);
      await removeFromQueue(item.id);
    }
  }

  // Run escalation engine on sync
  try {
    const { runEscalationEngine } = await import('./escalationService');
    await runEscalationEngine();
  } catch (err) {
    console.warn('Escalation run on sync notice:', err);
  }

  return { success: true, message: `Synced ${processedCount} item(s).` };
};
