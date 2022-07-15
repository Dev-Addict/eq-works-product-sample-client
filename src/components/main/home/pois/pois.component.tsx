import {ChangeEventHandler, FC, useEffect, useState} from 'react';

import {
	Container,
	DynamicPoisMap,
	Header,
	Input,
	InputWrapper,
	Title,
} from './pois.components';
import {PoisTable} from './pois-table/pois-table.component';
import {Dropdown} from '../../../shared/dropdown/dropdown.component';
import {Text} from '../../../shared/text.component';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {Poi} from '../../../../types/poi.type';
import {EventsHourlyItem} from '../../../../types/events-hourly-item.type';
import {StatsHourlyItem} from '../../../../types/stats-hourly-item.type';
import {DropdownOption} from '../../../../types/dropdown-option.type';

interface Props {
	pois: Poi[];
	eventsHourly: EventsHourlyItem[];
	statsHourly: StatsHourlyItem[];
	days: string[];
}

export const Pois: FC<Props> = ({pois, eventsHourly, statsHourly, days}) => {
	const [search, setSearch] = useState('');
	const [daysOptions, setDaysOptions] = useState<
		DropdownOption<string | null>[]
	>([
		{
			value: null,
			text: 'All Days',
			key: 'all-days',
		},
		...days.map((day) => ({
			value: day,
			text: new Date(day).toLocaleDateString(),
			key: day,
		})),
	]);
	const [day, setDay] = useState<null | string>(null);

	const onSearchChange =
		(): ChangeEventHandler<HTMLInputElement> =>
		({target: {value}}) =>
			setSearch(value);
	const onDaySelect = () => (value: null | string) => setDay(value);

	useEffect(() => {
		setDaysOptions([
			{
				value: null,
				text: 'All Days',
				key: 'all-days',
			},
			...days.map((day) => ({
				value: day,
				text: new Date(day).toLocaleDateString(),
				key: day,
			})),
		]);
	}, [days]);

	return (
		<Container>
			<Header>
				<Title>
					<Text textStyle={TextStyle.HEADING_2} value="Pois" />
				</Title>
				<InputWrapper>
					<Dropdown
						options={daysOptions}
						placeholder="Select day"
						value={day}
						onSelect={onDaySelect()}
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						placeholder="Search..."
						value={search}
						onChange={onSearchChange()}
					/>
				</InputWrapper>
			</Header>
			<PoisTable
				pois={pois}
				eventsHourly={eventsHourly}
				statsHourly={statsHourly}
				search={search}
				day={day}
			/>
			<DynamicPoisMap pois={pois} />
		</Container>
	);
};
