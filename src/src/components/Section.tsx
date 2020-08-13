import React, { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	heading: string;
}>;

export const Section: FC<Props> = (props) => (
	<section>
		<h2 className="display-4 text-uppercase">{props.heading}</h2>
		{props.children}
	</section>
);
