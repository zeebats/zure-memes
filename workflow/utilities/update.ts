import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';
import { getTimestamp } from '@/utilities/timestamp';
import { downloadImages, downloadImagesJSON } from '@/workflow/utilities/images';
import { downloadMemesJSON } from '@/workflow/utilities/memes';
import { probe } from '@/workflow/utilities/node';
import { downloadTagsJSON } from '@/workflow/utilities/tags';

export const performUpdate = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const timestampLocal = await probe('./.cache/timestamp.txt') ? await readFile('./.cache/timestamp.txt', { encoding: 'utf8' }) : '0';
	const timestampRemote = await getTimestamp({ $supabase });

	if (timestampLocal === timestampRemote) {
		return;
	}

	// Create required directories
	await mkdir(
		'./.cache/images/',
		{ recursive: true },
	);

	// Create timestamp.txt with timestamp from Supabase
	await writeFile('./.cache/timestamp.txt', timestampRemote);

	// Prepare images
	await downloadImagesJSON({ $supabase });
	await downloadImages({ $supabase });

	// Prepare tags
	await downloadTagsJSON({ $supabase });

	// Prepare memes join table
	await downloadMemesJSON({ $supabase });
};
