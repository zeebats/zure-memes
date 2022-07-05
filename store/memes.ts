import { SupabaseClient } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

import { getAllMemes, Meme } from '@/utilities/memes';

export const useMemesStore = defineStore('memes', {
	actions: {
		async init($supabase: SupabaseClient): Promise<void> {
			this.memes = await getAllMemes({ $supabase });
		},
		upsert(modifiedMemes: Meme[]): void {
			for (const modifiedMeme of modifiedMemes) {
				const arrayID = this.memes.findIndex((original: Meme): boolean => original.id === modifiedMeme.id);

				if (arrayID > 0) {
					this.memes[arrayID] = Object.freeze(modifiedMeme);

					continue;
				}

				this.memes.push(Object.freeze(modifiedMeme));
			}
		},
	},
	getters: {
		largestMemeID(): number {
			return Math.max(...this.memes.map(meme => meme.id));
		},
	},
	state: (): { memes: Meme[] } => ({ memes: [] }),
});
