import { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

import { filterImages, getAllImages } from '@/utilities/images';
import { getAllMemes } from '@/utilities/memes';
import { getAllTags, matchTagsToImageId } from '@/utilities/tags';

const {
	PUBLIC_SUPABASE_KEY,
	PUBLIC_SUPABASE_URL,
} = process.env;

const $supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export const handler: Handler = async ({ queryStringParameters }: HandlerEvent) => {
	try {
		const { search } = queryStringParameters || {};

		if (!search) {
			throw new Error('Ben je contextueel gehandicapt ofzo');
		}

		const tags = await getAllTags({ $supabase });
		const memes = await getAllMemes({ $supabase });
		const images = await getAllImages({ $supabase });

		const foundImages = filterImages({
			images: images.map(image => ({
				...image,
				tags: matchTagsToImageId({
					id: image.id,
					memes,
					tags,
				}),
			})),
			search: decodeURIComponent(search),
		});

		return {
			body: JSON.stringify(foundImages),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 200,
		};
	} catch ({ message }) {
		return {
			body: JSON.stringify({ message }),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 500,
		};
	}
};
