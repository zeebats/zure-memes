// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser();

    if (!user.value) {
        return navigateTo('/login');
    }
});
