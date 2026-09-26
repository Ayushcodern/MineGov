import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue } from './queueStore';
import { logAudit } from './auditService';
import { getCurrentOfficer } from './authService';

export interface AttendanceRecord {
  id: string;
  mine_id: string;
  mine_name?: string;
  worker_id: string;
  worker_name: string;
  check_in_at: string;
  check_out_at: string | null;
  shift_hours: number | null;
  method: 'qr' | 'manual' | 'biometric';
  created_at: string;
}

export interface DemoWorker {
  worker_id: string;
  worker_name: string;
  designation: string;
  shift: string;
}

export const DEMO_WORKERS: DemoWorker[] = [
  { worker_id: 'WRK-1001', worker_name: 'Ramesh Kumar', designation: 'Shaft Miner', shift: 'Morning Shift' },
  { worker_id: 'WRK-1002', worker_name: 'Sunita Devi', designation: 'Safety Spotter', shift: 'Morning Shift' },
  { worker_id: 'WRK-1003', worker_name: 'Anil Soren', designation: 'Dumper Operator', shift: 'Afternoon Shift' },
  { worker_id: 'WRK-1004', worker_name: 'Rajesh Bauri', designation: 'Drill Operator', shift: 'Morning Shift' }
];

const LOCAL_ATTENDANCE_KEY = '@minegov_local_attendance';

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_ATTENDANCE_KEY);
    const local: AttendanceRecord[] = raw ? JSON.parse(raw) : [];

    try {
      const { data, error } = await supabase.from('attendance').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (_) {}

    if (local.length > 0) return local;

    // Default Indian attendance records
    const initialDemo: AttendanceRecord[] = [
      {
        id: 'att_demo_1',
        mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        mine_name: 'Dhanbad Colliery Block-B',
        worker_id: 'WRK-1001',
        worker_name: 'Ramesh Kumar',
        check_in_at: new Date(Date.now() - 3600000 * 9).toISOString(),
        check_out_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        shift_hours: 8.0,
        method: 'qr',
        created_at: new Date(Date.now() - 3600000 * 9).toISOString()
      },
      {
        id: 'att_demo_2',
        mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        mine_name: 'Dhanbad Colliery Block-B',
        worker_id: 'WRK-1002',
        worker_name: 'Sunita Devi',
        check_in_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        check_out_at: null,
        shift_hours: null,
        method: 'qr',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ];

    await AsyncStorage.setItem(LOCAL_ATTENDANCE_KEY, JSON.stringify(initialDemo));
    return initialDemo;
  } catch (err) {
    return [];
  }
};

export const recordWorkerCheckInOut = async (workerId: string, customWorkerName?: string): Promise<{
  action: 'check_in' | 'check_out';
  record: AttendanceRecord;
  alertGenerated?: string;
}> => {
  const officer = await getCurrentOfficer();
  const knownWorker = DEMO_WORKERS.find(w => w.worker_id === workerId.trim());
  const workerName = knownWorker?.worker_name || customWorkerName || `Worker (${workerId})`;
  
  const records = await getAttendanceRecords();
  const openRecord = records.find(r => r.worker_id === workerId.trim() && !r.check_out_at);

  const netState = await NetInfo.fetch();

  if (!openRecord) {
    // Check-in
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      mine_id: officer.assigned_mine_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      mine_name: 'Dhanbad Colliery Block-B',
      worker_id: workerId.trim(),
      worker_name: workerName,
      check_in_at: new Date().toISOString(),
      check_out_at: null,
      shift_hours: null,
      method: 'qr',
      created_at: new Date().toISOString()
    };

    const updatedList = [newRecord, ...records];
    await AsyncStorage.setItem(LOCAL_ATTENDANCE_KEY, JSON.stringify(updatedList));

    if (!netState.isConnected) {
      await addToQueue('ATTENDANCE_CHECK_IN', newRecord);
    } else {
      try {
        const { error } = await supabase.from('attendance').insert([newRecord]);
        if (error) await addToQueue('ATTENDANCE_CHECK_IN', newRecord);
      } catch (_) {
        await addToQueue('ATTENDANCE_CHECK_IN', newRecord);
      }
    }

    await logAudit('attendance_check_in', 'attendance', newRecord.id, { worker_id: workerId, name: workerName });
    return { action: 'check_in', record: newRecord };
  } else {
    // Check-out
    const checkOutTime = new Date();
    const checkInTime = new Date(openRecord.check_in_at);
    const diffHours = Math.round(((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)) * 10) / 10;
    
    // Rule hook: missing check-out or shift < 8h -> alert
    let alertGenerated: string | undefined;
    if (diffHours < 8.0) {
      const alertMsg = `[LABOUR RULE VIOLATION] Worker "${workerName}" completed a short shift of ${diffHours} hrs (Mandatory minimum: 8.0 hrs under Mines Act 1952).`;
      alertGenerated = alertMsg;

      const alertPayload = {
        mine_id: openRecord.mine_id,
        type: 'short_shift_violation',
        priority: 'high',
        message: alertMsg,
        created_at: new Date().toISOString()
      };

      if (netState.isConnected) {
        try {
          const { error } = await supabase.from('alerts').insert([alertPayload]);
          if (error) await addToQueue('CREATE_ALERT', alertPayload);
        } catch (_) {
          await addToQueue('CREATE_ALERT', alertPayload);
        }
      } else {
        await addToQueue('CREATE_ALERT', alertPayload);
      }
    }

    const updatedRecord: AttendanceRecord = {
      ...openRecord,
      check_out_at: checkOutTime.toISOString(),
      shift_hours: diffHours
    };

    const updatedList = records.map(r => r.id === openRecord.id ? updatedRecord : r);
    await AsyncStorage.setItem(LOCAL_ATTENDANCE_KEY, JSON.stringify(updatedList));

    if (!netState.isConnected) {
      await addToQueue('ATTENDANCE_CHECK_OUT', updatedRecord);
    } else {
      try {
        const { error } = await supabase.from('attendance').update({
          check_out_at: updatedRecord.check_out_at,
          shift_hours: updatedRecord.shift_hours
        }).eq('id', openRecord.id);
        if (error) await addToQueue('ATTENDANCE_CHECK_OUT', updatedRecord);
      } catch (_) {
        await addToQueue('ATTENDANCE_CHECK_OUT', updatedRecord);
      }
    }

    await logAudit('attendance_check_out', 'attendance', openRecord.id, {
      shift_hours: diffHours,
      rule_alert: alertGenerated ? true : false
    });

    return { action: 'check_out', record: updatedRecord, alertGenerated };
  }
};
