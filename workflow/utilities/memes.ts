import { readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { Meme, queryMemes } from '@/utilities/memes';

export const downloadMemesJSON = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void> => {
    const {
        data: memes,
        error,
    } = await queryMemes({ $supabase });

    if (error) {
        throw error;
    }

    return writeFile('./.cache/memes.json', JSON.stringify(memes));
};

export const getMemes = async ({ tagIds }: { tagIds: number[] }): Promise<number[]> => {
    const local = await readFile('./.cache/memes.json', { encoding: 'utf8' });

    let memes: Meme[] = JSON.parse(local);

    memes = memes.filter(meme => tagIds.includes(meme.tag_id));

    // eslint-disable-next-line camelcase
    return memes.reduce((accumulator: number[], { image_id }: Meme): number[] => {
        if (!accumulator.includes(image_id)) {
            accumulator.push(image_id);
        }

        return accumulator;
    }, []);
};
