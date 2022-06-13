<template>
    <div class="grid min-h-screen place-content-center">
        <button type="button" class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" @click="auth.signIn({ provider: 'github' })">Sign in with GitHub</button>
    </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const { auth } = useSupabaseClient()

watchEffect((): void => {
    if (user.value) {
        navigateTo('/')
    }
})
</script>
