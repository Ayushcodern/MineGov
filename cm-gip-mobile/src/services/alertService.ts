import { supabase } from '../config/supabaseClient';

export const getAlerts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.log('Supabase alerts error, returning dummy:', error.message);
      return [
        { id: '1', title: 'Severe Weather Warning', message: 'Heavy rain expected, secure site.', read: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Compliance Update', message: 'New EPA standards require updated docs.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      ];
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const markAlertAsRead = async (alertId) => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', alertId);

    if (error) console.log('Supabase update error:', error.message);
  } catch (error) {
    throw error;
  }
};
