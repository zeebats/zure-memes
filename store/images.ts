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
        upsert(modified: Image): void {
            const arrayID = this.images.findIndex((original: StoreImage): boolean => original.id === modified.id);

            if (arrayID > -1) {
                this.images[arrayID] = modified;

                return;
            }

            this.images = [
                modified,
                ...this.images,
            ];
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
        largestImageID(): number {
            return this.images.reduce((accumulator: number, image: StoreImage): number => {
                if (accumulator > image.id) {
                    return accumulator;
                }

                return image.id;
            }, 0);
        },
    },
    state: (): { images: Image[] } => ({ images: [] }),
});
