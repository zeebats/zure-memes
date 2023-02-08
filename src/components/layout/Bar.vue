<template>
	<div
		class="flex items-baseline gap-x-4 sticky pt-4 px-4 bg-white relative z-1"
		:class="[
			$style['form'],
			$keyboard && $style['is-keyboard'],
		]"
	>
		<label
			for="search"
			class="flex flex-grow gap-x-4 items-baseline text-sm font-medium text-gray-900 dark:text-gray-300"
		>
			<span class="sr-only">Your search query</span>
			<input
				id="search"
				v-model.trim="$search"
				type="search"
				autocapitalize="none"
				autocorrect="off"
				spellcheck="false"
				class="text-base appearance-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
				placeholder="Search for meme's"
			>
		</label>
		<Button
			class="text-black bg-primary-500 hover:bg-primary-600 focus:ring-primary-700 dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-600"
			@click="handleAdd"
		>
			Add
		</Button>
		<Dialog
			v-if="dialog"
			@close="handleClose"
		>
			<FormAdd @added="handleClose" />
		</Dialog>
	</div>
</template>

<script setup>
import { useStore, useVModel } from '@nanostores/vue';
import { ref } from 'vue';

import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import FormAdd from '@/components/form/Add.vue';
import { keyboard } from '@/store/device';
import { search } from '@/store/images';

const $search = useVModel(search);
const $keyboard = useStore(keyboard);

const dialog = ref(false);

const handleAdd = () => {
	dialog.value = true;
};

const handleClose = () => {
	dialog.value = false;
};
</script>

<style module lang="postcss">
.form {
	grid-area: form;

	@apply top-0 pb-4;

	@media (hover: none) {
		padding-bottom: calc(1rem + var(--saib));

		@apply top-auto bottom-0;

		&.is-keyboard {
			transform: translateY(var(--saib));
		}
	}
}
</style>
