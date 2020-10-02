export interface ContactService {
	handle: string;
	name: string;
	url: string;
}

export interface Candidate {
	contactServices: ContactService[];
	name: string;
}

export interface Interest {
	column: number;
	row: number;
	name: string;
}

export type InterestsRecord = Record<string, Interest[]>;

export interface SkillRating {
	rating: number;
	skill: string;
}

export function getRating(skillRating: SkillRating): number {
	return skillRating.rating;
}

export function getSkill(skillRating: SkillRating): string {
	return skillRating.skill;
}

export const skillRatingMax = 5;

export function skillRatingLevels(): SkillRating[] {
	return [
		{ rating: 0.5, skill: 'Functional' },
		{ rating: 2.5, skill: 'Proficient' },
		{ rating: 4.5, skill: 'Exceptional' },
		// { rating: 0, skill: '0' },
		// { rating: 1, skill: '1' },
		// { rating: 2, skill: '2' },
		// { rating: 3, skill: '3' },
		// { rating: 4, skill: '4' },
		// { rating: 5, skill: '5' },
	];
}

export type SkillCategoriesRecord = Record<string, SkillRating[]>;

export interface Experience {
	finishDate?: Date;
	highlights: string[];
	organization: string;
	role: string;
	startDate: Date;
}

export interface ResumeModel {
	candidate: Candidate;
	experiences: Experience[];
	interests: InterestsRecord;
	mission: string;
	skills: SkillCategoriesRecord;
}

export interface ResumeProps {
	resume: ResumeModel;
}
