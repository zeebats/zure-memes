import { createClient } from '@supabase/supabase-js';

import { getImages } from '@/workflow/utilities/images';
import { createFilename } from '@/workflow/utilities/string';
import { performUpdate } from '@/workflow/utilities/update';

const $supabase = createClient(
	'https://qqjjgrbvxjioapiqdlza.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxampncmJ2eGppb2FwaXFkbHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQwODUzOTUsImV4cCI6MTk2OTY2MTM5NX0.jc6Fe6A6wmgLxD5clHu2h0-1PxzUjJsj-cx2aGqOtjE',
);

(async (): Promise<void> => {
	try {
		await performUpdate({ $supabase });

		const images = await getImages({ search: process.argv[2]?.trim() });

		// eslint-disable-next-line no-console
		console.log(JSON.stringify({
			items: images.map(({
				tags,
				title,
				url,
			}) => ({
				arg: url,
				icon: { path: `./.cache/images/${createFilename(url)}.jpg` },
				subtitle: tags,
				title,
			}),
			),
		}, null, '\t'));
	} catch ({ message }) {
		// eslint-disable-next-line no-console
		console.log(JSON.stringify({
			items: [
				{
					icon: { path: '4DF77DA7-5A1D-45D0-B64B-D90E14411492.png' },
					subtitle: message,
					title: '🛑 error, my bro',
				},
			],
		}, null, '\t'));
	}
})();
