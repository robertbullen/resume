import React from 'react';
import { ResumeProps } from '../resume/resume-model';

export function Mission(props: ResumeProps) {
	return (
		<div className="mission-component">
			<p>{props.resume.mission}</p>
		</div>
	);
}
