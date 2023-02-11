import Cookies, { CookieAttributes } from 'js-cookie';

import { $auth } from '@/api/supabase';

const ids = [
	'access_token',
	'refresh_token',
] as const;

const cookieSettings: CookieAttributes = {
	sameSite: 'strict',
	secure: !import.meta.env.DEV,
};

$auth.onAuthStateChange((event, session) => {
	if ([
		'SIGNED_OUT',
		'USER_DELETED',
	].includes(event)) {
		const expires = new Date(0);

		for (const id of ids) {
			Cookies.set(id, session?.[id] || '', {
				...cookieSettings,
				expires,
			});
		}
	} else if ([
		'SIGNED_IN',
		'TOKEN_REFRESHED',
	].includes(event)) {
		const expires = new Date();
		expires.setFullYear(expires.getFullYear() + 100);

		for (const id of ids) {
			Cookies.set(id, session?.[id] || '', {
				...cookieSettings,
				expires,
			});
		}
	}
});
