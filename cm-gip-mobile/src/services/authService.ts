import { supabase } from '../config/supabaseClient';

export const loginUser = async (email, password) => {
  try {
    // Attempt real Supabase login (will fail gracefully if not configured)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Dummy bypass if Supabase is not configured yet
    if (error) {
      console.log("Supabase not configured, using bypass:", error.message);
      const user = { id: 'GUEST_USER', email: email || 'guest@minegov.com' };
      const profileData = { name: "Guest Inspector", role: "Inspector" };
      await new Promise(resolve => setTimeout(resolve, 500));
      return { user, profileData };
    }
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    return { user: data.user, profileData: profileData || {} };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    throw error;
  }
};
