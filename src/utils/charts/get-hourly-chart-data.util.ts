import {ChartData, ChartDataset} from 'chart.js';

import {scaleArray} from '../scale-array.util';
import {EventsItem} from '../../types/events-item.type';
import {EventsHourlyItem} from '../../types/events-hourly-item.type';
import {StatsItem} from '../../types/stats-item.type';
import {StatsHourlyItem} from '../../types/stats-hourly-item.type';

interface Options {
	eventsDaily?: EventsItem[];
	eventsHourly?: EventsHourlyItem[];
	statsDaily?: StatsItem[];
	statsHourly?: StatsHourlyItem[];
	currentIndex: number;
	total?: boolean;
	events?: boolean;
	impressions?: boolean;
	clicks?: boolean;
	revenue?: boolean;
	scale?: boolean;
}

export const getHourlyChartData = ({
	eventsDaily = [],
	eventsHourly = [],
	statsDaily = [],
	statsHourly = [],
	currentIndex,
	total,
	events,
	impressions,
	clicks,
	revenue,
	scale,
}: Options): ChartData<'line'> & ChartData<'bar'> => {
	const currentIndexEvents = eventsHourly.filter(
		({date}) => date === eventsDaily[currentIndex].date
	);
	const currentIndexStats = statsHourly.filter(
		({date}) => date === statsDaily[currentIndex].date
	);

	const datasets: (ChartDataset<'line'> & ChartDataset<'bar'>)[] = [];

	const handleScale = (array: number[], max?: number) =>
		scale ? scaleArray(array, [0, 1], 0, max) : array;

	const eventsData = handleScale(
		new Array(24)
			.fill(null)
			.map(
				(_, i) => currentIndexEvents.find(({hour}) => hour === i)?.events || 0
			)
	);
	const impressionsData = handleScale(
		new Array(24)
			.fill(null)
			.map(
				(_, i) =>
					currentIndexStats.find(({hour}) => hour === i)?.impressions || 0
			)
	);
	const clicksData = handleScale(
		new Array(24)
			.fill(null)
			.map(
				(_, i) => currentIndexStats.find(({hour}) => hour === i)?.clicks || 0
			)
	);
	const revenueData = handleScale(
		new Array(24)
			.fill(null)
			.map(
				(_, i) => currentIndexStats.find(({hour}) => hour === i)?.revenue || 0
			)
	);
	const totalData = handleScale(
		eventsData.map(
			(value, i) => value + impressionsData[i] + clicksData[i] + revenueData[i]
		),
		4
	);

	if (total)
		datasets.push({
			label: 'Total',
			data: totalData,
			backgroundColor: new Array(24).fill('#FFC759'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (events)
		datasets.push({
			label: 'Events',
			data: eventsData,
			backgroundColor: new Array(24).fill('#067BC2'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (impressions)
		datasets.push({
			label: 'Impressions',
			data: impressionsData,
			backgroundColor: new Array(24).fill('#F45B69'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (clicks)
		datasets.push({
			label: 'Clicks',
			data: clicksData,
			backgroundColor: new Array(24).fill('#63B995'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (revenue)
		datasets.push({
			label: 'Revenue',
			data: revenueData,
			backgroundColor: new Array(24).fill('#60435F'),
			borderWidth: 1,
			pointRadius: 6,
		});

	return {
		labels: new Array(24).fill(null).map((_, i) => i.toString()),
		datasets,
	};
};
