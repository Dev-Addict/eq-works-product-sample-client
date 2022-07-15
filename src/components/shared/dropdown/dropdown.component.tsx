import {FC, useEffect, useRef, useState} from 'react';

import {Container, Option, Options} from './dropdown.components';
import {DropdownOption} from '../../../types/dropdown-option.type';
import {useOnClickOutside} from '../../../hooks/on-click-outside.hook';

interface Props<T = any> {
	options: DropdownOption<T>[];
	value?: T;
	placeholder?: string;

	onSelect?(value: T): void;
}

export const Dropdown: FC<Props> = ({
	options,
	value,
	placeholder,
	onSelect,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [option, setOption] = useState<DropdownOption | null>(null);
	const [open, setOpen] = useState(false);

	const onOptionClick = (option: typeof value) => () =>
		onSelect && onSelect(option);
	const onContainerClick = () => () => setOpen(!open);
	const onClickOutside = () => () => setOpen(false);

	const renderOptions = () =>
		options.map((option) => (
			<Option
				key={option.key}
				onClick={onOptionClick(option.value)}
				selected={option.value === value}>
				{option.text}
			</Option>
		));

	useEffect(() => {
		setOption(options.find((option) => option.value === value) || null);
	}, [options, value]);
	useOnClickOutside(containerRef, onClickOutside());

	return (
		<Container
			filled={!!option}
			onClick={onContainerClick()}
			ref={containerRef}>
			{option?.text || placeholder}
			<Options open={open}>{renderOptions()}</Options>
		</Container>
	);
};
