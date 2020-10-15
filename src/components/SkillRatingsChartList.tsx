import React from 'react';
import { ResumeProps } from '../resume/resume-model';
import { generateSectionId, Section } from './Section';
import { SkillRatingsChart } from './SkillRatingsChart';

export function SkillRatingsChartList(props: ResumeProps) {
	return (
		<>
			{Object.keys(props.resume.skills).map((skillCategory: string) => (
				<Section
					heading={skillCategory}
					id={generateSectionId(skillCategory)}
					key={skillCategory}
				>
					<SkillRatingsChart {...props} skillCategory={skillCategory} />
				</Section>
			))}
		</>
	);
}
