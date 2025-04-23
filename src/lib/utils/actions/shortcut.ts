export const shortcut = (
	node: HTMLElement,
	params?: {
		alt?: boolean;
		shift?: boolean;
		control?: boolean;
		code: string;
		callback: () => void;
	}
) => {
	if (!params) return;
	let handler: (e: KeyboardEvent) => void;
	const removeHandler = () => window.removeEventListener('keydown', handler);
	const setHandler = () => {
		removeHandler();
		handler = (e) => {
			if (
				!!params.alt != e.altKey ||
				!!params.shift != e.shiftKey ||
				!!params.control != (e.ctrlKey || e.metaKey) ||
				params.code != e.code
			)
				return;
			e.preventDefault();
			e.stopPropagation();
			params.callback();
		};
		window.addEventListener('keydown', handler);
	};
	setHandler();
	return {
		update: setHandler,
		destroy: removeHandler
	};
};
