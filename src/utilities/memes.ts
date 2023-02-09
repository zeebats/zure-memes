import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';

export interface Meme {
    id: number;
    image_id: number;
    tag_id: number;
}

export const queryMemes = ({ $supabase }: { $supabase: SupabaseClient<Database> }) => $supabase.from('memes');

export const getAllMemes = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase }).select();

	if (error) {
		throw error;
	}

	return memes;
};
