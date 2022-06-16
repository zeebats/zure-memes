import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { getAllMemes, Meme } from '@/utilities/memes';

export const useMemesStore = defineStore('memes', {
    actions: {
        async getMemes($supabase: SupabaseClient): Promise<void> {
            this.memes = await getAllMemes({ $supabase });
        },
        upsert(modifiedMemes: Meme[]): void {
            for (const modifiedMeme of modifiedMemes) {
                const arrayID = this.memes.findIndex((original: Meme): boolean => original.id === modifiedMeme.id);

                if (arrayID > 0) {
                    this.memes[arrayID] = modifiedMeme;

                    continue;
                }

                this.memes.push(modifiedMeme);
            }
        },
    },
    getters: {
        largestMemeID(): number {
            return this.memes.reduce((accumulator: number, meme: Meme): number => {
                if (accumulator > meme.id) {
                    return accumulator;
                }

                return meme.id;
            }, 0);
        },
        memesByImageId(): { [image_id: number]: Meme } {
            return this.memes.reduce((accumulator: Meme[], item: Meme): Meme[] => {
                accumulator[item.image_id] = item;

                return accumulator;
            }, {});
        },
        memesByMemeId(): { [id: number]: Meme } {
            return this.memes.reduce((accumulator: Meme[], item: Meme): Meme[] => {
                accumulator[item.id] = item;

                return accumulator;
            }, {});
        },
        memesByTagId(): { [tag_id: number]: Meme } {
            return this.memes.reduce((accumulator: Meme[], item: Meme): Meme[] => {
                accumulator[item.tag_id] = item;

                return accumulator;
            }, {});
        },
    },
    state: (): { memes: Meme[] } => ({ memes: [] }),
});
