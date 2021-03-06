import {EventsHourlyItem} from '../types/events-hourly-item.type';
import {PoiEvents} from '../types/poi-events.type';

export const getPoiEvents = (
	eventsHourly: EventsHourlyItem[],
	day: string | null
) =>
	eventsHourly.reduce((value, currentItem: EventsHourlyItem) => {
		if (!day || currentItem.date === day)
			value[currentItem.poi_id] =
				(value[currentItem.poi_id] || 0) + currentItem.events;

		return value;
	}, {} as PoiEvents);
