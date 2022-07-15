import {StatsHourlyItem} from '../types/stats-hourly-item.type';

export const getPoiStats = (
	statsHourly: StatsHourlyItem[],
	day: string | null
) =>
	statsHourly.reduce(
		(value, currentItem) => {
			if (!day || currentItem.date === day)
				value[currentItem.poi_id] = {
					impressions:
						(value[currentItem.poi_id]?.impressions || 0) +
						currentItem.impressions,
					clicks: (value[currentItem.poi_id]?.clicks || 0) + currentItem.clicks,
					revenue:
						(value[currentItem.poi_id]?.revenue || 0) + +currentItem.revenue,
				};

			return value;
		},
		{} as {
			[key: number]: {impressions: number; clicks: number; revenue: number};
		}
	);
