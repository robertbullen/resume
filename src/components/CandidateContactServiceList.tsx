import React from 'react';
import { ContactService, ResumeProps } from '../resume/resume-model';
import { CandidateContactService } from './CandidateContactService';

export function CandidateContactServiceList(props: ResumeProps) {
	return (
		<ul className="gap-x-2 grid grid-cols-2 sm:grid-cols-3">
			{props.resume.candidate.contactServices.map((contactService: ContactService) => (
				<li key={contactService.url}>
					<CandidateContactService contactService={contactService} />
				</li>
			))}
		</ul>
	);
}
