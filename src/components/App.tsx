import React from 'react';
import { useResumeModel } from '../hooks/use-resume-model';
import { provideFakeResume } from '../resume/faker-resume-provider';
import { provideInstanceResume } from '../resume/instance-resume-provider';
import { ResumeModel } from '../resume/resume-model';
import { ResumeProvider } from '../resume/resume-provider';
import { robert } from '../resume/robert';
import { Resume } from './Resume';

export function App() {
	const fake: boolean = false;
	const provideResume: ResumeProvider = fake ? provideFakeResume : provideInstanceResume(robert);
	const resume: ResumeModel | undefined = useResumeModel(provideResume);
	return resume ? <Resume resume={resume} /> : null;
}
