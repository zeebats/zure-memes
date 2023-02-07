import {
	action,
	atom,
	computed,
	onMount,
	task,
} from 'nanostores';

import { $supabase } from '@/api/supabase';
import { memes } from '@/store/memes';
import { getColor } from '@/utilities/color';
import { getAllTags, Tag } from '@/utilities/tags';

export interface StoreTag extends Tag {
    color: {
        foreground: string;
        background: string;
    },
}

export const tags = atom<StoreTag[]>([]);

export const largestTagID = computed([tags], tags => Math.max(...tags.map(tag => tag.id)));
export const tagsByID = computed([tags], tags => Object.fromEntries(tags.map(tag => [
	tag.id,
	tag,
])));
export const tagsByName = computed([tags], tags => Object.fromEntries(tags.map(tag => [
	tag.name,
	tag,
])));
export const tagsByImageID = computed([
	tagsByID,
	memes,
], (tagsByID, memes) => Object.fromEntries(memes.map(meme => [
	meme.image_id,
	memes.filter(item => item.image_id === meme.image_id).map(item => tagsByID[item.tag_id] || {}),
])));

export const upsert = action(tags, 'upsert', async (store, {
	id,
	title,
	url,
}) => {
	// const tagsToUpdate = tags.value.split(',').map((tag: string): Tag => ({
	// 	id: tagStore.tagsByName[tag]?.id || (largestTagID.get() + 1), /* eslint-disable-line unicorn/consistent-destructuring */
	// 	name: tag,
	// }));

	// const {
	// 	data: tagsUpdated,
	// 	error: tagsError,
	// } = await $supabase
	// 	.from<Tag>('tags')
	// 	.upsert(tagsToUpdate);

	// if (tagsError) {
	// 	throw tagsError;
	// }

	// return { updatedImageID: imageUpdated };

	// const arrayID = store.get().findIndex((original: Image): boolean => original.id === modified.id);

	// if (arrayID > -1) {
	// 	store.set(Object.assign([], store.get(), { [arrayID]: Object.freeze(modified) }));

	// 	return;
	// }

	// store.set([
	// 	Object.freeze(modified),
	// 	...store.get(),
	// ]);

	// upsert(modifiedTags: Tag[]): void {
	// 	for(const modifiedTag of modifiedTags) {
	// 		const arrayID = this.tags.findIndex(({ id }: StoreTag): boolean => id === modifiedTag.id);

	// 		const tagWithColor = Object.freeze({
	// 			...modifiedTag,
	// 			color: getColor(modifiedTag.name),
	// 		});

	// 		if (arrayID > 0) {
	// 			this.tags[arrayID] = tagWithColor;

	// 			continue;
	// 		}

	// 		this.tags.push(tagWithColor);
	// 	}
	// },

});

onMount(tags, () => {
	task(async () => {
		const response = await getAllTags({ $supabase });

		tags.set(response.map(tag => (Object.freeze({
			...tag,
			color: getColor(tag.name),
		}))));
	});
});
