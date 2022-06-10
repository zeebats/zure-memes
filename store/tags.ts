/* eslint-disable camelcase */

import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { useMemesStore } from '@/store/memes';
import { filterTags, getAllTags, Tag } from '@/utilities/tags';
import { getColor } from '~~/utilities/color';

export interface StoreTag extends Tag {
    color: {
        foreground: string;
        background: string;
    },
}

export const useTagsStore = defineStore('tags', {
    actions: {
        async getTags($supabase: SupabaseClient): Promise<void> {
            this.tags = await getAllTags({ $supabase });
        },
        modifyQuery(query: string): void {
            this.query = query;
        },
    },
    getters: {
        filteredTags(): number[] {
            if (!this.query) {
                return [];
            }

            return filterTags({
                query: this.query,
                tags: this.tags,
            });
        },
        tagnamesByImageId(): { [id: string]: string[] } {
            return Object.entries(this.tagsByImageId).reduce((accumulator, [
                image_id,
                tags,
            ]) => {
                accumulator[image_id] = (tags as Tag[]).map(({ name }: Tag): string => name);

                return accumulator;
            }, {});
        },
        tagsById(): { [id: string]: StoreTag[] } {
            return this.tags.reduce((accumulator: StoreTag[], item: Tag): StoreTag[] => {
                accumulator[item.id] = {
                    ...item,
                    color: getColor(item.name),
                };

                return accumulator;
            }, {});
        },
        tagsByImageId(): { [id: string]: StoreTag[] } {
            const memesStore = useMemesStore();

            const { memesByMemeId } = memesStore;

            return Object.values(memesByMemeId).reduce((accumulator, {
                image_id,
                tag_id,
            }) => {
                if (!Object.keys(accumulator).includes(`${image_id}`)) {
                    accumulator[image_id] = [];
                }

                accumulator[image_id].push(this.tagsById[tag_id]);

                return accumulator;
            }, {});
        },
    },
    state: (): {
        query: string,
        tags: Tag[]
    } => ({
        query: null,
        tags: [],
    }),
});
