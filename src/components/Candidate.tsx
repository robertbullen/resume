import React from 'react';
import { ResumeProps } from '../resume/resume-model';
import { CandidateContactServiceList } from './CandidateContactServiceList';
import { CandidateName } from './CandidateName';

export function Candidate(props: ResumeProps) {
	return (
		<div className="candidate-component">
			<CandidateName {...props} />
			<CandidateContactServiceList {...props} />
		</div>
	);
}
