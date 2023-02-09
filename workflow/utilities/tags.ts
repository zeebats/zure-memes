import { readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';
import { Image } from '@/utilities/images';
import { Meme } from '@/utilities/memes';
import { matchTagsToImageId, queryTags, Tag } from '@/utilities/tags';

export const downloadTagsJSON = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: tags,
		error,
	} = await queryTags({ $supabase }).select();

	if (error) {
		throw error;
	}

	return writeFile('./.cache/tags.json', JSON.stringify(tags));
};

export const getTags = async () => {
	const local = await readFile('./.cache/tags.json', { encoding: 'utf8' });

	const tags: Tag[] = JSON.parse(local);

	return tags;
};

export const getTagsForImageId = async ({ id } : { id: Image['id'] }) => {
	const tagsRaw = await readFile('./.cache/tags.json', { encoding: 'utf8' });
	const memesRaw = await readFile('./.cache/memes.json', { encoding: 'utf8' });

	const tags: Tag[] = JSON.parse(tagsRaw);
	const memes: Meme[] = JSON.parse(memesRaw);

	return matchTagsToImageId({
		id,
		memes,
		tags,
	});
};
