import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

import { getRandomBetween } from '@/utilities/random';

extend([a11yPlugin]);

/* eslint-disable perfectionist/sort-objects */
export const seededRandomColor = (seed: string) => colord({
	h: getRandomBetween({
		seed,
		min: 0,
		max: 360,
	}),
	s: getRandomBetween({
		seed,
		min: 75,
		max: 100,
	}),
	l: getRandomBetween({
		seed,
		min: 50,
		max: 100,
	}),
});
/* eslint-enable perfectionist/sort-objects */

export const getColor = (seed: string) => {
	const background = seededRandomColor(seed).toRgbString();
	const foreground = colord(colord(background).isReadable() ? '#fff' : '#000').toHslString();

	return {
		background,
		foreground,
	};
};
