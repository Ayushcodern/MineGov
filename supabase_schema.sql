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

-- ==========================================
-- PHASE 1: PPT COMPLIANCE RULE ID COLUMN
-- ==========================================
ALTER TABLE public.observations ADD COLUMN IF NOT EXISTS rule_id TEXT;

-- ==========================================
-- PHASE 2: 6 COMPLIANCE & GOVERNANCE ROLES
-- ==========================================
ALTER TABLE public.officers DROP CONSTRAINT IF EXISTS officers_role_check;
ALTER TABLE public.officers ADD CONSTRAINT officers_role_check CHECK (role IN ('field_inspector','mining_official','contractor','compliance_officer','corporate','regulator'));

-- ==========================================
-- PHASE 3: CONTRACTOR CONTRACTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contractor_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_name TEXT NOT NULL,
    contract_end_date DATE NOT NULL,
    mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- PHASE 4: COAL TRANSPORT & QR CHECKPOINTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.consignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignment_code TEXT UNIQUE NOT NULL,
    vehicle_no TEXT NOT NULL,
    coal_type TEXT NOT NULL,
    quality_grade TEXT NOT NULL,
    quantity_tonnes NUMERIC(10,2) NOT NULL,
    source_mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('registered', 'in_transit', 'delivered', 'flagged')) DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignment_id UUID REFERENCES public.consignments(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    quantity_verified NUMERIC(10,2) NOT NULL,
    vehicle_status TEXT NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    scanned_by UUID REFERENCES public.officers(id) ON DELETE SET NULL,
    mismatch_detected BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- PHASE 5: ATTENDANCE & LABOUR TRACKING
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mine_id UUID REFERENCES public.mines(id) ON DELETE CASCADE,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    check_in_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    check_out_at TIMESTAMP WITH TIME ZONE,
    shift_hours NUMERIC(4,2),
    method TEXT CHECK (method IN ('qr', 'manual', 'biometric')) DEFAULT 'qr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- ==========================================
-- PHASE 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Enable RLS on all tables and grant access for the mobile client anon key

ALTER TABLE public.mines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on mines" ON public.mines FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on officers" ON public.officers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on inspections" ON public.inspections FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.inspection_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on inspection_checklist_items" ON public.inspection_checklist_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on observations" ON public.observations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on corrective_actions" ON public.corrective_actions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on audit_log" ON public.audit_log FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on sync_queue" ON public.sync_queue FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.contractor_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on contractor_contracts" ON public.contractor_contracts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on consignments" ON public.consignments FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on checkpoints" ON public.checkpoints FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon all on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- PHASE 7: SCHEMA EXTENSIONS & COMPATIBILITY
-- ==========================================
-- Add missing columns to audit_log, inspections, and consignments
ALTER TABLE public.audit_log ALTER COLUMN entity_id TYPE TEXT USING entity_id::text;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS details TEXT;

ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS findings TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS "aiInsights" TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS ai_insights TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS video_hash TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS "videoHash" TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS geotag TEXT;
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS mine_name TEXT;

ALTER TABLE public.consignments ADD COLUMN IF NOT EXISTS source_mine_name TEXT;

-- Create tasks view for backwards compatibility
CREATE OR REPLACE VIEW public.tasks AS
SELECT 
  id, 
  title, 
  description,
  priority,
  due_date AS "dueDate", 
  status, 
  assigned_to AS "assignedTo",
  mine_id
FROM public.corrective_actions;

