import { registerSW } from 'virtual:pwa-register';

registerSW({
	immediate: true,
	onOfflineReady() {
		console.log('PWA application ready to work offline'); // eslint-disable-line no-console
	},
	onRegisteredSW(swScriptUrl) {
		console.log('SW registered:', swScriptUrl); // eslint-disable-line no-console
	},
});
