import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { getAllMemes, Meme } from '@/utilities/memes';

export const memes = atom<Meme[]>([]);

export const largestMemeID = computed([memes], memes => Math.max(...memes.map(meme => meme.id)));

export const upsert = action(memes, 'upsert', async (store, {
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

	// upsert(modifiedMemes: Meme[]): void {
	// 	for(const modifiedMeme of modifiedMemes) {
	// 		const arrayID = this.memes.findIndex((original: Meme): boolean => original.id === modifiedMeme.id);

	// 		if (arrayID > 0) {
	// 			this.memes[arrayID] = Object.freeze(modifiedMeme);

	// 			continue;
	// 		}

	// 		this.memes.push(Object.freeze(modifiedMeme));
	// 	}
	// },
});

onMount(memes, () => {
	task(async () => {
		const response = await getAllMemes({ $supabase });

		memes.set(response);
	});
});
