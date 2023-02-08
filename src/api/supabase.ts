import { createClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';

const {
	PUBLIC_SUPABASE_KEY,
	PUBLIC_SUPABASE_URL,
} = import.meta.env;

export const $supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export const { auth: $auth } = $supabase;
