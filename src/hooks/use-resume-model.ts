import { useEffect, useState } from 'react';
import { ResumeModel } from '../resume/resume-model';
import { ResumeProvider } from '../resume/resume-provider';

export function useResumeModel(provider: ResumeProvider): ResumeModel | undefined {
	const [resume, setResume] = useState<ResumeModel>();
	useEffect((): void => void provider().then(setResume), [provider]);
	return resume;
}
