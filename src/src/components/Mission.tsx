import React, { FC } from 'react';
import { ResumeProps } from '../resume';

export const Mission: FC<ResumeProps> = (props: ResumeProps) => (
	<div className="mission-component">
		<p>{props.resume.mission}</p>
	</div>
);
