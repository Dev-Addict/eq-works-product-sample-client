import {FC, useEffect, useState} from 'react';
import Fuse from 'fuse.js';

import {TableRow, Table} from './pois-table.components';
import {fixNumber} from '../../../../../utils/fix-number.util';
import {getPoiEvents} from '../../../../../utils/get-poi-events.util';
import {getPoiStats} from '../../../../../utils/get-poi-stats.util';
import {EventsHourlyItem} from '../../../../../types/events-hourly-item.type';
import {Poi} from '../../../../../types/poi.type';
import {StatsHourlyItem} from '../../../../../types/stats-hourly-item.type';

interface Props {
	pois: Poi[];
	eventsHourly: EventsHourlyItem[];
	statsHourly: StatsHourlyItem[];
	search: string;
	day: null | string;
}

export const PoisTable: FC<Props> = ({
	pois,
	eventsHourly,
	statsHourly,
	search,
	day,
}) => {
	const [results, setResults] = useState<Poi[]>([]);
	const [poiEvents, setPoiEvents] = useState<{[key: number]: number}>(
		getPoiEvents(eventsHourly, day)
	);
	const [poiStats, setPoiStats] = useState<{
		[key: number]: {impressions: number; clicks: number; revenue: number};
	}>(getPoiStats(statsHourly, day));

	const [fuse, setFuse] = useState<Fuse<Poi>>(new Fuse(pois, {keys: ['name']}));
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
			pois.filter(({poi_id}) => !results.find((item) => item.poi_id === poi_id))
		),
	];

	useEffect(() => {
		setResults(fuse.search(search).map(({item}) => item));
	}, [fuse, search]);
	useEffect(() => {
		setFuse(new Fuse(pois, {keys: ['name']}));
	}, [pois]);
	useEffect(() => {
		setPoiEvents(getPoiEvents(eventsHourly, day));
	}, [eventsHourly, day]);
	useEffect(() => {
		setPoiStats(getPoiStats(statsHourly, day));
	}, [statsHourly, day]);

	return (
		<Table>
			<thead>
				<TableRow>
					<th>ID</th>
					<th>Name</th>
					<th>Events</th>
					<th>Impressions</th>
					<th>Clicks</th>
					<th>Revenue</th>
					<th>Latitude</th>
					<th>Longitude</th>
				</TableRow>
			</thead>
			<tbody>{renderTableRows()}</tbody>
		</Table>
	);
};
