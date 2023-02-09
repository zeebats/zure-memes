<template>
	<dialog
		ref="dialog"
		class="dialog grid gap-y-4 p-8 m-auto max-w-2xl"
		@close="handleClose"
	>
		<slot />
	</dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
    (e: 'close'): void; /* eslint-disable-line unicorn/prevent-abbreviations, no-unused-vars */
}>();

const dialog = ref<HTMLDialogElement>();

onMounted(() => {
	if (dialog.value?.open) {
		return;
	}

	dialog.value?.showModal();
});

const handleClose = () => {
	emit('close');
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
