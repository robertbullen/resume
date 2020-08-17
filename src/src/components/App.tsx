import React, { FC } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useResume } from '../hooks/use-resume';
import { Resume, SkillRating } from '../resume';
import './App.css';
import { Candidate } from './Candidate';
import { Mission } from './Mission';
import { generateSectionId, Section } from './Section';
import { SkillRatingsChart } from './SkillRatingsChart';

const App: FC = () => {
	const resume: Resume | undefined = useResume();
	if (!resume) {
		return null;
	}

	return (
		<>
			<header>
				<Container>
					<Row>
						<Col xl={6} xs={12}>
							<Section id="candidate">
								<Candidate resume={resume} />
							</Section>
						</Col>
						<Col xl={6} xs={12}>
							<Section id="mission">
								<Mission resume={resume} />
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
										hello
									</Section>
								</Col>
							</Row>
							<Row>
								{Object.entries(resume.skills).map(
									(
										[category, skillRatings]: [string, SkillRating[]],
										skillCategoryIndex: number,
									) => (
										<Col key={skillCategoryIndex} md={6} xs={12}>
											<Section
												heading={category}
												id={generateSectionId(category)}
											>
												<SkillRatingsChart skillRatings={skillRatings} />
											</Section>
										</Col>
									),
								)}
							</Row>
						</Col>
						<Col xl={6} xs={12}>
							<Section heading="Experience" id="experience">
								TODO: Timeline
							</Section>
						</Col>
					</Row>
				</Container>
			</main>
			<footer></footer>
		</>
	);
};

export default App;
