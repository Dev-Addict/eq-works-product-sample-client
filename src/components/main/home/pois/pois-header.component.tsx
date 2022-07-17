import {ChangeEventHandler, FC, useEffect, useState} from 'react';

import {Header, Input, InputWrapper, Title} from './pois.components';
import {Dropdown} from '../../../shared/dropdown/dropdown.component';
import {Text} from '../../../shared/text.component';
import {dayTextHandler} from '../../../../utils/handlers/text-handlers/day.text-handler';
import {generateOptions} from '../../../../utils/generate-options.util';
import {TextStyle} from '../../../../types/enums/text-style.enum';
import {DropdownOption} from '../../../../types/dropdown-option.type';

interface Props {
	days: string[];
	day: string | null;
	search: string;
	onSearchChange: ChangeEventHandler<HTMLInputElement>;

	onDaySelect?(value: string | null): void;
}

export const PoisHeader: FC<Props> = ({
	days,
	day,
	search,
	onSearchChange,
	onDaySelect,
}) => {
	const [daysOptions, setDaysOptions] = useState<
		DropdownOption<string | null>[]
	>(generateOptions<string | null>([null, ...days], dayTextHandler));

	useEffect(() => {
		setDaysOptions(
			generateOptions<string | null>([null, ...days], dayTextHandler)
		);
	}, [days]);

	return (
		<Header>
			<Title>
				<Text textStyle={TextStyle.HEADING_2} value="Pois" />
			</Title>
			<InputWrapper>
				<Dropdown
					options={daysOptions}
					placeholder="Select day"
					value={day}
					onSelect={onDaySelect}
				/>
			</InputWrapper>
			<InputWrapper>
				<Input
					placeholder="Search..."
					value={search}
					onChange={onSearchChange}
				/>
			</InputWrapper>
		</Header>
	);
};
