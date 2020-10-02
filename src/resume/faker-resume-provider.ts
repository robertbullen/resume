import * as faker from 'faker';
import { ResumeModel, SkillCategoriesRecord, SkillRating, skillRatingMax } from './resume-model';

function generateArray<T>(generateItem: () => T, min: number = 2, max: number = 8): () => T[] {
	return (): T[] => {
		const result: T[] = [];
		for (let index = 0; index < faker.random.number({ max, min }); index++) {
			result.push(generateItem());
		}
		return result;
	};
}

function generateObject<T>(
	generateKey: () => string,
	generateValue: () => T,
	min: number = 2,
	max: number = 8,
): () => Record<string, T> {
	return (): Record<string, T> => {
		const result: Record<string, T> = {};
		for (let index = 0; index < faker.random.number({ max, min }); index++) {
			result[generateKey()] = generateValue();
		}
		return result;
	};
}

function generateSkills(): SkillCategoriesRecord {
	function generateSkillCategory(): string {
		return `${faker.hacker.adjective()} ${faker.hacker.noun()}`;
	}

	function generateSkillRating(): SkillRating {
		return {
			rating: faker.random.number({ max: skillRatingMax, min: 1 }),
			skill: faker.hacker.abbreviation(),
		};
	}

	return generateObject(generateSkillCategory, generateArray(generateSkillRating), 3)();
}

export function provideFakeResume(): Promise<ResumeModel> {
	const firstName: string = faker.name.firstName();
	const lastName: string = faker.name.lastName();
	const email: string = faker.internet.email(firstName, lastName);
	const phone: string = faker.phone.phoneNumber();
	const website: string = faker.internet.url();

	const resume: ResumeModel = {
		candidate: {
			contactServices: [
				{
					handle: phone,
					name: 'Phone',
					url: `tel:${phone}`,
				},
				{
					handle: email,
					name: 'Email',
					url: `mailto:${email}`,
				},
				{
					handle: website,
					name: 'Website',
					url: website,
				},
			],
			name: faker.name.findName(firstName, lastName),
		},
		experiences: [],
		interests: {},
		mission: faker.lorem.paragraph(3),
		skills: generateSkills(),
	};

	return Promise.resolve(resume);
}
