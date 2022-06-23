import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { useTagsStore } from '@/store/tags';
import { getAllImages, Image } from '@/utilities/images';

export const useImageStore = defineStore('images', {
    actions: {
        async getImages($supabase: SupabaseClient): Promise<void> {
            this.images = await getAllImages({ $supabase });
        },
        upsert(modified: Image): void {
            const arrayID = this.images.findIndex((original: Image): boolean => original.id === modified.id);

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
        imagesById(): { [id: string]: Image } {
            return Object.fromEntries(this.images.map(image => [
                image.id,
                image,
            ]));
        },
        imagesLoop(): Image[] {
            const tagsStore = useTagsStore();

            const {
                filteredTags,
                tagsByImageId,
            } = tagsStore;

            return this.images.filter((image: Image): boolean => {
                if (filteredTags.length === 0) {
                    return false;
                }

                if (filteredTags.every(tag => tag === -1)) {
                    return true;
                }

                return tagsByImageId[image.id].some(({ id }): boolean => filteredTags.includes(id));
            });
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
    state: (): { images: Image[] } => ({ images: [] }),
});
