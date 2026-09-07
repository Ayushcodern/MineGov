import { supabase } from '../config/supabaseClient';

export const getUserTasks = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assignedTo', userId);

    if (error) {
      console.log('Supabase tasks error, returning dummy:', error.message);
      return [
        { id: '1', title: 'Inspect Site Alpha', dueDate: '2026-10-15', status: 'pending', assignedTo: 'GUEST_USER' },
        { id: '2', title: 'Safety Audit Beta', dueDate: '2026-10-18', status: 'pending', assignedTo: 'GUEST_USER' },
      ];
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const markTaskComplete = async (taskId) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId);

    if (error) console.log('Supabase update error:', error.message);
  } catch (error) {
    throw error;
  }
};
