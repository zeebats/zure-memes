import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';
import type { Tag } from '@/utilities/tags';

import {
	Fzf,
	type FzfOptions,
	type FzfResultItem,
	extendedMatch,
} from 'fzf';

/* eslint-disable @typescript-eslint/no-type-alias */
export type Image = {
    id: number;
    title: null | string;
    url: string;
}

export type ImageSearchable = {
    tags: Tag[] | undefined
} & Image
/* eslint-enable @typescript-eslint/no-type-alias */

export const queryImages = ({ $supabase }: { $supabase: SupabaseClient<Database> }) => $supabase.from('images');

export const getAllImages = async ({ $supabase }: { $supabase: SupabaseClient<Database> }) => {
	const {
		data: images,
		error,
	} = await queryImages({ $supabase })
		.select()
		.order('id', { ascending: false });

	if (error !== null) {
		throw new Error(JSON.stringify(error));
	}

	return images;
};

export const filterImages = ({
	images,
	search,
} : {
    images: ImageSearchable[]
    search: string;
}) => {
	const options: FzfOptions<ImageSearchable> = {
		match: extendedMatch,
		selector: image => {
			const concat = `${image.title ?? ''} ${(image.tags ?? []).map(tag => tag.name).join(' ')}`;

			return concat;
		},
	};

	const fzf = new Fzf<ImageSearchable[]>(images, options);

	const matches: FzfResultItem<ImageSearchable>[] = fzf.find(search); // eslint-disable-line unicorn/no-array-callback-reference

	return matches.map(({ item }) => item);
};
