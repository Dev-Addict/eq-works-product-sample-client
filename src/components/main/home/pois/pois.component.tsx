import {ChangeEventHandler, FC, useEffect, useState} from 'react';

import {Container, DynamicPoisMap} from './pois.components';
import {PoisHeader} from './pois-header.component';
import {PoisTable} from './pois-table/pois-table.component';
import {getPoiEvents} from '../../../../utils/get-poi-events.util';
import {getPoiStats} from '../../../../utils/get-poi-stats.util';
import {EventsHourlyItem} from '../../../../types/events-hourly-item.type';
import {PoiEvents} from '../../../../types/poi-events.type';
import {PoiStats} from '../../../../types/poi-stats.type';
import {Poi} from '../../../../types/poi.type';
import {StatsHourlyItem} from '../../../../types/stats-hourly-item.type';
import {PoiSortOption} from '../../../../types/poi-sort-options.type';

interface Props {
	pois: Poi[];
	eventsHourly: EventsHourlyItem[];
	statsHourly: StatsHourlyItem[];
	days: string[];
}

export const Pois: FC<Props> = ({pois, eventsHourly, statsHourly, days}) => {
	const [search, setSearch] = useState('');
	const [day, setDay] = useState<null | string>(null);
	const [sortBy, setSortBy] = useState<PoiSortOption>('poi_id');
	const [reverseSort, setReverseSort] = useState(false);
	const [poiEvents, setPoiEvents] = useState<PoiEvents>(
		getPoiEvents(eventsHourly, day)
	);
	const [poiStats, setPoiStats] = useState<PoiStats>(
		getPoiStats(statsHourly, day)
	);

	const onSearchChange =
		(): ChangeEventHandler<HTMLInputElement> =>
		({target: {value}}) =>
			setSearch(value);
	const onDaySelect = () => (value: null | string) => setDay(value);
	const onSort = () => (sortBy: PoiSortOption, reverseSort: boolean) => {
		setSortBy(sortBy);
		setReverseSort(reverseSort);
	};

	useEffect(() => {
		setPoiEvents(getPoiEvents(eventsHourly, day));
	}, [eventsHourly, day]);
	useEffect(() => {
		setPoiStats(getPoiStats(statsHourly, day));
	}, [statsHourly, day]);

	return (
		<Container>
			<PoisHeader
				days={days}
				day={day}
				onDaySelect={onDaySelect()}
				search={search}
				onSearchChange={onSearchChange()}
			/>
			<PoisTable
				pois={pois}
				poiEvents={poiEvents}
				poiStats={poiStats}
				search={search}
				day={day}
				sortBy={sortBy}
				reverseSort={reverseSort}
				onSort={onSort()}
			/>
			<DynamicPoisMap
				pois={pois}
				poiEvents={poiEvents}
				poiStats={poiStats}
				sortBy={sortBy}
			/>
		</Container>
	);
};
