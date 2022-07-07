import type {NextPage} from 'next';
import styled from 'styled-components';

import {Text} from '../components/shared/text.component';
import {TextStyle} from '../types/enums/text-style.enum';

const Container = styled.div`
	margin: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const Home: NextPage = () => {
	return (
		<Container>
			<Text textStyle={TextStyle.HEADING_1} value="EQ Works Product Sample" />
		</Container>
	);
};

export default Home;
