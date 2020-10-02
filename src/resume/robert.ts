import { ResumeModel } from './resume-model';

export const robert: ResumeModel = {
	candidate: {
		contactServices: [
			{
				handle: '952-994-6216',
				name: 'Phone',
				url: 'tel:+19529946216',
			},
			{
				handle: 'robert@robertbullen.com',
				name: 'Email',
				url: 'mailto:robert@robertbullen.com',
			},
			{
				handle: 'https://robertbullen.com',
				name: 'Website',
				url: 'https://robertbullen.com',
			},
			{
				handle: '@robertbullen',
				name: 'GitHub',
				url: 'https://github.com/robertbullen',
			},
			{
				handle: 'Robert Bullen',
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/robertbullen/',
			},
			{
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
		{
			highlights: [
				'Architected and led the development of insurecareteams.com, an AWS serverless web application using TypeScript, React, and Express',
				'Established a CI/CD process that integrated GitHub & CodeBuild to perform cross-account AWS deployments using either Pulumi or the AWS CDK',
				'Fostered team knowledge transfer with regular lunch & learns',
			],
			organization: 'Constellation',
			role: 'Principal Product Engineer',
			startDate: new Date('2018-02-26'),
		},
	],
	interests: {
		'Analytical Pursuits': [
			{
				column: 0,
				row: 2,
				name: 'Automation',
			},
			{
				column: 1,
				row: 1,
				name: 'Packet Analysis',
			},
			{
				column: 1,
				row: 3,
				name: 'Unit Testing',
			},
			{
				column: 2,
				row: 2,
				name: 'Analytical Pursuits',
			},
			{
				column: 2,
				row: 4,
				name: 'Web Services',
			},
			{
				column: 3,
				row: 1,
				name: 'Data Visualization',
			},
			{
				column: 3,
				row: 3,
				name: 'Coding Languages',
			},
			{
				column: 4,
				row: 0,
				name: 'Charting',
			},
			{
				column: 4,
				row: 2,
				name: 'Software Engineering',
			},
			{
				column: 5,
				row: 1,
				name: 'User Interface Design',
			},
		],
		'Creative Interests': [
			{
				column: 4,
				row: 4,
				name: 'Architecture',
			},
			{
				column: 5,
				row: 3,
				name: 'Design Patterns',
			},
			{
				column: 6,
				row: 0,
				name: 'Typography',
			},
			{
				column: 6,
				row: 2,
				name: 'User Experience',
			},
			{
				column: 7,
				row: 1,
				name: 'Graphic Design',
			},
			{
				column: 7,
				row: 3,
				name: '???',
			},
			{
				column: 8,
				row: 0,
				name: 'Illustration',
			},
			{
				column: 8,
				row: 2,
				name: 'Creative Interests',
			},
			{
				column: 9,
				row: 1,
				name: 'Photo-graphy',
			},
			{
				column: 9,
				row: 3,
				name: 'Music',
			},
			{
				column: 10,
				row: 2,
				name: 'Video-graphy',
			},
		],
	},
	mission:
		'Robert leverages his analytical and creative talents to the fullest when designing and writing modern full stack applications. He is experienced with and enthusiastic about discovering and adopting promising software development technologies and practices.',
	skills: {
		'Soft Skills': [
			{ rating: 4.0, skill: 'End User Focus' },
			{ rating: 4.0, skill: 'Communication' },
			{ rating: 4.0, skill: 'Cont. Learning' },
			{ rating: 4.0, skill: 'Mentorship' },
			{ rating: 4.0, skill: 'Presenting' },
		],
		'Architecture & Design': [
			{ rating: 3.5, skill: 'AWS' },
			{ rating: 3.5, skill: 'CI/CD' },
			{ rating: 4.5, skill: 'Design Patterns' },
			{ rating: 4.0, skill: 'OOP' },
			{ rating: 3.5, skill: 'REST APIs' },
		],
		'Programming Languages': [
			{ rating: 4.0, skill: 'HTML+CSS' },
			{ rating: 4.5, skill: 'JavaScript' },
			{ rating: 2.5, skill: 'Python' },
			{ rating: 3.0, skill: 'SQL' },
			{ rating: 5.0, skill: 'TypeScript' },
		],
		'JavaScript Frameworks': [
			{ rating: 1.5, skill: 'Angular' },
			{ rating: 2.0, skill: 'D3' },
			{ rating: 4.0, skill: 'Express' },
			{ rating: 4.0, skill: 'Node.js' },
			{ rating: 3.0, skill: 'React' },
			{ rating: 4.0, skill: 'Jest' },
			{ rating: 3.0, skill: 'Vue' },
		],
		'Packet Analysis': [
			{ rating: 5.0, skill: 'TCP/IP' },
			{ rating: 5.0, skill: 'HTTP' },
			{ rating: 4.0, skill: 'SSL/TLS' },
			{ rating: 4.0, skill: 'Wireshark' },
		],
	},
};
