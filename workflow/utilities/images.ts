import { readFile, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import sharp from 'sharp';

import { Image, queryImages } from '@/utilities/images';
import { createFilename } from '@/workflow/utilities/string';

export const downloadImagesJSON = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void> => {
    const {
        data: images,
        error,
    } = await queryImages({ $supabase });

    if (error) {
        throw error;
    }

    return writeFile('./.cache/images.json', JSON.stringify(images));
};

export const downloadImages = async ({ $supabase }: { $supabase: SupabaseClient }): Promise<void[]> => {
    const {
        data: images,
        error,
    } = await queryImages({ $supabase }).select('url');

    if (error) {
        throw error;
    }

    return Promise.all(
        images.map(async ({ url }): Promise<void> => {
            const request = await fetch(url);
            const arrayBuffer = await request.arrayBuffer();
            const image = Buffer.from(new Uint8Array(arrayBuffer));

            sharp(image)
                .resize(128, 128, {
                    background: {
                        alpha: 0,
                        b: 0,
                        g: 0,
                        r: 0,
                    },
                    fit: 'contain',
                })
                .toFile(`./.cache/images/${createFilename(url)}`);
        }),
    );
};

export const getImages = async ({ imageIds }: { imageIds: number[] }): Promise<Omit<Image, 'id'>[]> => {
    const local = await readFile('./.cache/images.json', { encoding: 'utf8' });

    let images: Image[] = JSON.parse(local);

    images = images.filter(image => imageIds.includes(image.id));

    return images.map(({
        title,
        url,
    }): Omit<Image, 'id'> => ({
        title,
        url,
    }));
};
