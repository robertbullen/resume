import React from 'react';
import { useAutoscalingFontSize } from '../hooks/use-autoscaling-font-size';
import { ResumeProps } from '../resume/resume-model';

export function CandidateName(props: ResumeProps) {
	const { childRef, parentRef } = useAutoscalingFontSize<HTMLDivElement, HTMLHeadingElement>();

	return (
		<div className="candidate-name-component" ref={parentRef}>
			<h1 ref={childRef}>{props.resume.candidate.name}</h1>
		</div>
	);
}
