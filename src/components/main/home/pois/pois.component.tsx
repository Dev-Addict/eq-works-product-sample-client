import {ChangeEventHandler, FC, useEffect, useState} from 'react';
import Fuse from 'fuse.js';
import styled, {css} from 'styled-components';

import {Text} from '../../../shared/text.component';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {Poi} from '../../../../types/poi.type';

const Container = styled.div`
	padding: 20px;
	background-color: #067bc211;
	border: 1px solid #067bc2;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const Input = styled.input`
	outline: none;
	border: 1px solid #067bc2;
	border-radius: 24px;
	padding: 8px 16px;
	font-size: 16px;
`;

const Table = styled.table`
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

const TableRow = styled.tr<TableRowProps>`
	${({queried}) =>
		queried &&
		css`
			background-color: #067bc2bb;
			color: #fff;
			font-weight: 500;
		`}
`;

interface Props {
	pois: Poi[];
}

export const Pois: FC<Props> = ({pois}) => {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState<Poi[]>([]);
	const [fuse, setFuse] = useState<Fuse<Poi>>(new Fuse(pois, {keys: ['name']}));

	const onSearchChange =
		(): ChangeEventHandler<HTMLInputElement> =>
		({target: {value}}) =>
			setSearch(value);

	const renderTableRows = () => [
		...results.map(({poi_id, name, lat, lon}) => (
			<TableRow key={poi_id} queried>
				<td>{poi_id}</td>
				<td>{name}</td>
				<td>{lat}</td>
				<td>{lon}</td>
			</TableRow>
		)),
		...pois
			.filter(({poi_id}) => !results.find((item) => item.poi_id === poi_id))
			.map(({poi_id, name, lat, lon}) => (
				<TableRow key={poi_id}>
					<td>{poi_id}</td>
					<td>{name}</td>
					<td>{lat}</td>
					<td>{lon}</td>
				</TableRow>
			)),
	];

	useEffect(() => {
		setResults(fuse.search(search).map(({item}) => item));
	}, [fuse, search]);
	useEffect(() => {
		setFuse(new Fuse(pois, {keys: ['name']}));
	}, [pois]);

	return (
		<Container>
			<Header>
				<Text textStyle={TextStyle.HEADING_2} value="Pois" />
				<Input
					placeholder="Search..."
					value={search}
					onChange={onSearchChange()}
				/>
			</Header>
			<Table>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Latitude</th>
					<th>Longitude</th>
				</tr>
				{renderTableRows()}
			</Table>
		</Container>
	);
};
