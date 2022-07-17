import {FC, useEffect, useState} from 'react';
import Fuse from 'fuse.js';

import {TableRow, Table} from './pois-table.components';
import {SortAngels} from './sort-angels.component';
import {fixNumber} from '../../../../../utils/fix-number.util';
import {sortPois} from '../../../../../utils/sort-pois.util';
import {poiTableHeadsList} from '../../../../../constants/lists/poi-table-heads.list';
import {Poi} from '../../../../../types/poi.type';
import {PoiEvents} from '../../../../../types/poi-events.type';
import {PoiStats} from '../../../../../types/poi-stats.type';
import {PoiSortOption} from '../../../../../types/poi-sort-options.type';

interface Props {
	pois: Poi[];
	poiEvents: PoiEvents;
	poiStats: PoiStats;
	search: string;
	day: null | string;
	sortBy: PoiSortOption;
	reverseSort: boolean;

	onSort(sortBy: PoiSortOption, reverseSort: boolean): void;
}

export const PoisTable: FC<Props> = ({
	pois,
	poiEvents,
	poiStats,
	search,
	sortBy,
	reverseSort,
	onSort: oOnSort,
}) => {
	const [sortedPois, setSortedPois] = useState<Poi[]>(
		sortPois(pois, poiEvents, poiStats, sortBy, reverseSort)
	);
	const [results, setResults] = useState<Poi[]>([]);
	const [fuse, setFuse] = useState<Fuse<Poi>>(new Fuse(pois, {keys: ['name']}));

	const onSort = (sortBy: PoiSortOption) => (reverseSort: boolean) =>
		oOnSort(sortBy, reverseSort);

	const renderHeads = () =>
		poiTableHeadsList.map(([title, type]) => (
			<th key={type}>
				<div>
					{title}
					<SortAngels
						active={type === sortBy}
						reverseSort={reverseSort}
						onSort={onSort(type)}
					/>
				</div>
			</th>
		));
	const renderPoiRows = (pois: Poi[], queried = false) =>
		pois.map(({poi_id, name, lat, lon}) => (
			<TableRow key={poi_id} queried={queried}>
				<td>{poi_id}</td>
				<td>{name}</td>
				<td>{poiEvents[poi_id] || 0}</td>
				<td>{poiStats[poi_id]?.impressions || 0}</td>
				<td>{poiStats[poi_id]?.clicks || 0}</td>
				<td>{fixNumber(poiStats[poi_id]?.revenue || 0)}</td>
				<td>{lat}</td>
				<td>{lon}</td>
			</TableRow>
		));
	const renderTableRows = () => [
		...renderPoiRows(results, true),
		...renderPoiRows(
			sortedPois.filter(
				({poi_id}) => !results.find((item) => item.poi_id === poi_id)
			)
		),
	];

	useEffect(() => {
		setResults(fuse.search(search).map(({item}) => item));
	}, [fuse, search]);
	useEffect(() => {
		setFuse(new Fuse(pois, {keys: ['name']}));
	}, [pois]);
	useEffect(() => {
		setSortedPois(sortPois(pois, poiEvents, poiStats, sortBy, reverseSort));
	}, [poiEvents, poiStats, pois, reverseSort, sortBy]);

	return (
		<Table>
			<thead>
				<TableRow>{renderHeads()}</TableRow>
			</thead>
			<tbody>{renderTableRows()}</tbody>
		</Table>
	);
};
