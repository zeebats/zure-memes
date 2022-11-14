import { createClient } from '@supabase/supabase-js';
import { action, map } from 'nanostores';

const {
	SUPABASE_KEY,
	SUPABASE_URL,
} = import.meta.env;

console.log({
	SUPABASE_KEY,
	SUPABASE_URL,
	all: import.meta.env,
});

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export type Login = {
	user: unknown | null
}

export const auth = map<Login>({ user: null });

export const login = action(auth, 'login', async store => {
	console.log({
		client,
		store,
	});

	const { provider } = store.get();

	return;

	const response = await useLambda('rss', { provider });
	const items = await response.json();

	console.log({
		items,
		provider,
	});

	store.set({
		...store.get(),
		items: {
			...store.get().items,
			[provider]: [
				...items,
				// ...store.get()[provider],
			],
		},
	});
});
