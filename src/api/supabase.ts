import { createClient } from '@supabase/supabase-js';

const {
	PUBLIC_SUPABASE_KEY,
	PUBLIC_SUPABASE_URL,
} = import.meta.env;

export const $supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export const { auth: $auth } = $supabase;
