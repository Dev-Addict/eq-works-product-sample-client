import {RefObject, useEffect} from 'react';

export const useOnClickOutside = (
	ref: RefObject<HTMLElement>,
	handleClick: (event: MouseEvent | TouchEvent) => void
) => {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node | null)) {
				return;
			}

			handleClick(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handleClick]);
};
