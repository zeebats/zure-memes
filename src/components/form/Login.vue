<template>
	<form
		novalidate
		class="grid w-screen max-w-128 p-4 gap-y-6"
		@submit.prevent="handleSubmit"
	>
		<div class="grid gap-y-2 text-sm">
			<label
				for="email"
				class="block font-medium text-gray-900 dark:text-white"
			>Your email</label>
			<p
				v-for="{ $message, $uid } of v$.emailAddress.$errors"
				:key="$uid"
				class="text-red-600"
			>
				{{ $message }}
			</p>
			<input
				id="email"
				v-model="v$.emailAddress.$model"
				type="email"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="name@flowbite.com"
				required
				@blur="v$.emailAddress.$commit"
			>
		</div>
		<div class="grid gap-y-2 text-sm">
			<label
				for="password"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>Your password</label>
			<p
				v-for="{ $message, $uid } of v$.password.$errors"
				:key="$uid"
				class="text-red-600"
			>
				{{ $message }}
			</p>

			<input
				id="password"
				v-model="v$.password.$model"
				type="password"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				required
				@blur="v$.password.$commit"
			>
		</div>
		<Button
			type="submit"
			class="text-black bg-primary-500 hover:bg-primary-600 focus:ring-primary-700 dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-600"
		>
			Log in
		</Button>
		<p
			v-if="$error"
			class="text-sm text-red-600"
		>
			{{ $error }}
		</p>
	</form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { ref } from 'vue';

import { $auth } from '@/api/supabase';
import Button from '@/components/Button.vue';

const loading = ref<boolean>(false);

const emailAddress = ref<string>('');
const password = ref<string>('');

const $error = ref<string | unknown>('');

const v$ = useVuelidate({
	emailAddress: {
		email: helpers.withMessage('This should be an e-mailaddress', email),
		required: helpers.withMessage('This can\'t be empty, please enter something', required),
	},
	password: { required: helpers.withMessage('This can\'t be empty, please enter something', required) },
}, {
	emailAddress,
	password,
}, { $rewardEarly: true });

// eslint-disable-next-line max-statements
const handleSubmit = async () => {
	try {
		if (!await v$.value.$validate()) {
			v$.value.$commit();

			return;
		}

		loading.value = true;

		const {
			data,
			error,
		} = await $auth.signInWithPassword({
			email: emailAddress.value,
			password: password.value,
		});

		if (error) {
			throw error;
		}

		v$.value.$reset();

		loading.value = false;

		const maxAge = 100 * 365 * 24 * 60 * 60;

		await window.cookieStore.set({
			name: 'access',
			value: data.session?.access_token || '',
			maxAge,
			SameSite: 'Lax',
			secure: true,
		});
		await window.cookieStore.set({
			name: 'refresh',
			value: data.session?.refresh_token || '',
			maxAge,
			SameSite: 'Lax',
			secure: true,
		});

		window.location.pathname = '/';
	} catch (error) {
		$error.value = error;
	}
};
</script>
