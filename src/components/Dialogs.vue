<template>
	<dialog
		v-for="{ id, image } in $dialogs"
		:key="id"
		ref="dialog"
		class="dialog grid gap-y-4 p-8 m-auto max-w-2xl"
		@close="handleClose(id)"
	>
		<FormAdd
			:edit="image"
			@added="handleClose(id)"
		/>
	</dialog>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { ref } from 'vue';

import FormAdd from '@/components/form/Add.vue';
import {
	DialogBase,
	DialogProperties,
	dialogs,
	remove as removeDialog,
} from '@/store/dialogs';

const $dialogs = useStore(dialogs);

const dialog = ref<HTMLDialogElement>();

// onMounted((): void => {
// 	if (dialog.value?.open) {
// 		return;
// 	}

// 	dialog.value?.showModal();
// });

const handleClose = (id: DialogBase['id']): void => {
	removeDialog(id);
};
</script>

<style lang="postcss">
.dialog {
	height: min(100% - 2rem, auto);
	width: min(100% - 2rem, 42rem);

	&::backdrop {
		background-color: rgb(0 0 0 / 75%);
	}
}
</style>
