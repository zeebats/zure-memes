import { keyboard, touch } from '@/store/device';

const handleTouchObserver = ({ matches }: MediaQueryListEvent | { matches: boolean }) => {
	touch.set(matches);
};

const touchObserver = window.matchMedia('(hover: none)');
touchObserver.addEventListener('change', handleTouchObserver);

const { matches } = touchObserver;

handleTouchObserver({ matches });

(window.visualViewport as VisualViewport).addEventListener('resize', ({ target }: Event) => {
	requestAnimationFrame(() => {
		const { height: visualHeight } = target as VisualViewport;
		const { innerHeight: windowHeight } = window;

		keyboard.set(visualHeight !== windowHeight);
	});
});
