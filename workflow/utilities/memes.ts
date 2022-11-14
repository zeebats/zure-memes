import { writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { queryMemes } from '@/src/utilities/memes';

export const downloadMemesJSON = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void> => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase });

	if (error) {
		throw error;
	}

	return writeFile('./.cache/memes.json', JSON.stringify(memes));
};
