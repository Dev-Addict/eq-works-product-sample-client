import {FC, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import {ActiveElement, ChartData, ChartEvent} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import {Container, Description} from './charts.components';
import {Text} from '../../../shared/text.component';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {StatsItem} from '../../../../types/stats-item.type';
import {StatsHourlyItem} from '../../../../types/stats-hourly-item.type';

const Metrics = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
`;

interface MetricProps {
	active: boolean;
}

const Metric = styled.div<MetricProps>`
	padding: 8px 16px;
	border-radius: 8px;
	border: 1px solid #067bc288;
	background-color: #067bc2aa;
	color: #fff;

	${({active}) =>
		active &&
		css`
			border: 1px solid #067bc2;
			background-color: #067bc2;
		`}
`;

interface Props {
	statsDaily: StatsItem[];
	statsHourly: StatsHourlyItem[];
}

export const StatsCharts: FC<Props> = ({statsDaily, statsHourly}) => {
	const [metric, setMetric] =
		useState<keyof Omit<StatsItem, 'date'>>('impressions');
	const [chartData, setChartData] = useState<ChartData<'bar'>>({
		labels: statsDaily.map(({date}) => new Date(date).toLocaleDateString()),
		datasets: [
			{
				label: metric,
				data: statsDaily.map((stats) => stats[metric]),
				backgroundColor: new Array(statsDaily.length).fill('#067bc2'),
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
	const onMetricClick = (metric: keyof Omit<StatsItem, 'date'>) => () =>
		setMetric(metric);

	useEffect(() => {
		if (typeof currentIndex === 'number') {
			const currentIndexItems = statsHourly.filter(
				({date}) => date === statsDaily[currentIndex].date
			);

			setChartData({
				labels: new Array(24).fill(null).map((_, i) => i.toString()),
				datasets: [
					{
						label: metric,
						data: new Array(24)
							.fill(null)
							.map(
								(_, i) =>
									currentIndexItems.find(({hour}) => hour === i)?.[metric] || 0
							),
						backgroundColor: new Array(24).fill('#067bc2'),
						borderWidth: 1,
					},
				],
			});
		} else
			setChartData({
				labels: statsDaily.map(({date}) => new Date(date).toLocaleDateString()),
				datasets: [
					{
						label: metric,
						data: statsDaily.map((stats) => stats[metric]),
						backgroundColor: new Array(statsDaily.length).fill('#067bc2'),
						borderWidth: 1,
					},
				],
			});
	}, [currentIndex, metric, statsDaily, statsHourly]);

	const renderMetrics = () =>
		['impressions', 'clicks', 'revenue'].map((item) => (
			<Metric
				key={item}
				active={item === metric}
				onClick={onMetricClick(item as keyof Omit<StatsItem, 'date'>)}>
				<Text textStyle={TextStyle.BODY_2} value={item} />
			</Metric>
		));

	return (
		<Container>
			<Description>
				<Text textStyle={TextStyle.HEADING_2} value="Stats" />
				<Text
					textStyle={TextStyle.PARAGRAPH}
					value={
						typeof currentIndex === 'number'
							? 'Click on the bars to see more details.'
							: 'Click on the chart to go back to main chart.'
					}
				/>
				<Metrics>
					<Text textStyle={TextStyle.HEADING_6} value="Metrics" />
					{renderMetrics()}
				</Metrics>
			</Description>
			<Bar
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text:
								typeof currentIndex === 'number'
									? `Stats Chart - ${new Date(
											statsDaily[currentIndex].date
									  ).toLocaleDateString()}`
									: 'Stats Chart',
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
