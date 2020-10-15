import React from 'react';
import { useResumeModel } from '../hooks/use-resume-model';
import { ResumeModel } from '../resume/resume-model';
import { ResumeProvider } from '../resume/resume-provider';
import { createResumeProvider } from '../resume/resume-provider-factory';
import { Resume } from './Resume';

export function App() {
	// Determine which resume provider to use.
	const searchParams: URLSearchParams = new URL(document.location.toString()).searchParams;
	const provideResume: ResumeProvider = createResumeProvider(searchParams);

	const resume: ResumeModel | undefined = useResumeModel(provideResume);
	return resume ? <Resume resume={resume} /> : null;
}
