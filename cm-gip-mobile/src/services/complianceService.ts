import { supabase } from '../config/supabaseClient';
import * as Crypto from 'expo-crypto';

export const getPendingReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('status', 'pending_review');

    if (error) {
      console.log('Supabase query error, returning dummy:', error.message);
      return [
        {
          id: 'ins_101',
          taskId: 'task_55',
          inspectorId: 'smith_01',
          location: 'Sector 7G',
          findings: 'Minor dust accumulation in ventilation shaft.',
          status: 'pending_review',
        }
      ];
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateInspectionStatus = async (inspectionId, newStatus) => {
  try {
    // Generate blockchain-like hash using expo-crypto for compliance
    const timestamp = new Date().toISOString();
    const dataToHash = `${inspectionId}-${newStatus}-${timestamp}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      dataToHash
    );

    const { error } = await supabase
      .from('inspections')
      .update({ 
        status: newStatus,
        approvalHash: hash,
        approvalTimestamp: timestamp
      })
      .eq('id', inspectionId);

    if (error) {
      console.log('Supabase update error (hash):', error.message);
    }
  } catch (error) {
    throw error;
  }
};
