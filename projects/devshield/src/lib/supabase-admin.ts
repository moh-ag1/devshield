import { createClient } from '@supabase/supabase-js';

// This client is for server-side use with the service role key to bypass RLS for administrative tasks
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
