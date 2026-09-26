import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue } from './syncService';
import { logAudit } from './auditService';
import { getCurrentOfficer } from './authService';

export interface Consignment {
  id: string;
  consignment_code: string;
  vehicle_no: string;
  coal_type: string;
  quality_grade: string;
  quantity_tonnes: number;
  source_mine_id: string;
  source_mine_name?: string;
  status: 'registered' | 'in_transit' | 'delivered' | 'flagged';
  created_at: string;
}

export interface CheckpointRecord {
  id: string;
  consignment_id: string;
  location: string;
  quantity_verified: number;
  vehicle_status: string;
  scanned_at: string;
  scanned_by?: string;
  mismatch_detected: boolean;
  notes?: string;
}

const LOCAL_CONSIGNMENTS_KEY = '@minegov_local_consignments';
const LOCAL_CHECKPOINTS_KEY = '@minegov_local_checkpoints';

export const registerConsignment = async (data: {
  vehicle_no: string;
  coal_type: string;
  quality_grade: string;
  quantity_tonnes: number;
  source_mine_id?: string;
  source_mine_name?: string;
}): Promise<Consignment> => {
  const officer = await getCurrentOfficer();
  const consignmentCode = `MINEGOV-COAL-${Date.now().toString().slice(-6)}`;
  const id = `csg_${Date.now()}`;

  const newConsignment: Consignment = {
    id,
    consignment_code: consignmentCode,
    vehicle_no: data.vehicle_no.toUpperCase().trim(),
    coal_type: data.coal_type,
    quality_grade: data.quality_grade,
    quantity_tonnes: Number(data.quantity_tonnes),
    source_mine_id: data.source_mine_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    source_mine_name: data.source_mine_name || 'DEMO Dhanbad Colliery Block-B',
    status: 'registered',
    created_at: new Date().toISOString()
  };

  // Cache locally
  const cached = await getConsignments();
  await AsyncStorage.setItem(LOCAL_CONSIGNMENTS_KEY, JSON.stringify([newConsignment, ...cached]));

  const netState = await NetInfo.fetch();
  const dbPayload = {
    id: newConsignment.id,
    consignment_code: newConsignment.consignment_code,
    vehicle_no: newConsignment.vehicle_no,
    coal_type: newConsignment.coal_type,
    quality_grade: newConsignment.quality_grade,
    quantity_tonnes: newConsignment.quantity_tonnes,
    source_mine_id: newConsignment.source_mine_id,
    status: newConsignment.status,
    created_at: newConsignment.created_at
  };

  if (!netState.isConnected) {
    await addToQueue('REGISTER_CONSIGNMENT', newConsignment);
  } else {
    const { error } = await supabase.from('consignments').insert([dbPayload]);
    if (error) {
      console.log('Supabase insert notice for consignment:', error.message);
      await addToQueue('REGISTER_CONSIGNMENT', newConsignment);
    }
  }

  await logAudit('register_consignment', 'consignments', newConsignment.id, {
    code: consignmentCode,
    vehicle: newConsignment.vehicle_no,
    tonnes: newConsignment.quantity_tonnes
  });

  return newConsignment;
};

export const recordCheckpointScan = async (data: {
  consignment_id: string;
  location: string;
  quantity_verified: number;
  vehicle_status: string;
  isDestination?: boolean;
  notes?: string;
}): Promise<{ checkpoint: CheckpointRecord; updatedConsignment: Consignment }> => {
  const officer = await getCurrentOfficer();
  const consignments = await getConsignments();
  const target = consignments.find(c => c.id === data.consignment_id || c.consignment_code === data.consignment_id);

  const originalQty = target ? target.quantity_tonnes : data.quantity_verified;
  const qtyDiff = Math.abs(originalQty - data.quantity_verified);
  // Mismatch flag threshold: > 0.5 tonnes deviation
  const mismatchDetected = qtyDiff > 0.5;

  const checkpointId = `chk_${Date.now()}`;
  const checkpoint: CheckpointRecord = {
    id: checkpointId,
    consignment_id: target?.id || data.consignment_id,
    location: data.location,
    quantity_verified: Number(data.quantity_verified),
    vehicle_status: data.vehicle_status,
    scanned_at: new Date().toISOString(),
    scanned_by: officer.name,
    mismatch_detected: mismatchDetected,
    notes: data.notes || (mismatchDetected ? `DEMO Alert: Quantity mismatch of ${qtyDiff.toFixed(2)} tonnes detected!` : 'Verified')
  };

  // Update consignment status
  let newStatus: Consignment['status'] = 'in_transit';
  if (data.isDestination) {
    newStatus = mismatchDetected ? 'flagged' : 'delivered';
  } else if (mismatchDetected) {
    newStatus = 'flagged';
  }

  const updatedConsignment: Consignment = target ? {
    ...target,
    status: newStatus
  } : {
    id: data.consignment_id,
    consignment_code: data.consignment_id,
    vehicle_no: 'JH-10-DEMO-999',
    coal_type: 'Coking Coal Grade 1',
    quality_grade: 'Steel Grade I',
    quantity_tonnes: originalQty,
    source_mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    status: newStatus,
    created_at: new Date().toISOString()
  };

  // Update local storage
  const updatedList = consignments.map(c => c.id === updatedConsignment.id ? updatedConsignment : c);
  if (!consignments.some(c => c.id === updatedConsignment.id)) {
    updatedList.unshift(updatedConsignment);
  }
  await AsyncStorage.setItem(LOCAL_CONSIGNMENTS_KEY, JSON.stringify(updatedList));

  // Save checkpoint locally
  const rawCheckpoints = await AsyncStorage.getItem(LOCAL_CHECKPOINTS_KEY);
  const checkpointsList: CheckpointRecord[] = rawCheckpoints ? JSON.parse(rawCheckpoints) : [];
  checkpointsList.unshift(checkpoint);
  await AsyncStorage.setItem(LOCAL_CHECKPOINTS_KEY, JSON.stringify(checkpointsList));

  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    await addToQueue('RECORD_CHECKPOINT', { checkpoint, updatedConsignment });
  } else {
    await supabase.from('checkpoints').insert([checkpoint]);
    await supabase.from('consignments').update({ status: newStatus }).eq('id', updatedConsignment.id);
  }

  await logAudit('checkpoint_scan', 'checkpoints', checkpoint.id, {
    location: data.location,
    mismatch: mismatchDetected,
    status: newStatus
  });

  return { checkpoint, updatedConsignment };
};

export const getConsignments = async (): Promise<Consignment[]> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_CONSIGNMENTS_KEY);
    const local: Consignment[] = raw ? JSON.parse(raw) : [];

    const { data } = await supabase.from('consignments').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      return data;
    }

    if (local.length > 0) return local;

    // Default DEMO Consignments
    const demoConsignments: Consignment[] = [
      {
        id: 'csg_demo_101',
        consignment_code: 'MINEGOV-COAL-849201',
        vehicle_no: 'JH-10-DEMO-4821',
        coal_type: 'Thermal Coal High Grade',
        quality_grade: 'G-3 Grade',
        quantity_tonnes: 32.5,
        source_mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        source_mine_name: 'DEMO Dhanbad Colliery Block-B',
        status: 'in_transit',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'csg_demo_102',
        consignment_code: 'MINEGOV-COAL-849202',
        vehicle_no: 'CG-04-DEMO-1930',
        coal_type: 'Coking Coal Steel Grade',
        quality_grade: 'G-1 Grade',
        quantity_tonnes: 45.0,
        source_mine_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        source_mine_name: 'DEMO Gevra OpenCast Mine',
        status: 'delivered',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    await AsyncStorage.setItem(LOCAL_CONSIGNMENTS_KEY, JSON.stringify(demoConsignments));
    return demoConsignments;
  } catch (err) {
    return [];
  }
};

export const getConsignmentTimeline = async (consignmentId: string): Promise<CheckpointRecord[]> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_CHECKPOINTS_KEY);
    const local: CheckpointRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = local.filter(c => c.consignment_id === consignmentId);

    if (filtered.length > 0) return filtered;

    // DEMO fallback checkpoints
    return [
      {
        id: 'chk_demo_1',
        consignment_id: consignmentId,
        location: 'Mine Weighbridge #1 (Source)',
        quantity_verified: 32.5,
        vehicle_status: 'Cleared - Seal Verified',
        scanned_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        scanned_by: 'DEMO Mining Official',
        mismatch_detected: false,
        notes: 'Dispatched with digital lock.'
      },
      {
        id: 'chk_demo_2',
        consignment_id: consignmentId,
        location: 'Highway Toll Checkpoint Alpha',
        quantity_verified: 32.4,
        vehicle_status: 'Cleared - Weight OK',
        scanned_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        scanned_by: 'DEMO Inspector',
        mismatch_detected: false,
        notes: 'Intermediate weighbridge matched.'
      }
    ];
  } catch (err) {
    return [];
  }
};
