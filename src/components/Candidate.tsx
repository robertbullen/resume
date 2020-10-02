import React from 'react';
import { useAutoscalingFontSize } from '../hooks/use-autoscaling-font-size';
import { ContactService, ResumeProps } from '../resume/resume-model';
import { CandidateContactService } from './CandidateContactService';

export function Candidate(props: ResumeProps) {
	const { childRef, childScaledFontSize, parentRef } = useAutoscalingFontSize<
		HTMLDivElement,
		HTMLHeadingElement
	>();

	return (
		<div className="candidate-component">
			<div ref={parentRef} style={{ display: 'inline-block', maxWidth: '100%' }}>
				<h1
					ref={childRef}
					style={{
						fontSize: childScaledFontSize,
						whiteSpace: 'nowrap',
					}}
				>
					{props.resume.candidate.name}
				</h1>
				<ul className="gap-x-2 grid grid-cols-2 sm:grid-cols-3">
					{props.resume.candidate.contactServices.map(
						(contactService: ContactService) => (
							<li key={contactService.url}>
								<CandidateContactService contactService={contactService} />
							</li>
						),
					)}
				</ul>
			</div>
		</div>
	);
}
