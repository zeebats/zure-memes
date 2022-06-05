import { readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';

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
