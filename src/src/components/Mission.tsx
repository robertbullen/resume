import React, { FC } from 'react';
import { ResumeProps } from '../resume';

export const Mission: FC<ResumeProps> = (props: ResumeProps) => (
	<div className="mission">
		<p className="lead text-justify">{props.resume.mission}</p>
	</div>
);
