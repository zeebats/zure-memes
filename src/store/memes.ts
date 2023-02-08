import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { tagsByImageID } from '@/store/tags';
import { Image } from '@/utilities/images';
import { getAllMemes, Meme } from '@/utilities/memes';
import { Tag } from '@/utilities/tags';

export const memes = atom<Meme[]>([]);

export const largestMemeID = computed([memes], memes => Math.max(...memes.map(meme => meme.id)));

// eslint-disable-next-line max-statements
export const upsert = action(memes, 'upsert', async (store, {
	imageID,
	updatedTags,
} : {
	imageID: Image['id'];
	updatedTags: Tag[]
}) => {
	let newTagsForImage: Tag[] = [];

	const existingTagsForUpdatedImage = tagsByImageID.get()[imageID] || [];

	if (existingTagsForUpdatedImage) {
		newTagsForImage = updatedTags.filter((potentialNew: Tag): boolean => !existingTagsForUpdatedImage.some(existing => existing.name === potentialNew.name));
	}

	let newLargestMemeID = largestMemeID.get();

	const memesToUpdate = newTagsForImage.map((tag: Tag) => ({
		id: (newLargestMemeID += 1),
		image_id: imageID, /* eslint-disable-line camelcase */
		tag_id: tag.id, /* eslint-disable-line camelcase */
	}));

	const { error } = await $supabase
		.from<Meme>('memes')
		.upsert(memesToUpdate);

	if (error) {
		throw error;
	}

	for (const meme of memesToUpdate) {
		const arrayIndex = store.get().findIndex(storeMeme => storeMeme.id === meme.id);

		if (arrayIndex === -1) {
			store.set([
				...store.get(),
				Object.freeze(meme),
			]);
		} else {
			store.set([
				...store.get().slice(0, arrayIndex),
				Object.freeze(meme),
				...store.get().slice(arrayIndex + 1),
			]);
		}
	}

	return memesToUpdate;
});

onMount(memes, () => {
	task(async () => {
		const response = await getAllMemes({ $supabase });

		memes.set(response);
	});
});
