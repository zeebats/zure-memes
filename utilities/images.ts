import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';

export interface Image {
    id: number;
    title: string;
    url: string;
}

export const queryImages = ({ $supabase }: { $supabase: SupabaseClient }): SupabaseQueryBuilder<Image> => $supabase.from<Image>('images');

export const getImages = async ({
    $supabase,
    imageIds,
}: {
    $supabase?: SupabaseClient,
    imageIds: number[]
}): Promise<Omit<Image, 'id'>[]> => {
    const {
        data: images,
        error,
    } = await queryImages({ $supabase })
        .select('url, title')
        .in('id', imageIds)
        .order('id', { ascending: false });

    if (error) {
        throw error;
    }

    return images.map(({
        title,
        url,
    }): Omit<Image, 'id'> => ({
        title,
        url,
    }));
};
