import styled, {css} from 'styled-components';

interface ContainerProps {
	filled?: boolean;
	open?: boolean;
}

export const Container = styled.div<ContainerProps>`
	border: 1px solid #067bc288;
	background-color: #ffffffaa;
	border-radius: 24px;
	padding: 8px 16px;
	font-size: 16px;
	transition: border-top-color 336ms, border-right-color 336ms,
		border-bottom-color 336ms, border-left-color 336ms, background-color 336ms;
	position: relative;
	color: #777777;
	width: 100%;

	${({open}) =>
		open &&
		css`
			border: 1px solid #067bc2;
			background-color: #ffffff;
		`}

	${({filled}) =>
		filled &&
		css`
			color: #000000;
		`}
`;

interface OptionsProps {
	open?: boolean;
}

export const Options = styled.div<OptionsProps>`
	position: absolute;
	width: 100%;
	top: calc(100% + 5px);
	left: 0;
	border: 1px solid #067bc2;
	background-color: #ffffff;
	border-radius: 24px;
	font-size: 16px;
	max-height: 0;
	opacity: 0;
	z-index: -1;
	overflow-y: auto;

	transition: max-height 336ms, opacity 336ms, z-index 336ms;

	${({open}) =>
		open &&
		css`
			max-height: 200px;
			opacity: 1;
			z-index: 1;
		`}
`;

interface OptionProps {
	selected?: boolean;
}

export const Option = styled.div<OptionProps>`
	padding: 8px;
	text-align: center;
	cursor: pointer;
	color: #000000;

	&:not(:nth-last-child(1)) {
		border-bottom: 1px solid #777777;
	}

	${({selected}) =>
		selected &&
		css`
			background-color: #067bc288;
		`}
`;
