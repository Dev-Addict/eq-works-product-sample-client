import {TextStyle} from '../types/enums/text-style.enum';
import {Typography} from '../types/typography.type';

export const TYPOGRAPHIES: {[k in TextStyle]: Typography} = {
	[TextStyle.HEADING_1]: {
		element: 'h1',
		fontSize: 48,
		fontWeight: 700,
	},
	[TextStyle.HEADING_2]: {
		element: 'h2',
		fontSize: 40,
		fontWeight: 700,
	},
	[TextStyle.HEADING_3]: {
		element: 'h3',
		fontSize: 32,
		fontWeight: 700,
	},
	[TextStyle.HEADING_4]: {
		element: 'h4',
		fontSize: 28,
		fontWeight: 700,
	},
	[TextStyle.HEADING_5]: {
		element: 'h5',
		fontSize: 24,
		fontWeight: 500,
	},
	[TextStyle.HEADING_6]: {
		element: 'h6',
		fontSize: 20,
		fontWeight: 500,
	},
	[TextStyle.BODY_1]: {
		element: 'span',
		fontSize: 18,
		fontWeight: 400,
	},
	[TextStyle.BODY_2]: {
		element: 'span',
		fontSize: 16,
		fontWeight: 400,
	},
	[TextStyle.PARAGRAPH]: {
		element: 'p',
		fontSize: 16,
		fontWeight: 400,
		lineHeight: 1.2,
	},
	[TextStyle.CAPTION]: {
		element: 'span',
		fontSize: 12,
		fontWeight: 400,
	},
};
