import React from 'react';
import { ResumeProps } from '../resume/resume-model';
import { CandidateContactServiceList } from './CandidateContactServiceList';
import { CandidateName } from './CandidateName';
import { ExperienceTimeline } from './ExperienceTimeline';
import { InterestsHexGrid } from './InterestsHexGrid';
import { Mission } from './Mission';
import { Section } from './Section';
import { SkillRatingsChartList } from './SkillRatingsChartList';

export function Resume(props: ResumeProps) {
	return (
		<div className="p-4 sm:p-8">
			<div className="container gap-12 grid grid-cols-1 mx-auto resume-component">
				<header className="gap-x-12 gap-y-6 grid grid-cols-1 lg:grid-cols-2">
					<Section heading="Candidate" id="candidate">
						<CandidateName {...props} />
						<CandidateContactServiceList {...props} />
					</Section>
					<Section heading="Mission" id="mission">
						<Mission {...props} />
					</Section>
				</header>
				<main className="gap-12 grid grid-cols-1 lg:grid-cols-2">
					<div className="gap-12 grid grid-cols-1">
						<Section heading="Strengths & Interests" id="interests">
							<InterestsHexGrid {...props} />
						</Section>
						<Section heading="Skills" id="skills">
							<div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
								<SkillRatingsChartList {...props} />
							</div>
						</Section>
					</div>
					<div>
						<Section heading="Experience" id="experience">
							<ExperienceTimeline {...props} />
						</Section>
					</div>
				</main>
				<footer></footer>
			</div>
		</div>
	);
}
