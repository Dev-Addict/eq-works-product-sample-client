import Dynamic from 'next/dynamic';
import styled from 'styled-components';

export const Container = styled.div`
	padding: 20px;
	background-color: #067bc211;
	border: 1px solid #067bc2;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const Header = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 20px;
`;

export const Title = styled.div`
	flex: 1;
`;

export const InputWrapper = styled.div`
	width: 260px;
`;

export const Input = styled.input`
	outline: none;
	border: 1px solid #067bc288;
	background-color: #ffffffaa;
	border-radius: 24px;
	padding: 8px 16px;
	font-size: 16px;
	transition: border-top-color 336ms, border-right-color 336ms,
		border-bottom-color 336ms, border-left-color 336ms, background-color 336ms;
	width: 100%;

	&::placeholder {
		color: #777;
	}

	&:focus {
		border: 1px solid #067bc2;
		background-color: #ffffff;
	}
`;

export const DynamicPoisMap = Dynamic(
	async () => (await import('./pois-map.component')).PoisMap,
	{
		ssr: false,
	}
);
