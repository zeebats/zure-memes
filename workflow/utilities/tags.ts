import { readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

import { Image } from '@/utilities/images';
import { Meme } from '@/utilities/memes';
import { filterTags, queryTags, Tag } from '@/utilities/tags';

export const downloadTagsJSON = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void> => {
    const {
        data: tags,
        error,
    } = await queryTags({ $supabase });

    if (error) {
        throw error;
    }

    return writeFile('./.cache/tags.json', JSON.stringify(tags));
};

export const getTags = async ({ query }: { query: string }): Promise<number[]> => {
    const local = await readFile('./.cache/tags.json', { encoding: 'utf8' });

    const tags: Tag[] = JSON.parse(local);

    return filterTags({
        query,
        tags,
    });
};

export const getTagsStringForImageId = async ({ id } : { id: Image['id'] }): Promise<string> => {
    const tagsRaw = await readFile('./.cache/tags.json', { encoding: 'utf8' });
    const memesRaw = await readFile('./.cache/memes.json', { encoding: 'utf8' });

    const tags: Tag[] = JSON.parse(tagsRaw);
    const memes: Meme[] = JSON.parse(memesRaw);

    const foundMemes = memes.filter(meme => meme.image_id === id);
    const foundTags = foundMemes.map(meme => tags.find(tag => tag.id === meme.tag_id)?.name);

    return `Tags: ${foundTags.join(', ')}`;
};
