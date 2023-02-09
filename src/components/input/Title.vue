<template>
	<label
		for="title"
		class="flex flex-grow gap-x-4 items-baseline mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
	>
		Title:
		<span class="grid gap-y-2 flex-grow">
			<input
				id="title"
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
				@blur="validation.$commit"
			>
			<span class="text-xs grid gap-y-2">
				<p
					v-for="{ $message, $uid } of validation.$errors"
					:key="$uid"
					class="text-red-600"
				>
					{{ $message }}
				</p>
			</span>
		</span>
	</label>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed } from 'vue';

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
	get() {
		return properties.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});

const rules = computed(() => ({
	model: {
		$autoDirty: true,
		$lazy: true,
		required: helpers.withMessage('This can\'t be empty, please enter something', required),
	},
}));

const v$ = useVuelidate(rules, { model }, { $rewardEarly: true });

const validation = computed(() => v$.value.model);
</script>

<script lang="ts">
export default { inheritAttrs: false };
</script>
