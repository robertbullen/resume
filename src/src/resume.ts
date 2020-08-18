export interface ContactService {
	fontAwesomeClassNames: string;
	handle: string;
	name: string;
	url: string;
}

export interface Candidate {
	contactServices: ContactService[];
	name: string;
}

export interface SkillRating {
	rating: number;
	skill: string;
}

export const skillRatingMax = 5;

export type SkillCategoriesRecord = Record<string, SkillRating[]>;

export interface Experience {
	finishDate: Date;
	highlights: string[];
	organization: string;
	role: string;
	startDate: Date;
}

export interface Resume {
	candidate: Candidate;
	experiences: Experience[];
	mission: string;
	skills: SkillCategoriesRecord;
}

const useSquareIcons = true;

export const robert: Resume = {
	candidate: {
		contactServices: [
			{
				fontAwesomeClassNames: useSquareIcons
					? 'fas fa-envelope-square'
					: 'fas fa-envelope',
				handle: 'robert@robertbullen.com',
				name: 'Email',
				url: 'mailto:robert@robertbullen.com',
			},
			// {
			// 	fontAwesomeClassNames: useSquareIcons ? 'fas fa-phone-square' : 'fas fa-mobile-alt',
			// 	handle: '952-994-6216',
			// 	name: 'Phone',
			// 	url: 'tel:+19529946216',
			// },
			{
				fontAwesomeClassNames: useSquareIcons
					? 'fab fa-github-square'
					: 'fab fa-github-alt',
				handle: '@robertbullen',
				name: 'GitHub',
				url: 'https://github.com/robertbullen',
			},
			{
				fontAwesomeClassNames: useSquareIcons ? 'fab fa-twitter-square' : 'fab fa-twitter',
				handle: '@BullenRobert',
				name: 'Twitter',
				url: 'https://twitter.com/BullenRobert',
			},
		],
		name: 'Robert Bullen',
	},
	experiences: [
		{
			finishDate: new Date('1999-12-01'),
			highlights: [],
			organization: 'University of Minnesota, I.T.',
			role: 'B.S. in Computer Science',
			startDate: new Date('1994-09-01'),
		},
	],
	mission:
		'Robert leverages his analytical and creative talents to the fullest when designing and writing modern full stack applications. He is enthusiastic and experienced when it comes to discovering promising software development technologies and adopting best practices.',
	skills: {
		'Software Engineering': [
			{ rating: 2.0, skill: 'D3' },
			{ rating: 4.0, skill: 'Express' },
			{ rating: 4.0, skill: 'HTML+CSS' },
			{ rating: 4.0, skill: 'JavaScript' },
			{ rating: 4.0, skill: 'Node.js' },
			{ rating: 4.0, skill: 'OOP' },
			{ rating: 3.0, skill: 'React' },
			{ rating: 3.0, skill: 'SQL' },
			{ rating: 5.0, skill: 'TypeScript' },
			{ rating: 4.0, skill: 'Unit Testing' },
			{ rating: 3.0, skill: 'Vue' },
		],
		'Architecture & Leadership': [
			{ rating: 4.0, skill: 'AWS' },
			{ rating: 3.5, skill: 'CI/CD' },
			{ rating: 3.5, skill: 'REST' },
			{ rating: 4.0, skill: 'End User Focus' },
			{ rating: 4.5, skill: 'Design Patterns' },
			{ rating: 4.0, skill: 'Communication' },
			{ rating: 4.0, skill: 'Cont. Learning' },
			{ rating: 4.0, skill: 'Mentorship' },
		],
		'Packet Analysis': [
			{ rating: 5.0, skill: 'TCP/IP' },
			{ rating: 5.0, skill: 'HTTP' },
			{ rating: 4.0, skill: 'SSL/TLS' },
			{ rating: 4.0, skill: 'Wireshark' },
		],
	},
};

export interface ResumeProps {
	resume: Resume;
}

// DevSecOps Engineer Senior Constellation
// • Architected and led the development of insurecareteams.com, an AWS
// serverless web application using TypeScript, React, and Express
// • Established a CI/CD process integrating GitHub & CodeBuild to perform
// cross-account AWS deployments using either pulumi or the AWS CDK • Fostered team knowledge transfer with regular lunch & learns
