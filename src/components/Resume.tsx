import React from 'react';
import { ResumeProps } from '../resume/resume-model';
import { Candidate } from './Candidate';
import { ExperienceTimeline } from './ExperienceTimeline';
import { InterestsHexGrid } from './InterestsHexGrid';
import { Mission } from './Mission';
import { generateSectionId, Section } from './Section';
import { SkillRatingsChart } from './SkillRatingsChart';

export function Resume(props: ResumeProps) {
	return (
		<div className="p-4 sm:p-8">
			<div className="container gap-8 grid grid-cols-1 mx-auto resume-component">
				<header className="gap-8 grid grid-cols-1 lg:grid-cols-2">
					<Section id="candidate">
						<Candidate {...props} />
					</Section>
					<Section id="mission">
						<Mission {...props} />
					</Section>
				</header>
				<main className="gap-8 grid grid-cols-1 lg:grid-cols-2">
					<div className="gap-8 grid grid-cols-1">
						<Section heading="Analytical & Creative Interests" id="interests">
							<InterestsHexGrid {...props} />
						</Section>
						<div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
							{Object.keys(props.resume.skills).map((skillCategory: string) => (
								<Section
									heading={skillCategory}
									id={generateSectionId(skillCategory)}
									key={skillCategory}
								>
									<SkillRatingsChart {...props} skillCategory={skillCategory} />
								</Section>
							))}
						</div>
					</div>
					<div>
						<Section heading="Experience" id="experience">
							<ExperienceTimeline {...props} />
						</Section>
					</div>{' '}
				</main>
				<footer></footer>
			</div>
		</div>
	);
}
