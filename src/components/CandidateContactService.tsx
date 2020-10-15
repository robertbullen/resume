import React, { FC } from 'react';
import { ContactService } from '../resume/resume-model';

export type IconCssClasses = Record<string, string> & { default: string };

export function fontAwesomeIconCssClasses(): IconCssClasses {
	return {
		default: 'far fa-address-card',
		Email: 'fas fa-envelope',
		GitHub: 'fab fa-github-alt',
		LinkedIn: 'fab fa-linkedin-in',
		Phone: 'fas fa-phone-square',
		Twitter: 'fab fa-twitter',
		Website: 'fas fa-globe',
	};
}

export function fontAwesomeSquareIconCssClasses(): IconCssClasses {
	return {
		default: 'fas fa-address-card',
		Email: 'fas fa-envelope-square',
		GitHub: 'fab fa-github-square',
		LinkedIn: 'fab fa-linkedin',
		Phone: 'fas fa-phone-square',
		Twitter: 'fab fa-twitter-square',
		Website: 'fab fa-dribbble-square',
	};
}

interface Props {
	contactService: ContactService;
	iconCssClasses?: IconCssClasses;
}

export function CandidateContactService(props: Props) {
	const actualProps = props as Required<Props>;
	return (
		<div className="candidate-contact-service-component truncate">
			<a
				href={actualProps.contactService.url}
				style={{ whiteSpace: 'nowrap' }}
				title={actualProps.contactService.name}
			>
				<i
					className={
						actualProps.iconCssClasses[actualProps.contactService.name] ??
						actualProps.iconCssClasses.default
					}
				></i>
				<span>{actualProps.contactService.handle}</span>
			</a>
		</div>
	);
}
(CandidateContactService as FC<Props>).defaultProps = {
	iconCssClasses: fontAwesomeSquareIconCssClasses(),
};
