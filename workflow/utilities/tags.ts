import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';
import type { Image } from '@/utilities/images';
import type { Meme } from '@/utilities/memes';

import { readFile, writeFile } from 'node:fs/promises';

import { type Tag, matchTagsToImageId, queryTags } from '@/utilities/tags';

export const downloadTagsJSON = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: tags,
		error,
	} = await queryTags({ $supabase }).select();

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return writeFile('./.cache/tags.json', JSON.stringify(tags));
};

export const getTags = async () => {
	const local = await readFile('./.cache/tags.json', { encoding: 'utf8' });

	const tags = JSON.parse(local) as unknown as Tag[];

	return tags;
};

export const getTagsForImageId = async ({ id } : { id: Image['id'] }) => {
	const tagsRaw = await readFile('./.cache/tags.json', { encoding: 'utf8' });
	const memesRaw = await readFile('./.cache/memes.json', { encoding: 'utf8' });

	const tags = JSON.parse(tagsRaw) as unknown as Tag[];
	const memes = JSON.parse(memesRaw) as unknown as Meme[];

	return matchTagsToImageId({
		id,
		memes,
		tags,
	});
};
