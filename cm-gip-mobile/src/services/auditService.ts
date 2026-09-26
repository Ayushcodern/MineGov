import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue } from './queueStore';

export interface AuditLogEntry {
  id?: string;
  user_id?: string | null;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: string | null;
  device_info?: string;
  timestamp?: string;
}

export const logAudit = async (
  action: string,
  entityType: string,
  entityId: string | null = null,
  details: any = null
): Promise<boolean> => {
  try {
    const cachedUser = await AsyncStorage.getItem('@minegov_current_officer');
    const officer = cachedUser ? JSON.parse(cachedUser) : null;
    const rawUserId = officer?.user_id || null;
    
    // Only pass valid UUIDs
    const isUuid = (val: any) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const userId = isUuid(rawUserId) ? rawUserId : null;
    const validEntityId = isUuid(entityId) ? entityId : null;
    const actorName = officer?.name || 'Officer';

    let devInfo = `React Native / ${actorName}`;
    if (details) {
      const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details);
      devInfo += ` | ${detailsStr}`;
    }

    const entry: Record<string, any> = {
      action,
      entity_type: entityType,
      device_info: devInfo,
      timestamp: new Date().toISOString()
    };

    if (userId) entry.user_id = userId;
    if (validEntityId) entry.entity_id = validEntityId;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      await addToQueue('LOG_AUDIT', entry);
      return true;
    }

    const { error } = await supabase.from('audit_log').insert([entry]);
    if (error) {
      await addToQueue('LOG_AUDIT', entry);
    }
    return true;
  } catch (err) {
    return false;
  }
};
