import * as d3 from 'd3';
import React, { FC, useEffect, useRef } from 'react';
import { SkillRatings } from '../resume';

interface Props {
	skillRatings: SkillRatings;
}

export const SkillRatingsChart: FC<Props> = (props: Props) => {
	const skillBarsClass = 'skill-bars';
	const skillLabelsClass = 'skill-labels';

	const svgRef = useRef<SVGSVGElement>(null);

	useEffect((): void => {
		const svgElement: SVGSVGElement | null = svgRef.current;
		if (!svgElement) {
			return;
		}

		type SkillRatingTuple = [string, number];
		const skillRatingsTuples: SkillRatingTuple[] = Object.entries(props.skillRatings);

		const svgSelection = d3.select(svgElement);

		svgSelection
			.select(`g.${skillLabelsClass}`)
			.selectAll('text')
			.data(skillRatingsTuples)
			.join('text')
			.attr('x', 0)
			.attr('y', (_, skillIndex: number): number => skillIndex * 16 + 16)
			.text((tuple: SkillRatingTuple): string => tuple[0]);

		svgSelection
			.select(`g.${skillBarsClass}`)
			.selectAll('rect')
			.data(skillRatingsTuples)
			.join('rect')
			.attr('x', 50)
			.attr('y', (_, skillIndex: number): number => skillIndex * 16 + 2)
			.attr('width', 100)
			.attr('height', 12);
	}, [props.skillRatings]);

	return (
		<div className="skill-ratings-chart">
			<svg ref={svgRef}>
				<g className={skillLabelsClass} />
				<g className={skillBarsClass} />
			</svg>
		</div>
	);
};
