import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';

export const queryTimestamp = ({ $supabase }: { $supabase: SupabaseClient<Database> }) => $supabase.from('timestamp');

export const getTimestamp = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: timestamp,
		error,
	} = await queryTimestamp({ $supabase })
		.select('timestamp')
		.limit(1)
		.single();

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return `${timestamp.timestamp}`;
};

export const setTimestamp = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const { error } = await queryTimestamp({ $supabase })
		.update({ timestamp: Date.now() })
		.eq('id', 1);

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}
};
