import { defineStore } from 'pinia';

export const useDeviceStore = defineStore('device', {
    actions: {
        change({
            payload,
            property,
        } : {
            property: unknown,
            payload: unknown
        }) {
            if (!property) {
                return;
            }

            this[property] = payload;
        },
    },
    state: (): { touch: boolean } => ({ touch: false }),
});
