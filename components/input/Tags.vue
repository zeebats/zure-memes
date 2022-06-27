<template>
    <label
        for="tags"
        class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >
        Tags:
        <span class="grid gap-y-2 flex-grow">
            <input
                id="tags"
                v-bind="$attrs"
                v-model.trim="model"
                autocapitalize="none"
                autocorrect="off"
                class="text-base appearance-none border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
                spellcheck="false"
                type="text"
                :class="[
                    disabled && 'bg-gray-200',
                    !disabled && 'bg-gray-50',
                ]"
                :disabled="disabled"
            >
            <span class="text-xs grid gap-y-2">
                <p>Optional, should be comma seperated: <code class="inline-block">`tag,tag,tag`</code></p>
                <p
                    v-if="containsSpaces"
                    class="text-yellow-600"
                >Beware: one of your tags contains spaces. This is fine, but the only seperator for multiple tags is a comma. <code class="inline-block">`foo bar, qux`</code> will yield two tags: <code class="inline-block">`foo bar`</code> & <code class="inline-block">`qux`</code></p>
            </span>
        </span>
    </label>
</template>

<script setup lang="ts">
const properties = withDefaults(defineProps<{
    modelValue: string;
    disabled: boolean;
}>(), {
    modelValue: undefined, /* eslint-disable-line no-undefined */
    disabled: false,
});

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'update:modelValue', value: string): string;
}>();

const model = computed({
    get(): string {
        return properties.modelValue;
    },
    set(value): void {
        emit('update:modelValue', value);
    },
});

const containsSpaces = computed((): boolean => (/\s/g).test(model.value));
</script>

<script lang="ts">
export default { inheritAttrs: false };
</script>
