import classNames from 'classnames';
import React, { FC } from 'react';
import { ContactService } from '../resume';
interface Props {
	contactService: ContactService;
}

export const CandidateContactService: FC<Props> = (props: Props) => {
	return (
		<div className="candidate-contact-service-component" title={props.contactService.name}>
			<a href={props.contactService.url} title={props.contactService.name}>
				<i className={classNames('mr-1', props.contactService.fontAwesomeClassNames)}></i>
				{props.contactService.handle}
			</a>
		</div>
	);
};
