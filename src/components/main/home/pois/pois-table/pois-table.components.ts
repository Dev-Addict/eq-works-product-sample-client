import styled, {css} from 'styled-components';

export const Table = styled.table`
	border: 1px solid #067bc2;
	border-radius: 8px;
	border-spacing: 0;
	overflow: hidden;

	& td,
	& th {
		padding: 8px;
		text-align: left;
	}

	& th {
		background-color: #067bc2;
		color: #fff;
	}
`;

interface TableRowProps {
	queried?: boolean;
}

export const TableRow = styled.tr<TableRowProps>`
	${({queried}) =>
		queried &&
		css`
			background-color: #067bc2bb;
			color: #fff;
			font-weight: 500;
		`}
`;
