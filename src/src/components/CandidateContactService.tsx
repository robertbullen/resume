import React, { FC } from 'react';
import { ContactService } from '../resume';
interface Props {
	contactService: ContactService;
}

export const CandidateContactService: FC<Props> = (props: Props) => {
	return (
		<div className="candidate-contact-service-component">
			<a href={props.contactService.url} title={props.contactService.name}>
				<i className={props.contactService.fontAwesomeClassNames}></i>
				{props.contactService.handle}
			</a>
		</div>
	);
};
