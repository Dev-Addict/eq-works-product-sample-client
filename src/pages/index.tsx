import {useEffect} from 'react';
import type {NextPage, GetStaticProps} from 'next';
import styled from 'styled-components';
import {CategoryScale} from 'chart.js';
import Chart from 'chart.js/auto';

import {EventsCharts} from '../components/main/home/charts/events-charts.component';
import {Pois} from '../components/main/home/pois/pois.component';
import {StatsCharts} from '../components/main/home/charts/stats-charts.component';
import {Text} from '../components/shared/text.component';
import {request} from '../utils/request.util';
import {TextStyle} from '../types/enums/text-style.enum';
import {EventsItem} from '../types/events-item.type';
import {EventsHourlyItem} from '../types/events-hourly-item.type';
import {StatsItem} from '../types/stats-item.type';
import {StatsHourlyItem} from '../types/stats-hourly-item.type';
import {Poi} from '../types/poi.type';

const Container = styled.div`
	margin: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

interface StaticProps {
	eventsDaily: EventsItem[];
	eventsHourly: EventsHourlyItem[];
	statsDaily: StatsItem[];
	statsHourly: StatsHourlyItem[];
	pois: Poi[];
}

interface Props extends StaticProps {}

const Home: NextPage<Props, StaticProps> = ({
	eventsDaily,
	eventsHourly,
	statsDaily,
	statsHourly,
	pois,
}) => {
	useEffect(() => {
		Chart.register(CategoryScale);
	}, []);

	return (
		<Container>
			<Text textStyle={TextStyle.HEADING_1} value="EQ Works Product Sample" />
			<EventsCharts eventsDaily={eventsDaily} eventsHourly={eventsHourly} />
			<StatsCharts statsDaily={statsDaily} statsHourly={statsHourly} />
			<Pois pois={pois} />
		</Container>
	);
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
	return {
		props: {
			eventsDaily:
				(await request<EventsItem[]>('http://localhost:5555/events/daily')) ||
				[],
			eventsHourly:
				(await request<EventsHourlyItem[]>(
					'http://localhost:5555/events/hourly'
				)) || [],
			statsDaily:
				(await request<StatsItem[]>('http://localhost:5555/stats/daily')) || [],
			statsHourly:
				(await request<StatsHourlyItem[]>(
					'http://localhost:5555/stats/hourly'
				)) || [],
			pois: (await request<Poi[]>('http://localhost:5555/poi')) || [],
		},
	};
};

export default Home;
