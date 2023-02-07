<template>
	<button
		type="button"
		class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
		:disabled="loading"
		@click="handleSignIn"
	>
		<template v-if="loading">
			<svg
				class="w-4 h-4 mr-2 -ml-1 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
				role="img"
				width="32"
				height="32"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 16 16"
			><path
				fill="currentColor"
				d="M16 8a7.917 7.917 0 0 0-2.431-5.568A7.776 7.776 0 0 0 5.057.896c-.923.405-1.758.992-2.449 1.712S1.371 4.182 1.011 5.105a7.531 7.531 0 0 0 .115 5.742c.392.892.961 1.7 1.658 2.368S4.307 14.41 5.2 14.758a7.286 7.286 0 0 0 2.799.493a7.157 7.157 0 0 0 6.526-4.547a6.98 6.98 0 0 0 .415-1.622l.059.002a1 1 0 0 0 .996-1.083h.004zm-1.589 2.655c-.367.831-.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434a6.759 6.759 0 0 1-2.608.454a6.676 6.676 0 0 1-4.685-2.065a6.597 6.597 0 0 1-1.38-2.173a6.514 6.514 0 0 1 .116-4.976c.342-.77.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c.771-.298 1.596-.438 2.416-.416s1.629.202 2.368.532c.74.329 1.41.805 1.963 1.387s.988 1.27 1.272 2.011a6.02 6.02 0 0 1 .397 2.32h.004a1 1 0 0 0 .888 1.077a6.872 6.872 0 0 1-.481 1.578z"
			/>
			</svg>
		</template>
		<template v-else>
			<svg
				class="w-4 h-4 mr-2 -ml-1"
				aria-hidden="true"
				focusable="false"
				data-prefix="fab"
				data-icon="github"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 496 512"
			>
				<path
					fill="currentColor"
					d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
				/>
			</svg>
		</template>
		<span class="grid place-items-center">
			<span
				class="col-[1/-1] row-[1/-1] invisible"
				aria-hidden="true"
			>Sign in with GitHub</span>
			<span
				v-if="loading"
				class="col-[1/-1] row-[1/-1]"
			>Please wait...</span>
			<span
				v-else
				class="col-[1/-1] row-[1/-1]"
			>Sign in with GitHub</span>
		</span>
	</button>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { ref } from 'vue';

const loading = ref<boolean>(false);

const handleSignIn = async (): Promise<void> => {
	try {
		loading.value = true;

		// await login();

		// const { error } = await properties.supabase.auth.signInWithOAuth({
		// 	provider: 'github',
		// 	options: {
		// 		redirectTo: `${
		// 			import.meta.env.NETLIFY_DEV ? 'http://localhost:4449' : 'https://zure-memes.netlify.app'
		// 		}/loading`,
		// 	},
		// });

		if (error) {
			throw error;
		}
	} catch ({ message }) {
		console.log({ message });
	}
};
</script>
