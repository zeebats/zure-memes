import { defineStore } from 'pinia';

const State = {
	keyboard: false,
	touch: false,
};

export const useDeviceStore = defineStore('device', {
	actions: {
		change<K extends keyof typeof State>(property: K, payload: typeof State[K]): void {
			this.$state[property] = payload;
		},
	},
	state: (): typeof State => State,
});
