// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nyqvxihzbbfgzxghuzju.supabase.co';
const supabaseKey = 'sb_publishable_s9BpKzIpHPGGwHEm4BIQXA_m5Zq9fCX';

export const supabase = createClient(supabaseUrl, supabaseKey);