import classNames from 'classnames';
import React, { ComponentProps, PropsWithChildren } from 'react';

export function generateSectionId(heading: string): string {
	return heading
		.split(' ')
		.filter((word: string): boolean => word.length > 1)
		.map((word: string): string => word.toLowerCase())
		.join('-');
}

type Props = PropsWithChildren<
	ComponentProps<'section'> & {
		heading?: string;
		id: string;
	}
>;

export function Section(props: Props) {
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
}
