import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kjvdxteoqpklngucrlcb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-u055CrwcWqpWVDmFgkxmg_csO8dGIU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);