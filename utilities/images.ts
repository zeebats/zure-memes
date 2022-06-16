import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';

export interface Image {
    id: number;
    title: string;
    url: string;
}

export const queryImages = ({ $supabase }: { $supabase: SupabaseClient }): SupabaseQueryBuilder<Image> => $supabase.from<Image>('images');

export const getAllImages = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<Image[]> => {
    const {
        data: images,
        error,
    } = await queryImages({ $supabase })
        .select()
        .order('id', { ascending: false });

    if (error) {
        throw error;
    }

    return images;
};

export const getImages = async ({
    $supabase,
    imageIds,
}: {
    $supabase?: SupabaseClient,
    imageIds: number[]
}): Promise<Image[]> => {
    const {
        data: images,
        error,
    } = await queryImages({ $supabase })
        .select()
        .in('id', imageIds)
        .order('id', { ascending: false });

    if (error) {
        throw error;
    }

    return images;
};
