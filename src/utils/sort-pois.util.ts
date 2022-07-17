import {Poi} from '../types/poi.type';
import {PoiSortOption} from '../types/poi-sort-options.type';
import {PoiEvents} from '../types/poi-events.type';
import {PoiStats} from '../types/poi-stats.type';

export const sortPois = (
	pois: Poi[],
	poiEvents: PoiEvents,
	poiStats: PoiStats,
	sortBy: PoiSortOption,
	reverseSort: boolean
) =>
	pois.sort((a, b) => {
		const rate = reverseSort ? -1 : 1;

		switch (sortBy) {
			case 'poi_id':
			case 'name':
			case 'lat':
			case 'lon':
				return (a[sortBy] < b[sortBy] ? -1 : 1) * rate;
			case 'events':
				return (poiEvents[a.poi_id] > poiEvents[b.poi_id] ? -1 : 1) * rate;
			case 'impressions':
			case 'clicks':
			case 'revenue':
				return (
					(poiStats[a.poi_id][sortBy] > poiStats[b.poi_id][sortBy] ? -1 : 1) *
					rate
				);
		}
	});
