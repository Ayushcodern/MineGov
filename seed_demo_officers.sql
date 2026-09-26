-- ==============================================================================
-- MineGOV Demo Officers & Initial Seed Script
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

INSERT INTO public.officers (user_id, officer_id, name, role, email) VALUES
 (NULL, 'INSP-IND-101', 'Rajesh Sharma', 'field_inspector', 'rajesh.sharma@minegov.in'),
 (NULL, 'OFF-IND-202', 'Priya Nair', 'mining_official', 'priya.nair@minegov.in'),
 (NULL, 'CONT-IND-303', 'Amit Verma', 'contractor', 'amit.verma@apexheavy.in'),
 (NULL, 'COMP-IND-404', 'Sunita Deshmukh', 'compliance_officer', 'sunita.deshmukh@minegov.in'),
 (NULL, 'CORP-IND-505', 'Vikram Malhotra', 'corporate', 'vikram.malhotra@cil.gov.in'),
 (NULL, 'DGMS-IND-606', 'Dr. Alok Kumar', 'regulator', 'alok.kumar@dgms.gov.in')
ON CONFLICT (officer_id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- Seed Contractor Contracts for Phase 3 expiry engine demo
INSERT INTO public.contractor_contracts (contractor_name, contract_end_date, mine_id)
SELECT 'Apex Heavy Earthmovers Ltd', (CURRENT_DATE + INTERVAL '12 days')::date, id 
FROM public.mines LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.contractor_contracts (contractor_name, contract_end_date, mine_id)
SELECT 'GeoTech Blasting Services', (CURRENT_DATE + INTERVAL '28 days')::date, id 
FROM public.mines LIMIT 1
ON CONFLICT DO NOTHING;

