import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Experience, ResumeProps } from '../resume/resume-model';
import { drawChart } from './ExperienceTimeline.d3';

type Props = ResumeProps;

export function ExperienceTimeline(props: Props) {
	const [div, setDiv] = useState<HTMLDivElement | null>(null);
	const [innerDivRef, isInView, intersectionObserverEntry] = useInView({
		threshold: 0.25,
		triggerOnce: true,
	});
	const divRef = useCallback(
		(node: HTMLDivElement | null): void => {
			innerDivRef(node);
			setDiv(node);
		},
		[innerDivRef],
	);

	useEffect((): void => {
		if (!div || !intersectionObserverEntry) {
			return;
		}

		drawChart({
			drawForeground: isInView,
			experiences: props.resume.experiences,
			parent: div,
			yearLabelContext: ,
			yearLabelFont: ,
			yearLabelFontSize: 12,
			yearLabelLineHeight: 16,
		});
	}, [div, intersectionObserverEntry, isInView, props.resume.experiences]);

	return (
		<div
			className="experience-timeline-component"
			ref={divRef}
			style={{ position: 'relative' }}
		>
			{isInView && (
				<div style={{ bottom: 0, left: 100, position: 'absolute', right: 0, top: 0 }}>
					{props.resume.experiences
						.sort(
							(left: Experience, right: Experience): number =>
								right.startDate.getTime() - left.startDate.getTime(),
						)
						.map((experience: Experience) => (
							<article key={`${experience.role} ${experience.organization}`}>
								<h3>
									{experience.role} {experience.organization}
								</h3>
								<ul className="list-disc list-inside">
									{experience.highlights.map(
										(highlight: string, highlightIndex: number) => (
											<li key={highlightIndex}>{highlight}</li>
										),
									)}
								</ul>
							</article>
						))}
				</div>
			)}
		</div>
	);
}
