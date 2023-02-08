import { SupabaseClient } from '@supabase/supabase-js';

import { Image } from '@/utilities/images';
import { Meme } from '@/utilities/memes';

export interface Tag {
    id: number;
    name: string;
}

export const queryTags = ({ $supabase }: { $supabase: SupabaseClient }) => $supabase.from('tags');

export const getAllTags = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<Tag[]> => {
	const {
		data: tags,
		error,
	} = await queryTags({ $supabase }).select();

	if (error) {
		throw error;
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
}): Tag[] => {
	const foundMemes = memes.filter(meme => meme.image_id === id) || [];
	const foundTags = foundMemes.map(meme => tags.find(tag => tag.id === meme.tag_id));

	return foundTags as Tag[];
};
