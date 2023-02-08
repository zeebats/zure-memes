import { SupabaseClient } from '@supabase/supabase-js';

export interface Meme {
    id: number;
    image_id: number;
    tag_id: number;
}

export const queryMemes = ({ $supabase }: { $supabase: SupabaseClient }) => $supabase.from('memes');

export const getAllMemes = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<Meme[]> => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase }).select();

	if (error) {
		throw error;
	}

	return memes;
};
