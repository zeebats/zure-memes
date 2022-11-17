import type { RouterOptions } from '@nuxt/schema';

export default <RouterOptions> {
	scrollBehavior(to, from, savedPosition) {
		console.log({
			to,
			from,
			savedPosition,
		});
	},
};
