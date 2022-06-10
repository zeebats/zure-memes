import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { StoreTag, useTagsStore } from '@/store/tags';
import { getAllImages, Image } from '@/utilities/images';

export interface StoreImage extends Image {
    tags: StoreTag[]
}

export const useImageStore = defineStore('images', {
    actions: {
        async getImages($supabase: SupabaseClient): Promise<void> {
            this.images = await getAllImages({ $supabase });
        },
    },
    getters: {
        imagesById(): { [id: string]: StoreImage } {
            return this.imagesLoop.reduce((accumulator: { [id: string]: StoreImage }, image: StoreImage): { [id: string]: StoreImage } => {
                accumulator[image.id] = image;

                return accumulator;
            }, {});
        },
        imagesLoop(): StoreImage[] {
            const tagsStore = useTagsStore();

            const {
                filteredTags,
                tagsByImageId,
            } = tagsStore;

            return this.images.map((image: Image): StoreImage => ({
                ...image,
                tags: tagsByImageId[image.id],
            })).filter((image: StoreImage) => {
                if (filteredTags.length === 0) {
                    return true;
                }

                return image.tags.some(({ id }) => filteredTags.includes(id));
            });
        },
    },
    state: (): { images: Image[] } => ({ images: [] }),
});
