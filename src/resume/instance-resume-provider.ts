import { ResumeModel } from './resume-model';
import { ResumeProvider } from './resume-provider';

export function provideInstanceResume(resume: ResumeModel): ResumeProvider {
	return () => Promise.resolve(resume);
}
