import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	* {
		user-select: none;
		box-sizing: border-box;
		font-family: "Ubuntu", sans-serif;
	}
	
	html, body {
		padding: 0;
		margin: 0;
	}
`;
