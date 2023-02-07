import { nanoid } from 'nanoid';
import { action, atom, computed } from 'nanostores';

export interface DialogBase {
    callback?: () => void;
    id: string;
}

export interface DialogProperties {
    image?: number;
}

export interface Dialog extends DialogBase, DialogProperties {}

export const dialogs = atom<Dialog[]>([]);

export const dialogsById = computed(dialogs, dialogs => Object.fromEntries(dialogs.map(dialog => [
	dialog.id,
	dialog,
])));

export const create = action(dialogs, 'create', (store, properties: DialogProperties) => {
	const id = nanoid();

	let condition = false;

	store.set([
		...store.get(),
		{
			id,
			...properties,
			callback() {
				condition = !condition;
			},
		},
	]);

	return new Promise(resolve => {
		const polling = setInterval(() => {
			if (!condition) {
				return;
			}

			clearInterval(polling);

			resolve(id);
		}, 10);
	});
});

export const remove = action(dialogs, 'delete', (store, id: DialogBase['id']) => {
	store.set(store.get().filter((dialog: Dialog): boolean => dialog.id !== id));
});
