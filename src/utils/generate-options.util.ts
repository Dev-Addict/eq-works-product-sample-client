import {DropdownOption} from '../types/dropdown-option.type';

export const generateOptions = <T = string>(
	array: T[],
	textHandler: ((item: T, index: number, array: T[]) => string) | string[]
): DropdownOption<T>[] =>
	array.map((item, i, array) => ({
		value: item,
		text:
			typeof textHandler === 'function'
				? textHandler(item, i, array)
				: textHandler[i],
		key: item,
	}));
