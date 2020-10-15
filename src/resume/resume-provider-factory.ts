import { provideFakeResume } from './fake-resume-provider';
import { provideInstanceResume } from './instance-resume-provider';
import { provideJsonResume } from './json-resume-provider';
import { ResumeProvider } from './resume-provider';
import { robert } from './robert';

export function createResumeProvider(params: URLSearchParams): ResumeProvider {
	const providerName: string | undefined = params.get('provider') ?? undefined;
	let provideResume: ResumeProvider;
	switch (providerName) {
		case 'fake':
			provideResume = provideFakeResume;
			break;

		case 'json':
			const url: string | undefined = params.get('url') ?? undefined;
			if (!url) {
				throw new Error(
					"The JSON resume provider requires query parameter 'url' but it was not defined",
				);
			}

			provideResume = provideJsonResume(url);
			break;

		case 'robert':
		default:
			provideResume = provideInstanceResume(robert);
			break;
	}
	return provideResume;
}
