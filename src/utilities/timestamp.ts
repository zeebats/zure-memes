import { SupabaseClient } from '@supabase/supabase-js';

interface Timestamp {
    id: number;
    timestamp: number;
}

export const queryTimestamp = ({ $supabase }: { $supabase: SupabaseClient }) => $supabase.from('timestamp');

export const getTimestamp = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<string> => {
	const {
		data: timestamp,
		error,
	} = await queryTimestamp({ $supabase })
		.select('timestamp')
		.limit(1)
		.single();

	if (error) {
		throw error;
	}

	return `${timestamp.timestamp}`;
};

export const setTimestamp = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void> => {
	const { error } = await queryTimestamp({ $supabase })
		.update({ timestamp: Date.now() })
		.eq('id', 1);

	if (error) {
		throw error;
	}
};
