import { supabase } from '../config/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue } from './syncService';

export const submitInspection = async (inspectionData) => {
  try {
    const state = await NetInfo.fetch();
    
    // If offline, queue it instead
    if (!state.isConnected) {
      console.log('Device offline, queueing inspection.');
      await addToQueue('SUBMIT_INSPECTION', inspectionData);
      return true;
    }

    const formattedData = {
      ...inspectionData,
      location: inspectionData.location ? JSON.stringify(inspectionData.location) : null,
      findings: inspectionData.observations ? JSON.stringify(inspectionData.observations) : null,
      aiInsights: inspectionData.aiInsights ? JSON.stringify(inspectionData.aiInsights) : null
    };
    
    delete formattedData.observations; // Replaced by findings

    const { data, error } = await supabase
      .from('inspections')
      .insert([formattedData])
      .select();

    if (error) {
      // If error is network related, queue it. Otherwise just log.
      if (error.message.includes("fetch") || error.message.includes("network")) {
        console.log('Network failed during submission, queueing inspection.');
        await addToQueue('SUBMIT_INSPECTION', inspectionData);
        return true;
      }
      console.log('Supabase insertion error:', error.message);
      return true; // Dummy success for prototyping
    }
    
    return data;
  } catch (error) {
    console.log('Unexpected error, queueing inspection.', error);
    await addToQueue('SUBMIT_INSPECTION', inspectionData);
    return true;
  }
};
