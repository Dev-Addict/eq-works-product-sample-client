import {DetailedHTMLProps, forwardRef, HTMLAttributes, ReactNode} from 'react';

import {TYPOGRAPHIES} from '../../constants/typographies.constant';
import {TextStyle} from '../../types/enums/text-style.enum';

interface Props
	extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	value?: ReactNode;
	textStyle?: TextStyle;
}

export const Text = forwardRef<HTMLElement, Props>(function Text(
	{textStyle = TextStyle.BODY_2, value, style, ...props},
	ref
) {
	const {element: Element, ...typographyStyle} = TYPOGRAPHIES[textStyle];

	return (
		<Element {...props} style={{...typographyStyle, ...style}} ref={ref}>
			{value}
		</Element>
	);
});
