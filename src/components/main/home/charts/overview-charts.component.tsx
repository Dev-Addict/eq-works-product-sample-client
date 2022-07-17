import {FC, useEffect, useState} from 'react';
import {ActiveElement, ChartData, ChartEvent} from 'chart.js';
import {Line} from 'react-chartjs-2';

import {Container, Description} from './charts.components';
import {Text} from '../../../shared/text.component';
import {getChartData} from '../../../../utils/charts/get-chart-data.util';
import {getHourlyChartData} from '../../../../utils/charts/get-hourly-chart-data.util';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {EventsItem} from '../../../../types/events-item.type';
import {EventsHourlyItem} from '../../../../types/events-hourly-item.type';
import {StatsItem} from '../../../../types/stats-item.type';
import {StatsHourlyItem} from '../../../../types/stats-hourly-item.type';

interface Props {
	eventsDaily: EventsItem[];
	eventsHourly: EventsHourlyItem[];
	statsDaily: StatsItem[];
	statsHourly: StatsHourlyItem[];
}

export const OverviewCharts: FC<Props> = ({
	eventsDaily,
	eventsHourly,
	statsDaily,
	statsHourly,
}) => {
	const [currentIndex, setCurrentIndex] = useState<null | number>(null);
	const [chartData, setChartData] = useState<ChartData<'line'>>(
		getChartData({
			eventsDaily,
			statsDaily,
			total: true,
			events: true,
			impressions: true,
			revenue: true,
			clicks: true,
			scale: true,
		})
	);

	const onChartClick = () => (_: ChartEvent, element: ActiveElement[]) => {
		if (typeof currentIndex !== 'number') {
			if (element.length > 0) setCurrentIndex(element[0].index);
		} else setCurrentIndex(null);
	};

	useEffect(() => {
		if (typeof currentIndex === 'number') {
			setChartData(
				getHourlyChartData({
					eventsDaily,
					eventsHourly,
					statsDaily,
					statsHourly,
					currentIndex,
					total: true,
					events: true,
					impressions: true,
					revenue: true,
					clicks: true,
					scale: true,
				})
			);
		} else
			setChartData(
				getChartData({
					eventsDaily,
					statsDaily,
					total: true,
					events: true,
					impressions: true,
					revenue: true,
					clicks: true,
					scale: true,
				})
			);
	}, [currentIndex, eventsDaily, eventsHourly, statsDaily, statsHourly]);

	return (
		<Container>
			<Description>
				<Text textStyle={TextStyle.HEADING_2} value="Overview" />
				<Text
					textStyle={TextStyle.PARAGRAPH}
					value={
						typeof currentIndex === 'number'
							? 'Click on the chart to go back to main chart.'
							: 'Click on the data points to see more details.'
					}
				/>
			</Description>
			<Line
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text:
								typeof currentIndex === 'number'
									? `Overview Chart - ${new Date(
											eventsDaily[currentIndex].date
									  ).toLocaleDateString()}`
									: 'Overview Chart',
						},
						legend: {
							display: true,
							position: 'bottom',
						},
					},
					onClick: onChartClick(),
				}}
			/>
		</Container>
	);
};
