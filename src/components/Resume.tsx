import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { ResumeProps } from '../resume/resume-model';
import { Candidate } from './Candidate';
import { ExperienceTimeline } from './ExperienceTimeline';
import { InterestsHoneycomb } from './InterestsHexGrid';
import { Mission } from './Mission';
import './Resume.css';
import { generateSectionId, Section } from './Section';
import { SkillRatingsChart } from './SkillRatingsChart';

export function Resume(props: ResumeProps) {
	return (
		<>
			<header>
				<Container>
					<Row>
						<Col xl={6} xs={12}>
							<Section id="candidate">
								<Candidate {...props} />
							</Section>
						</Col>
						<Col xl={6} xs={12}>
							<Section id="mission">
								<Mission {...props} />
							</Section>
						</Col>
					</Row>
				</Container>
			</header>
			<main>
				<Container>
					<Row>
						<Col xl={6} xs={12}>
							<Row>
								<Col>
									<Section heading="Pursuits & Interests" id="pursuits-interests">
										<InterestsHoneycomb {...props} />
									</Section>
								</Col>
							</Row>
							<Row>
								{Object.keys(props.resume.skills).map((skillCategory: string) => (
									<Col key={skillCategory} md={6} xs={12}>
										<Section
											heading={skillCategory}
											id={generateSectionId(skillCategory)}
										>
											<SkillRatingsChart
												{...props}
												skillCategory={skillCategory}
											/>
										</Section>
									</Col>
								))}
							</Row>
						</Col>
						<Col xl={6} xs={12}>
							<Section heading="Experience" id="experience">
								<ExperienceTimeline {...props} />
							</Section>
						</Col>
					</Row>
				</Container>
			</main>
			<footer></footer>
		</>
	);
}
