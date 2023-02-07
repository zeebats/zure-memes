import { exec } from 'node:child_process';
import { readFile, unlink, writeFile } from 'node:fs/promises';

import { SupabaseClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

import { filterImages, Image, queryImages } from '@/utilities/images';
import { createFilename } from '@/workflow/utilities/string';
import { getTagsForImageId } from '@/workflow/utilities/tags';

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
		// eslint-disable-next-line max-statements
		images.map(async ({ url }): Promise<void> => {
			const fileURL = new URL(url);

			if (fileURL.host === 'cdn.discordapp.com') {
				fileURL.host = 'media.discordapp.net';
			}

			if (fileURL.host === 'media.discordapp.net') {
				fileURL.searchParams.set('width', '128');
				fileURL.searchParams.set('height', '128');
			}

			const request = await fetch(fileURL.href);
			const arrayBuffer = await request.arrayBuffer();
			const image = Buffer.from(new Uint8Array(arrayBuffer));

			const filename = `./.cache/images/${createFilename(url)}`;

			await writeFile(filename, image);

			const command = [
				'sips',
				'-z 128 128',
				'-s format jpeg',
				filename,
				`--out ${filename}.jpg`,
			];

			exec(command.join(' '), error => {
				if (error) {
					throw error;
				}

				unlink(filename);
			});
		}),
	);
};

export const getImages = async ({ search }: { search: string }) => {
	const local = await readFile('./.cache/images.json', { encoding: 'utf8' });

	const images: Image[] = JSON.parse(local);

	const prepared = await Promise.all(images.map(async image => ({
		...image,
		tags: await getTagsForImageId({ id: image.id }),
	})));

	const filtered = filterImages({
		images: prepared,
		search,
	});

	return filtered.map(image => ({
		...image,
		tags: `Tags: ${image.tags.map(tag => tag.name).join(', ')}`,
	}));
};
