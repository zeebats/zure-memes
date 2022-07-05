import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { useTagsStore } from '@/store/tags';
import { filterImages, getAllImages, Image } from '@/utilities/images';

export const useImageStore = defineStore('images', {
	actions: {
		async init($supabase: SupabaseClient): Promise<void> {
			this.images = await getAllImages({ $supabase });
		},
		modifySearch(search: string): void {
			this.search = search;
		},
		upsert(modified: Image): void {
			const arrayID = this.images.findIndex((original: Image): boolean => original.id === modified.id);

			if (arrayID > -1) {
				this.images[arrayID] = Object.freeze(modified);

				return;
			}

			this.images = [
				Object.freeze(modified),
				...this.images,
			];
		},
	},
	getters: {
		imagesById(): { [id: string]: Image } {
			return Object.fromEntries(this.images.map(image => [
				image.id,
				image,
			]));
		},
		imagesLoop(): Image[] {
			const tagsStore = useTagsStore();

			const { tagsByImageId } = tagsStore;

			const filtered = filterImages({
				images: this.images.map(image => (Object.freeze({
					...image,
					tags: tagsByImageId[image.id] || [],
				}))),
				search: this.search,
			});

			return filtered.map(({
				tags, // eslint-disable-line @typescript-eslint/no-unused-vars
				...image
			}): Image => image);
		},
		largestImageID(): number {
			return this.images.reduce((accumulator: number, image: Image): number => {
				if (accumulator > image.id) {
					return accumulator;
				}

				return image.id;
			}, 0);
		},
	},
	state: (): {
        images: Image[],
        search: string
    } => ({
		images: [],
		search: '',
	}),
});
