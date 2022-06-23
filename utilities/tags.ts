import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';
import { Fzf, FzfOptions, FzfResultItem } from 'fzf';

export interface Tag {
    id: number;
    name: string;
}

export const queryTags = ({ $supabase }: { $supabase: SupabaseClient }): SupabaseQueryBuilder<Tag> => $supabase.from<Tag>('tags');

export const filterTags = ({
    query,
    tags,
} : {
    query: string;
    tags: Tag[]
}) => {
    const options: FzfOptions<Tag> = { selector: item => `${item.name}` };

    const fzf = new Fzf<Tag[]>(tags, options);

    // eslint-disable-next-line unicorn/no-array-callback-reference
    const matches: FzfResultItem<Tag>[] = fzf.find(query);

    return matches.map(({ item }): number => item.id);
};

// eslint-disable-next-line max-statements
export const getTags = async ({
    $supabase,
    query,
}: {
    $supabase: SupabaseClient,
    query: string
}): Promise<number[]> => {
    const {
        data: tags,
        error,
    } = await queryTags({ $supabase })
        .select('id, name');

    if (error) {
        throw error;
    }

    return filterTags({
        query,
        tags,
    });
};

export const getAllTags = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<Tag[]> => {
    const {
        data: tags,
        error,
    } = await queryTags({ $supabase }).select();

    if (error) {
        throw error;
    }

    return tags;
};
