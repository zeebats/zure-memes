<template>
    <dialog
        ref="dialog"
        class="dialog grid gap-y-4 p-8 w-full max-w-2xl"
        @close="handleClose"
    >
        <FormAdd
            :edit="properties.properties.image"
            @added="handleAdded"
        />
    </dialog>
</template>

<script setup lang="ts">
import { DialogBase, DialogProperties, useDialogStore } from '@/store/dialog';

const properties = withDefaults(defineProps<{
    id: DialogBase['id'];
    properties: DialogProperties;
}>(), {
    id: null,
    properties: null,
});

const dialogStore = useDialogStore();

const dialog = ref<null | HTMLDialogElement>(null);

onMounted((): void => {
    if (dialog.value.open) {
        return;
    }

    dialog.value.showModal();
});

const handleClose = (): void => {
    dialogStore.delete({ id: properties.id });
};

const handleAdded = (): void => {
    handleClose();
};
</script>

<style>
.dialog::backdrop {
    background-color: rgb(0 0 0 / 0.75);
}
</style>
