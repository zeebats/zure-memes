import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';
import {
    extendedMatch,
    Fzf,
    FzfOptions,
    FzfResultItem,
} from 'fzf';

import { Tag } from '@/utilities/tags';

export interface Image {
    id: number;
    title: string;
    url: string;
}

export interface ImageSearchable extends Image {
    tags: Tag[]
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

export const filterImages = ({
    images,
    search,
} : {
    images: ImageSearchable[]
    search: string;
}) : ImageSearchable[] => {
    const options: FzfOptions<ImageSearchable> = {
        match: extendedMatch,
        selector: image => {
            const concat = `${image.title} ${image.tags.map(tag => tag.name).join(' ')}}`;

            return concat;
        },
    };

    const fzf = new Fzf<ImageSearchable[]>(images, options);

    const matches: FzfResultItem<ImageSearchable>[] = fzf.find(search); // eslint-disable-line unicorn/no-array-callback-reference

    return matches.map(({ item }): ImageSearchable => item);
};
