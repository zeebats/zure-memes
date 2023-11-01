import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';
import type { Image } from '@/utilities/images';
import type { Meme } from '@/utilities/memes';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Tag = {
    id: number;
    name: string;
}

export const queryTags = ({ $supabase }: { $supabase: SupabaseClient<Database> }) => $supabase.from('tags');

export const getAllTags = async ({ $supabase }: { $supabase: SupabaseClient }) => {
	const {
		data: tags,
		error,
	} = await queryTags({ $supabase }).select();

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return tags;
};

export const matchTagsToImageId = ({
	id,
	memes,
	tags,
} : {
    id: Image['id'],
    memes: Meme[],
    tags: Tag[]
}) => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
	const foundMemes = memes.filter(meme => meme.image_id === id) || [];
	const foundTags = foundMemes.map(meme => tags.find(tag => tag.id === meme.tag_id));

	return foundTags as Tag[];
};
