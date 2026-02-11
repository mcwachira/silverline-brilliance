import { createClient } from './mock-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
