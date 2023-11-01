import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';

import { writeFile } from 'node:fs/promises';

import { queryMemes } from '@/utilities/memes';

export const downloadMemesJSON = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: memes,
		error,
	} = await queryMemes({ $supabase }).select();

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return writeFile('./.cache/memes.json', JSON.stringify(memes));
};
