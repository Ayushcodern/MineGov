import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logAudit } from './auditService';

export type UserRole = 
  | 'field_inspector' 
  | 'mining_official' 
  | 'contractor' 
  | 'compliance_officer' 
  | 'corporate' 
  | 'regulator';

export interface OfficerProfile {
  id: string;
  user_id?: string;
  officer_id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  assigned_mine_id?: string;
}

export const DEMO_OFFICERS: Record<string, OfficerProfile> = {
  'rajesh.sharma@minegov.in': {
    id: 'off_ind_101',
    user_id: 'auth_ind_101',
    officer_id: 'INSP-IND-101',
    name: 'Rajesh Sharma',
    role: 'field_inspector',
    email: 'rajesh.sharma@minegov.in',
    phone: '+91 98765 43210',
    assigned_mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  },
  'priya.nair@minegov.in': {
    id: 'off_ind_202',
    user_id: 'auth_ind_202',
    officer_id: 'OFF-IND-202',
    name: 'Priya Nair',
    role: 'mining_official',
    email: 'priya.nair@minegov.in',
    phone: '+91 98765 43211',
    assigned_mine_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
  },
  'amit.verma@apexheavy.in': {
    id: 'off_ind_303',
    user_id: 'auth_ind_303',
    officer_id: 'CONT-IND-303',
    name: 'Amit Verma',
    role: 'contractor',
    email: 'amit.verma@apexheavy.in',
    phone: '+91 98765 43212',
    assigned_mine_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  },
  'sunita.deshmukh@minegov.in': {
    id: 'off_ind_404',
    user_id: 'auth_ind_404',
    officer_id: 'COMP-IND-404',
    name: 'Sunita Deshmukh',
    role: 'compliance_officer',
    email: 'sunita.deshmukh@minegov.in',
    phone: '+91 98765 43213',
    assigned_mine_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
  },
  'vikram.malhotra@cil.gov.in': {
    id: 'off_ind_505',
    user_id: 'auth_ind_505',
    officer_id: 'CORP-IND-505',
    name: 'Vikram Malhotra',
    role: 'corporate',
    email: 'vikram.malhotra@cil.gov.in',
    phone: '+91 98765 43214'
  },
  'alok.kumar@dgms.gov.in': {
    id: 'off_ind_606',
    user_id: 'auth_ind_606',
    officer_id: 'DGMS-IND-606',
    name: 'Dr. Alok Kumar',
    role: 'regulator',
    email: 'alok.kumar@dgms.gov.in',
    phone: '+91 98765 43215'
  }
};

// Aliases for legacy inputs or badge IDs
const OFFICER_ALIASES: Record<string, string> = {
  'demo_field_01': 'rajesh.sharma@minegov.in',
  'insp-ind-101': 'rajesh.sharma@minegov.in',
  'off-001': 'rajesh.sharma@minegov.in',
  'inspector@minegov.demo': 'rajesh.sharma@minegov.in',

  'demo_official_01': 'priya.nair@minegov.in',
  'off-ind-202': 'priya.nair@minegov.in',
  'off-002': 'priya.nair@minegov.in',
  'official@minegov.demo': 'priya.nair@minegov.in',

  'demo_contractor_01': 'amit.verma@apexheavy.in',
  'cont-ind-303': 'amit.verma@apexheavy.in',
  'off-003': 'amit.verma@apexheavy.in',
  'contractor@minegov.demo': 'amit.verma@apexheavy.in',

  'demo_compliance_01': 'sunita.deshmukh@minegov.in',
  'comp-ind-404': 'sunita.deshmukh@minegov.in',
  'off-004': 'sunita.deshmukh@minegov.in',
  'compliance@minegov.demo': 'sunita.deshmukh@minegov.in',

  'demo_corp_01': 'vikram.malhotra@cil.gov.in',
  'corp-ind-505': 'vikram.malhotra@cil.gov.in',
  'off-005': 'vikram.malhotra@cil.gov.in',
  'corporate@minegov.demo': 'vikram.malhotra@cil.gov.in',

  'demo_regulator_01': 'alok.kumar@dgms.gov.in',
  'dgms-ind-606': 'alok.kumar@dgms.gov.in',
  'off-006': 'alok.kumar@dgms.gov.in',
  'regulator@minegov.demo': 'alok.kumar@dgms.gov.in'
};

const CURRENT_OFFICER_KEY = '@minegov_current_officer';

export const getCurrentOfficer = async (): Promise<OfficerProfile> => {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_OFFICER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading current officer from storage:', err);
  }
  return DEMO_OFFICERS['rajesh.sharma@minegov.in'];
};

export const setCurrentOfficer = async (officer: OfficerProfile): Promise<void> => {
  await AsyncStorage.setItem(CURRENT_OFFICER_KEY, JSON.stringify(officer));
};

export const loginUser = async (emailOrBadge: string, password?: string) => {
  try {
    const rawInput = emailOrBadge.trim().toLowerCase();
    const resolvedEmail = OFFICER_ALIASES[rawInput] || rawInput;

    if (DEMO_OFFICERS[resolvedEmail]) {
      const officer = DEMO_OFFICERS[resolvedEmail];
      await setCurrentOfficer(officer);
      await logAudit('login', 'officers', officer.id, { role: officer.role, officer: officer.name });
      return {
        user: { id: officer.user_id, email: officer.email },
        profileData: officer
      };
    }

    // Attempt real Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password: password || 'Demo@1234',
    });
    
    if (error) {
      console.log('Supabase login fallback:', error.message);
      const defaultOfficer = DEMO_OFFICERS['rajesh.sharma@minegov.in'];
      await setCurrentOfficer(defaultOfficer);
      await logAudit('login_fallback', 'officers', defaultOfficer.id);
      return { user: { id: defaultOfficer.user_id, email: defaultOfficer.email }, profileData: defaultOfficer };
    }
    
    // Fetch officer profile from DB
    const { data: profileData } = await supabase
      .from('officers')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
      
    const resolvedRole: UserRole = (profileData?.role as UserRole) || 'field_inspector';
    const officerProfile: OfficerProfile = {
      id: profileData?.id || data.user.id,
      user_id: data.user.id,
      officer_id: profileData?.officer_id || 'INSP-IND-101',
      name: profileData?.name || 'Rajesh Sharma',
      role: resolvedRole,
      email: resolvedEmail
    };

    await setCurrentOfficer(officerProfile);
    await logAudit('login', 'officers', officerProfile.id, { role: resolvedRole });
    return { user: data.user, profileData: officerProfile };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const current = await getCurrentOfficer();
    await logAudit('logout', 'officers', current?.id || null);
    await AsyncStorage.removeItem(CURRENT_OFFICER_KEY);
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Logout notice:', error);
  }
};
