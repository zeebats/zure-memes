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

export const imagesById = computed([images], images => Object.fromEntries(images.map(image => [
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
	id,
	title,
	url,
}) => {
	const {
		data: imageUpdated,
		error: imageError,
	} = await $supabase
		.from<Image>('images')
		.upsert({
			id: id || (largestImageID.get() + 1),
			title: title.value,
			url: url.value,
		})
		.single();

	if (imageError) {
		throw imageError;
	}

	return { updatedImageID: imageUpdated };

	// const arrayID = store.get().findIndex((original: Image): boolean => original.id === modified.id);

	// if (arrayID > -1) {
	// 	store.set(Object.assign([], store.get(), { [arrayID]: Object.freeze(modified) }));

	// 	return;
	// }

	// store.set([
	// 	Object.freeze(modified),
	// 	...store.get(),
	// ]);
});

onMount(images, () => {
	task(async () => {
		await getAllMemes({ $supabase });
		await getAllTags({ $supabase });
		const response = await getAllImages({ $supabase });
		images.set(response);
	});
});
