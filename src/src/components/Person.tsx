import React, { FC } from 'react';
import {} from 'reactstrap';
import { ContactService, ResumeProps } from '../resume';

export const Person: FC<ResumeProps> = (props: ResumeProps) => {
	return (
		<div className="person">
			<h1 className="display-3 text-uppercase">{props.resume.person.name}</h1>
			<ul className="list-inline">
				{props.resume.person.contactServices.map(
					(service: ContactService, serviceIndex: number) => (
						<li className="list-inline-item" key={serviceIndex}>
							{service.iconUrl && (
								<img
									alt={service.name}
									src={service.iconUrl}
									title={service.name}
								/>
							)}
							<a href={service.url} title={service.name}>
								{service.handle}
							</a>
						</li>
					),
				)}
			</ul>
		</div>
	);
};
