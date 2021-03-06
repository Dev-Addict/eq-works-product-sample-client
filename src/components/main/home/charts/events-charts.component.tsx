import {FC, useEffect, useState} from 'react';
import {ActiveElement, ChartData, ChartEvent} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import {Container, Description} from './charts.components';
import {Text} from '../../../shared/text.component';
import {getChartData} from '../../../../utils/charts/get-chart-data.util';
import {getHourlyChartData} from '../../../../utils/charts/get-hourly-chart-data.util';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {EventsItem} from '../../../../types/events-item.type';
import {EventsHourlyItem} from '../../../../types/events-hourly-item.type';

interface Props {
	eventsDaily: EventsItem[];
	eventsHourly: EventsHourlyItem[];
}

export const EventsCharts: FC<Props> = ({eventsDaily, eventsHourly}) => {
	const [chartData, setChartData] = useState<ChartData<'bar'>>(
		getChartData({
			eventsDaily,
			events: true,
		})
	);
	const [currentIndex, setCurrentIndex] = useState<null | number>(null);

	const onChartClick = () => (_: ChartEvent, element: ActiveElement[]) => {
		if (typeof currentIndex !== 'number') {
			if (element.length > 0) setCurrentIndex(element[0].index);
		} else setCurrentIndex(null);
	};

	useEffect(() => {
		if (typeof currentIndex === 'number')
			setChartData(
				getHourlyChartData({
					eventsDaily,
					eventsHourly,
					currentIndex,
					events: true,
				})
			);
		else
			setChartData(
				getChartData({
					eventsDaily,
					events: true,
				})
			);
	}, [currentIndex, eventsDaily, eventsHourly]);

	return (
		<Container>
			<Description>
				<Text textStyle={TextStyle.HEADING_2} value="Events" />
				<Text
					textStyle={TextStyle.PARAGRAPH}
					value={
						typeof currentIndex === 'number'
							? 'Click on the chart to go back to main chart.'
							: 'Click on the bars to see more details.'
					}
				/>
			</Description>
			<Bar
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text:
								typeof currentIndex === 'number'
									? `Events Chart - ${new Date(
											eventsDaily[currentIndex].date
									  ).toLocaleDateString()}`
									: 'Events Chart',
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
