import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';

export interface DialogBase {
    callback?: () => void;
    id: string;
}

export interface DialogProperties {
    image: number;
}

export interface Dialog extends DialogBase, DialogProperties {}

export const useDialogStore = defineStore('dialogs', {
    actions: {
        create(properties: DialogProperties): Promise<unknown> {
            const id = nanoid();

            let condition = false;

            this.dialogs.push({
                id,
                ...properties,
                callback(): void {
                    condition = !condition;
                },
            });

            return new Promise(resolve => {
                const polling = setInterval((): void => {
                    if (!condition) {
                        return;
                    }

                    clearInterval(polling);

                    resolve(id);
                }, 10);
            });
        },
        delete({ id }: {id: DialogBase['id']}): void {
            this.dialogs = this.dialogs.filter((dialog: Dialog): boolean => dialog.id !== id);
        },
    },
    getters: {
        dialogsById(): Dialog[] {
            return this.dialogs.reduce((accumulator: Dialog[], dialog: Dialog): Dialog[] => {
                accumulator[dialog.id] = dialog;

                return accumulator;
            }, {});
        },
    },
    state: (): { dialogs: Dialog[] } => ({ dialogs: [] }),
});
