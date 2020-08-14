import React, { FC } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useResume } from '../hooks/use-resume';
import { Resume, SkillRatingsRecord } from '../resume';
import './App.css';
import { Mission } from './Mission';
import { Person } from './Person';
import { Section } from './Section';
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
							<Person resume={resume} />
						</Col>
						<Col xl={6} xs={12}>
							<Mission resume={resume} />
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
									<Section heading="Pursuits & Interests">hello</Section>
								</Col>
							</Row>
							<Row>
								{Object.entries(resume.skills).map(
									(
										[category, skillRatings]: [string, SkillRatingsRecord],
										skillCategoryIndex: number,
									) => (
										<Col key={skillCategoryIndex} md={6} xs={12}>
											<Section heading={category}>
												<SkillRatingsChart skillRatings={skillRatings} />
											</Section>
										</Col>
									),
								)}
							</Row>
						</Col>
						<Col xl={6} xs={12}>
							<Section heading="Experience">TODO: Timeline</Section>
						</Col>
					</Row>
				</Container>
			</main>
			<footer></footer>
		</>
	);
};

export default App;
