import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your Supabase project URL and anon key
const supabaseUrl = 'https://gkosetolmcsakdnvzsxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3NldG9sbWNzYWtkbnZ6c3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NDM1MDIsImV4cCI6MjEwNDIxOTUwMn0.nI42E6POBjsDRg-cOKCPR4Efdiy5Y7XgzzoXiHUGE8E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
