-- ==========================================
-- MineGOV Complete Supabase Database Schema
-- ==========================================

-- Enable PostGIS for geospatial data if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MINES TABLE
CREATE TABLE IF NOT EXISTS public.mines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. OFFICERS / USERS TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    officer_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('inspector', 'supervisor', 'admin')) DEFAULT 'inspector',
    assigned_mine_id UUID REFERENCES public.mines(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    officer_id UUID REFERENCES public.officers(id) ON DELETE CASCADE,
    mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100) DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'submitted', 'reviewed')) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INSPECTION CHECKLIST ITEMS
CREATE TABLE IF NOT EXISTS public.inspection_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    rule_code TEXT NOT NULL,
    rule_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pass', 'fail', 'na')) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('suggestion', 'minor', 'major', 'critical')) DEFAULT 'minor',
    regulation_cited TEXT,
    photo_url TEXT,
    ocr_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CORRECTIVE ACTIONS / TASKS
CREATE TABLE IF NOT EXISTS public.corrective_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE SET NULL,
    observation_id UUID REFERENCES public.observations(id) ON DELETE SET NULL,
    mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.officers(id) ON DELETE SET NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g. 'gas_leak', 'roof_fall', 'compliance_deadline'
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'high',
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    acknowledged_by UUID REFERENCES public.officers(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- 8. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'login', 'submit_inspection', 'resolve_task', 'ack_alert'
    entity_type TEXT NOT NULL,
    entity_id UUID,
    ip_address TEXT,
    device_info TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SYNC QUEUE SHADOW TABLE
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    officer_id UUID REFERENCES public.officers(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    operation TEXT CHECK (operation IN ('create', 'update', 'delete')) NOT NULL,
    payload JSONB NOT NULL,
    status TEXT CHECK (status IN ('pending', 'synced', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- SEED DATA FOR DEMO & TESTING
-- ==========================================

INSERT INTO public.mines (id, name, state, district, latitude, longitude, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dhanbad Colliery Block-B', 'Jharkhand', 'Dhanbad', 23.7957, 86.4304, 'active'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Gevra OpenCast Mine', 'Chhattisgarh', 'Korba', 22.3384, 82.6053, 'active'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Singareni Underground Shaft 3', 'Telangana', 'Kothagudem', 17.5524, 80.6225, 'active')
ON CONFLICT (id) DO NOTHING;
