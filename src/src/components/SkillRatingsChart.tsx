import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { SkillRating, SkillRatingsRecord, skillRatingsRecordToArray } from '../resume';
import { Rectangle } from './rectangle';

interface Props {
	skillRatings: SkillRatingsRecord;
}

export const SkillRatingsChart: FC<Props> = (props: Props) => {
	// Declare some helpful skill values.
	const skillRatingMax = 5;

	const skillLevelObjects = useMemo(
		(): SkillRating[] =>
			skillRatingsRecordToArray({
				Capable: skillRatingMax * 0.15,
				Proficient: skillRatingMax * 0.5,
				Expert: skillRatingMax * 0.85,
			}),
		[],
	);

	const skillRatingObjects = useMemo(
		(): SkillRating[] => skillRatingsRecordToArray(props.skillRatings),
		[props.skillRatings],
	);

	// Declare some constants for sizing.
	const fontSize = 20;
	const plotRegionMargin = fontSize / 2;
	const xLabelsHeight = fontSize * 2.5;
	const yLabelsWidth = fontSize * 4;

	const { ref, width } = useResizeObserver<HTMLDivElement>();

	type Regions = Record<'chart' | 'plot' | 'xLabels' | 'yLabels', Rectangle>;

	const regions = useMemo((): Regions | undefined => {
		if (!width) {
			return undefined;
		}

		const chart = new Rectangle({
			x: 0,
			y: 0,
			width,
			height: skillRatingObjects.length * fontSize + plotRegionMargin + xLabelsHeight,
		});

		const plot = new Rectangle({
			x: chart.x + yLabelsWidth + plotRegionMargin,
			y: chart.y,
			width: chart.width - yLabelsWidth - plotRegionMargin,
			height: chart.height - xLabelsHeight - plotRegionMargin,
		});

		const yLabels = new Rectangle({
			x: chart.x,
			y: chart.y,
			width: yLabelsWidth,
			height: chart.height - xLabelsHeight - plotRegionMargin,
		});

		const xLabels = new Rectangle({
			x: chart.x + yLabelsWidth + plotRegionMargin,
			y: chart.bottom - xLabelsHeight,
			width: chart.width - yLabelsWidth - plotRegionMargin,
			height: xLabelsHeight,
		});

		return {
			chart,
			plot,
			xLabels,
			yLabels,
		};
	}, [skillRatingObjects.length, width]);

	useEffect((): void => {
		if (!ref.current || !regions) {
			return;
		}

		// Initialize functions for plotting.
		const scale = d3
			.scaleLinear()
			.domain([0, skillRatingMax])
			.range([regions.plot.x, regions.plot.right]);

		function range(skillRating: SkillRating): number {
			return scale(skillRating.rating);
		}

		function rating(skillRating: SkillRating): number {
			return skillRating.rating;
		}

		function skill(skillRating: SkillRating): string {
			return skillRating.skill;
		}

		const container = d3.select(ref.current);
		// Create the SVG element and child groups.
		// const outlineRegions = true;
		// if (outlineRegions) {
		// 	const outlinesGroup = svg.append('g').attr('class', 'outlines');
		// 	for (const region of [xLabelsRegion, yLabelsRegion, regions.plot]) {
		// 		outlinesGroup
		// 			.append('rect')
		// 			.attr('fill', 'none')
		// 			.attr('height', region.height)
		// 			.attr('stroke', 'red')
		// 			.attr('width', region.width)
		// 			.attr('x', region.left)
		// 			.attr('y', region.top);
		// 	}
		// }

		// Draw the grid.
		container
			.select('g.x-grid')
			.selectAll('polyline')
			.data(skillLevelObjects)
			.join('polyline')
			.attr('data-level', skill)
			.attr('data-rating', rating)
			.attr('fill', 'none')
			.attr('points', (skillLevel: SkillRating): string => {
				const x0 = range(skillLevel);
				const y0 = regions.plot.y;
				const x1 = x0;
				const y1 = regions.xLabels.y;
				const x2 = x0 - xLabelsHeight;
				const y2 = regions.xLabels.bottom;
				return `${x0},${y0} ${x1},${y1} ${x2},${y2}`;
			});

		// Draw the labels.
		container
			.select('g.x-labels')
			.selectAll('text')
			.data(skillLevelObjects)
			.join('text')
			.attr('data-level', skill)
			.attr('data-rating', rating)
			.attr('text-anchor', 'end')
			.attr(
				'transform',
				(skillLevel: SkillRating): string =>
					`rotate(-45,${range(skillLevel)},${regions.xLabels.y + fontSize})`,
			)
			.attr('x', range)
			.attr('y', regions.xLabels.y)
			.text(skill);

		container
			.select('g.y-labels')
			.selectAll('text')
			.data(skillRatingObjects)
			.join('text')
			.attr('text-anchor', 'end')
			.attr('x', regions.yLabels.right)
			.attr('y', (_, skillIndex: number): number => skillIndex * fontSize + fontSize * 0.9)
			.text(skill);

		// Draw the bars.
		container
			.select('g.bars')
			.selectAll('rect')
			.data(skillRatingObjects)
			.join('rect')
			.attr('data-skill', skill)
			.attr('data-rating', rating)
			.attr('height', fontSize * 0.6)
			.attr('width', (skillRating: SkillRating): number => range(skillRating) - scale(0))
			.attr('x', scale(0))
			.attr('y', (_, skillIndex: number): number => skillIndex * fontSize + fontSize * 0.4);
	}, [ref, regions, skillLevelObjects, skillRatingObjects]);

	// Create some unique IDs for SVG fragment IDs.
	const [linearGradientId] = useState(uniqueId('linear-gradient-'));
	const [maskId] = useState(uniqueId('mask-'));

	return (
		<div className="skill-ratings-chart" id="" ref={ref}>
			{regions && (
				<svg height={regions.chart.height} width="100%">
					<defs>
						<linearGradient id={linearGradientId}>
							<stop offset="0" stopColor="white" stopOpacity={1 / 3} />
							<stop offset="1" stopColor="white" stopOpacity="1" />
						</linearGradient>
						<mask id={maskId}>
							<rect fill={`url(#${linearGradientId})`} {...regions.plot} />
						</mask>
					</defs>
					<g className="x-grid" />
					<g className="x-labels" />
					<g className="y-labels" />
					<g className="bars" mask={`url(#${maskId})`} />
				</svg>
			)}
		</div>
	);
};
