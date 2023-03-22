import Cookies, { CookieAttributes } from 'js-cookie';

import { $auth } from '@/api/supabase';

const cookieSettings: CookieAttributes = { sameSite: 'strict' };

$auth.onAuthStateChange((event, session) => {
	console.log({
		event,
		session,
	});

	if ([
		'SIGNED_OUT',
		'USER_DELETED',
	].includes(event)) {
		const expires = new Date(0);

		Cookies.set('access-token', session?.access_token || '', {
			...cookieSettings,
			expires,
		});

		Cookies.set('refresh-token', session?.refresh_token || '', {
			...cookieSettings,
			expires,
		});
	} else if ([
		'SIGNED_IN',
		'TOKEN_REFRESHED',
	].includes(event)) {
		const expires = new Date();
		expires.setFullYear(expires.getFullYear() + 100);

		Cookies.set('access-token', session?.access_token || '', {
			...cookieSettings,
			expires,
		});

		Cookies.set('refresh-token', session?.refresh_token || '', {
			...cookieSettings,
			expires,
		});
	}
});
