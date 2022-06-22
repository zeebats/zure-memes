/* eslint-disable camelcase */

import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { useMemesStore } from '@/store/memes';
import { getColor } from '@/utilities/color';
import { filterTags, getAllTags, Tag } from '@/utilities/tags';

export interface StoreTag extends Tag {
    color: {
        foreground: string;
        background: string;
    },
}

export const useTagsStore = defineStore('tags', {
    actions: {
        async getTags($supabase: SupabaseClient): Promise<void> {
            const tags = await getAllTags({ $supabase });

            this.tags = tags.map(tag => ({
                ...tag,
                color: getColor(tag.name),
            }));
        },
        modifyQuery(query: string): void {
            this.query = query;
        },
        upsert(modifiedTags: Tag[]): void {
            for (const modifiedTag of modifiedTags) {
                const arrayID = this.tags.findIndex(({ id }: StoreTag): boolean => id === modifiedTag.id);

                const tagWithColor = {
                    ...modifiedTag,
                    color: getColor(modifiedTag.name),
                };

                if (arrayID > 0) {
                    this.tags[arrayID] = tagWithColor;

                    continue;
                }

                this.tags.push(tagWithColor);
            }
        },
    },
    getters: {
        filteredTags(): number[] {
            if (!this.query) {
                return [-1];
            }

            return filterTags({
                query: this.query,
                tags: this.tags,
            });
        },
        largestTagID(): number {
            return Math.max(...this.tags.map(tag => tag.id));
        },
        tagsById(): { [id: string]: StoreTag } {
            return Object.fromEntries(this.tags.map(tag => [
                tag.id,
                tag,
            ]));
        },
        tagsByImageId(): { [id: number]: StoreTag[] } {
            const memesStore = useMemesStore();

            const { memes } = memesStore;

            return Object.fromEntries(memes.map(meme => [
                meme.image_id,
                memes.filter(item => item.image_id === meme.image_id).map(item => this.tagsById[item.tag_id]),
            ]));
        },
        tagsByName(): { [name: string]: StoreTag } {
            return Object.fromEntries(this.tags.map(tag => [
                tag.name,
                tag,
            ]));
        },
    },
    state: (): {
        query: string,
        tags: StoreTag[]
    } => ({
        query: '',
        tags: [],
    }),
});
