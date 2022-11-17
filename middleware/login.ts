// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware(() => {
	const user = useSupabaseUser();

	console.log({
		middleware: 'login',
		user,
	});

	if (user.value) {
		return navigateTo('/loading');
	}
});
