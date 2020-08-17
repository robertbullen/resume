import React, { FC } from 'react';
import {} from 'reactstrap';
import { ContactService, ResumeProps } from '../resume';
import { CandidateContactService } from './CandidateContactService';

export const Candidate: FC<ResumeProps> = (props: ResumeProps) => {
	return (
		<div className="candidate-component">
			<div>
				<h1>{props.resume.candidate.name}</h1>
				<ul>
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
};
