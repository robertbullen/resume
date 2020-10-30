import classNames from 'classnames';
import React, { ComponentProps, ElementType, PropsWithChildren } from 'react';

export function generateSectionId(heading: string): string {
	return heading
		.split(' ')
		.filter((word: string): boolean => word.length > 1)
		.map((word: string): string => word.toLowerCase())
		.join('-');
}

type Props = PropsWithChildren<
	ComponentProps<'section'> & {
		heading: string;
		headingTag?: ElementType;
		id: string;
	}
>;

export function Section(props: Props) {
	const { children, heading, headingTag, ...sectionProps } = props;
	const HeadingElement = headingTag ?? 'h2';
	return (
		<section
			{...sectionProps}
			className={classNames('section-component', sectionProps.className)}
		>
			<HeadingElement className="heading">{heading}</HeadingElement>
			{children}
		</section>
	);
}
