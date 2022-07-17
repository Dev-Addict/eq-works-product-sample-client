import {FC} from 'react';
import styled, {css} from 'styled-components';
import {TiArrowSortedDown, TiArrowSortedUp} from 'react-icons/ti';

interface IconWrapperProps {
	active: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
	width: 20px;
	height: 20px;
	font-size: 20px;
	transition: opacity 336ms;
	opacity: 0.6;
	cursor: pointer;

	& svg {
		width: 20px;
		height: 20px;
		color: #ffffff;
	}

	&:not(:nth-last-child(1)) {
		margin-right: -8px;
	}

	${({active}) =>
		active &&
		css`
			opacity: 1;
		`}
`;

interface Props {
	active: boolean;
	reverseSort: boolean;

	onSort(reverseSort: boolean): void;
}

export const SortAngels: FC<Props> = ({active, reverseSort, onSort}) => {
	const onIconClick = (reverseSort: boolean) => () => onSort(reverseSort);

	return (
		<div>
			<IconWrapper active={active && !reverseSort} onClick={onIconClick(false)}>
				<TiArrowSortedUp />
			</IconWrapper>
			<IconWrapper active={active && reverseSort} onClick={onIconClick(true)}>
				<TiArrowSortedDown />
			</IconWrapper>
		</div>
	);
};
