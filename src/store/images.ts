import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { tagsByImageID } from '@/store/tags';
import { filterImages, getAllImages, Image } from '@/utilities/images';
import { getAllMemes } from '@/utilities/memes';
import { getAllTags } from '@/utilities/tags';

export const images = atom<Image[]>([]);
export const search = atom<string>('');

export const imagesByID = computed([images], images => Object.fromEntries(images.map(image => [
	image.id,
	image,
])));

export const imagesLoop = computed([
	images,
	search,
	tagsByImageID,
], (images, search, tagsByImageID) => {
	const filtered = filterImages({
		images: images.map(image => (Object.freeze({
			...image,
			tags: tagsByImageID[image.id],
		}))),
		search,
	});

	return filtered.map(({
		tags, // eslint-disable-line @typescript-eslint/no-unused-vars
		...image
	}): Image => image);
});

export const largestImageID = computed([images], images => Math.max(...images.map(images => images.id)));

export const upsert = action(images, 'upsert', async (store, {
	id = largestImageID.get() + 1,
	title,
	url,
}) => {
	const { error } = await $supabase
		.from<Image>('images')
		.upsert({
			id,
			title,
			url,
		});

	if (error) {
		throw error;
	}

	const arrayIndex = store.get().findIndex(image => image.id === id);

	if (arrayIndex === -1) {
		store.set([
			Object.freeze({
				id,
				title,
				url,
			}),
			...store.get(),
		]);
	} else {
		store.set([
			...store.get().slice(0, arrayIndex),
			Object.freeze({
				id,
				title,
				url,
			}),
			...store.get().slice(arrayIndex + 1),
		]);
	}

	return id;
});

onMount(images, () => {
	task(async () => {

		await getAllMemes({ $supabase });
		await getAllTags({ $supabase });
		const response = await getAllImages({ $supabase });
		images.set(response);
	});
});
