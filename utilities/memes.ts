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
