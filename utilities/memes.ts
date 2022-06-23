import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';

export interface Meme {
    id: number;
    image_id: number;
    tag_id: number;
}

export const queryMemes = ({ $supabase }: { $supabase: SupabaseClient }): SupabaseQueryBuilder<Meme> => $supabase.from<Meme>('memes');

export const getAllMemes = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<Meme[]> => {
    const {
        data: memes,
        error,
    } = await queryMemes({ $supabase }).select();

    if (error) {
        throw error;
    }

    return memes;
};

export const getMemes = async ({
    $supabase,
    tagIds,
}: {
    $supabase: SupabaseClient,
    tagIds: number[]
}): Promise<number[]> => {
    const {
        data: memes,
        error,
    } = await queryMemes({ $supabase })
        .select('image_id')
        .in('tag_id', tagIds);

    if (error) {
        throw error;
    }

    // eslint-disable-next-line camelcase
    return memes.reduce((accumulator: number[], { image_id }: Meme): number[] => {
        if (!accumulator.includes(image_id)) {
            accumulator.push(image_id);
        }

        return accumulator;
    }, []);
};
