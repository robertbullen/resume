export interface ContactService {
	handle: string;
	iconUrl?: string;
	name: string;
	url: string;
}

export interface Person {
	contactServices: ContactService[];
	name: string;
}

export type SkillRatings = Record<string, number>;
export type SkillCategories = Record<string, SkillRatings>;

export interface Resume {
	mission: string;
	person: Person;
	skills: SkillCategories;
}

export interface ResumeProps {
	resume: Resume;
}

export const robert: Resume = {
	mission:
		'Robert leverages his analytical and creative talents to the fullest when designing and writing modern full stack applications. He is enthusiastic and experienced when it comes to discovering promising software development technologies and adopting best practices.',
	person: {
		contactServices: [
			{
				handle: 'robert@robertbullen.com',
				name: 'Email',
				url: 'mailto:robert@robertbullen.com',
			},
			// {
			//     service: 'Phone',
			//     text: '952-994-6216',
			//     url: 'tel:+19529946216',
			// },
			{
				handle: '@robertbullen',
				name: 'GitHub',
				url: 'https://github.com/robertbullen',
			},
			{
				handle: '@BullenRobert',
				name: 'Twitter',
				url: 'https://twitter.com/BullenRobert',
			},
		],
		name: 'Robert Bullen',
	},
	skills: {
		'Software Engineering': {
			'Express': 4,
			'HTML+CSS': 4,
			'JavaScript': 4,
			'Node.js': 4,
			'OOP': 4,
			'React': 3,
			'SQL': 3,
			'TypeScript': 5,
			'Unit Testing': 4,
			'Vue': 3,
		},
		'Architecture & Leadership': {
			AWS: 4,
		},
		'Packet Analysis': {
			Foo: 5,
		},
	},
};
