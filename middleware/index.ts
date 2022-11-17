// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware(() => {
	const user = useSupabaseUser();

	console.log({
		middleware: 'index',
		user,
	});

	if (!user.value) {
		return navigateTo('/login');
	}
});
