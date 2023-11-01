import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Meme = {
    id: number;
    image_id: number; // eslint-disable-line @typescript-eslint/naming-convention
    tag_id: number; // eslint-disable-line @typescript-eslint/naming-convention
}

export const queryMemes = ({ $supabase }: { $supabase: SupabaseClient<Database> }) => $supabase.from('memes');

export const getAllMemes = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase }).select();

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return memes;
};
