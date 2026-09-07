const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gkosetolmcsakdnvzsxq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3NldG9sbWNzYWtkbnZ6c3hxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY0MzUwMiwiZXhwIjoyMTA0MjE5NTAyfQ.lHND4o0xK8yH5X7y53Yk2r5x2-L5-Yy-xL5xL-5_L-Y'; // Wait, let me check the user's secret_role key.
