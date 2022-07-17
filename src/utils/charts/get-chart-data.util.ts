import {ChartData, ChartDataset} from 'chart.js';

import {scaleArray} from '../scale-array.util';
import {EventsItem} from '../../types/events-item.type';
import {StatsItem} from '../../types/stats-item.type';

interface Options {
	eventsDaily?: EventsItem[];
	statsDaily?: StatsItem[];
	events?: boolean;
	total?: boolean;
	impressions?: boolean;
	clicks?: boolean;
	revenue?: boolean;
	scale?: boolean;
}

export const getChartData = ({
	eventsDaily = [],
	statsDaily = [],
	total,
	events,
	impressions,
	clicks,
	revenue,
	scale,
}: Options): ChartData<'line'> & ChartData<'bar'> => {
	const datasets: (ChartDataset<'line'> & ChartDataset<'bar'>)[] = [];

	const handleScale = (array: number[], max?: number) =>
		scale ? scaleArray(array, [0, 1], 0, max) : array;

	const eventsData = handleScale(eventsDaily.map(({events}) => events));
	const impressionsData = handleScale(
		statsDaily.map(({impressions}) => impressions)
	);
	const clicksData = handleScale(statsDaily.map(({clicks}) => clicks));
	const revenueData = handleScale(statsDaily.map(({revenue}) => revenue));
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
			backgroundColor: new Array(eventsDaily.length).fill('#FFC759'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (events)
		datasets.push({
			label: 'Events',
			data: eventsData,
			backgroundColor: new Array(eventsDaily.length).fill('#067BC2'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (impressions)
		datasets.push({
			label: 'Impressions',
			data: impressionsData,
			backgroundColor: new Array(statsDaily.length).fill('#F45B69'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (clicks)
		datasets.push({
			label: 'Clicks',
			data: clicksData,
			backgroundColor: new Array(statsDaily.length).fill('#63B995'),
			borderWidth: 1,
			pointRadius: 6,
		});
	if (revenue)
		datasets.push({
			label: 'Revenue',
			data: revenueData,
			backgroundColor: new Array(statsDaily.length).fill('#60435F'),
			borderWidth: 1,
			pointRadius: 6,
		});

	return {
		labels: (eventsDaily?.length ? eventsDaily : statsDaily).map(({date}) =>
			new Date(date).toLocaleDateString()
		),
		datasets,
	};
};
