import * as d3 from 'd3';
import React, { FC, useEffect, useRef } from 'react';
import { SkillRatings } from '../resume';

interface Props {
	skillRatings: SkillRatings;
}

export const SkillRatingsChart: FC<Props> = (props: Props) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect((): void => {
		const svgElement: SVGSVGElement | null = svgRef.current;
		if (!svgElement) {
			return;
		}

		type SkillRatingTuple = [string, number];
		const skillRatingsTuples: SkillRatingTuple[] = Object.entries(props.skillRatings);

		d3.select(svgElement)
			.selectAll('text')
			.data(skillRatingsTuples)
			.join('text')
			.attr('x', 0)
			.attr('y', (_tuple: SkillRatingTuple, skillIndex: number): number => skillIndex * 16)
			.text((tuple: SkillRatingTuple): string => tuple[0]);
	}, [props.skillRatings]);

	return (
		<div className="skill-ratings-chart">
			<svg ref={svgRef}></svg>
		</div>
	);
};
