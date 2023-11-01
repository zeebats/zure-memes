import { keyboard, touch } from '@/store/device';

const handleTouchObserver = ({ matches }: { matches: boolean } | MediaQueryListEvent) => {
	touch.set(matches);
};

const touchObserver = window.matchMedia('(hover: none)');
touchObserver.addEventListener('change', handleTouchObserver);

const { matches } = touchObserver;

handleTouchObserver({ matches });

(window.visualViewport!).addEventListener('resize', ({ target }: Event) => {
	requestAnimationFrame(() => {
		const { height: visualHeight } = target as VisualViewport;
		const { innerHeight: windowHeight } = window;

		keyboard.set(visualHeight !== windowHeight);
	});
});
