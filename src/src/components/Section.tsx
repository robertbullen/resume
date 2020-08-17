import classNames from 'classnames';
import React, { ComponentProps, FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<
	ComponentProps<'section'> & {
		heading?: string;
		id: string;
	}
>;

export const Section: FC<Props> = (props: Props) => {
	const { children, heading, ...sectionProps } = props;
	return (
		<section
			{...sectionProps}
			className={classNames('section-component', sectionProps.className)}
		>
			{heading && <h2>{heading}</h2>}
			{children}
		</section>
	);
};

export function generateSectionId(heading: string): string {
	return heading
		.split(' ')
		.filter((word: string): boolean => word.length > 1)
		.map((word: string): string => word.toLowerCase())
		.join('-');
}
