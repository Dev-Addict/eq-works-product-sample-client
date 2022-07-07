import {FC, useEffect, useState} from 'react';
import {ActiveElement, ChartData, ChartEvent} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import {Container, Description} from './charts.components';
import {Text} from '../../../shared/text.component';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {EventsItem} from '../../../../types/events-item.type';
import {EventsHourlyItem} from '../../../../types/events-hourly-item.type';

interface Props {
	eventsDaily: EventsItem[];
	eventsHourly: EventsHourlyItem[];
}

export const EventsCharts: FC<Props> = ({eventsDaily, eventsHourly}) => {
	const [chartData, setChartData] = useState<ChartData<'bar'>>({
		labels: eventsDaily.map(({date}) => new Date(date).toLocaleDateString()),
		datasets: [
			{
				label: 'Number of events',
				data: eventsDaily.map(({events}) => events),
				backgroundColor: new Array(eventsDaily.length).fill('#067bc2'),
				borderWidth: 1,
			},
		],
	});
	const [currentIndex, setCurrentIndex] = useState<null | number>(null);

	const onChartClick = () => (_: ChartEvent, element: ActiveElement[]) => {
		if (typeof currentIndex !== 'number') {
			if (element.length > 0) setCurrentIndex(element[0].index);
		} else setCurrentIndex(null);
	};

	useEffect(() => {
		if (typeof currentIndex === 'number') {
			const currentIndexItems = eventsHourly.filter(
				({date}) => date === eventsDaily[currentIndex].date
			);

			setChartData({
				labels: new Array(24).fill(null).map((_, i) => i.toString()),
				datasets: [
					{
						label: 'Number of events',
						data: new Array(24)
							.fill(null)
							.map(
								(_, i) =>
									currentIndexItems.find(({hour}) => hour === i)?.events || 0
							),
						backgroundColor: new Array(24).fill('#067bc2'),
						borderWidth: 1,
					},
				],
			});
		} else
			setChartData({
				labels: eventsDaily.map(({date}) =>
					new Date(date).toLocaleDateString()
				),
				datasets: [
					{
						label: 'Number of events',
						data: eventsDaily.map(({events}) => events),
						backgroundColor: new Array(eventsDaily.length).fill('#067bc2'),
						borderWidth: 1,
					},
				],
			});
	}, [currentIndex, eventsDaily, eventsHourly]);

	return (
		<Container>
			<Description>
				<Text textStyle={TextStyle.HEADING_2} value="Events" />
				<Text
					textStyle={TextStyle.PARAGRAPH}
					value={
						typeof currentIndex === 'number'
							? 'Click on the bars to see more details.'
							: 'Click on the chart to go back to main chart.'
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
