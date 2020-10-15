import { ResumeModel } from './resume-model';
import { ResumeProvider } from './resume-provider';

export function provideJsonResume(url: string): ResumeProvider {
	return async (): Promise<ResumeModel> => {
		const response: Response = await fetch(url, {
			headers: {
				accept: 'application/json',
			},
		});

		if (response.ok) {
			const obj: unknown = await response.json();

			// TODO: Validate the JSON object conforms to `ResumeModel`.
			const resume = obj as ResumeModel;
			for (const experience of resume.experiences) {
				experience.finishDate = experience.finishDate && new Date(experience.finishDate);
				experience.startDate = experience.startDate && new Date(experience.startDate);
			}

			return resume;
		}

		throw new Error(`Failed to fetch resume from ${url}`);
	};
}
