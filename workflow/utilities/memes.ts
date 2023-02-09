import { writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';
import { queryMemes } from '@/utilities/memes';

export const downloadMemesJSON = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase }).select();

	if (error) {
		throw error;
	}

	return writeFile('./.cache/memes.json', JSON.stringify(memes));
};
