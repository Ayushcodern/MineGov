import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://nvxxukxiqlvujuticiqd.supabase.co';
const supabaseAnonKey = 'sb_publishable_ucrXpg7s1M8t-h2bsHUHfQ_fYh7LucT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
