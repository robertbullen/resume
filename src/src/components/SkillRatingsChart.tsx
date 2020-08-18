import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { SkillRating, skillRatingMax } from '../resume';
import { Rectangle } from './rectangle';

interface Props {
	skillRatings: SkillRating[];
	sortBy?: keyof SkillRating;
	sortDesc?: boolean;
}

export const SkillRatingsChart: FC<Props> = (props: Props) => {
	// Declare some helpful skill values.
	const skillLevels = useMemo(
		(): SkillRating[] => [
			{ rating: skillRatingMax * 0.1, skill: 'Capable' },
			{ rating: skillRatingMax * 0.5, skill: 'Proficient' },
			{ rating: skillRatingMax * 0.9, skill: 'Expert' },
			// { rating: 0, skill: '0' },
			// { rating: 1, skill: '1' },
			// { rating: 2, skill: '2' },
			// { rating: 3, skill: '3' },
			// { rating: 4, skill: '4' },
			// { rating: 5, skill: '5' },
		],
		[],
	);

	// Declare some variables for dynamic (re)sizing.
	const { ref, width } = useResizeObserver<HTMLDivElement>();

	const computedStyle: CSSStyleDeclaration | null =
		ref.current && window.getComputedStyle(ref.current);
	const fontSize: number = computedStyle
		? Number.parseFloat(computedStyle.getPropertyValue('font-size'))
		: 14;
	const lineHeight: number = computedStyle
		? Number.parseFloat(computedStyle.getPropertyValue('line-height'))
		: fontSize * 1.25;

	const xLabelsRotationDegrees = 30;

	// TODO: These two values should be dynamically determined by using a Canvas context to measure
	// precisely the dimensions that are needed.
	const xLabelsHeight = lineHeight * 2.5;
	const yLabelsWidth = lineHeight * 6;

	type Regions = Record<'chart' | 'plot' | 'xLabels' | 'yLabels', Rectangle>;
	const regions = useMemo((): Regions | undefined => {
		if (!width) {
			return undefined;
		}

		const plotRegionMargin = fontSize / 2;

		const chart = new Rectangle({
			x: 0,
			y: 0,
			width,
			height: props.skillRatings.length * lineHeight + plotRegionMargin + xLabelsHeight,
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
	}, [fontSize, lineHeight, props.skillRatings.length, width, xLabelsHeight, yLabelsWidth]);

	// Declare some state and a function for sorting.
	const [sortBy, setSortBy] = useState<keyof SkillRating>(props.sortBy ?? 'skill');
	const [sortDesc, setSortDesc] = useState<boolean>(props.sortDesc ?? sortBy === 'rating');

	const sortComparer = useCallback(
		(left: SkillRating, right: SkillRating): number => {
			let result: number =
				sortBy === 'rating' && left.rating !== right.rating
					? left.rating - right.rating
					: left.skill.localeCompare(right.skill);
			if (sortDesc) {
				result = -result;
			}
			return result;
		},
		[sortBy, sortDesc],
	);

	useEffect((): void => {
		// Ensure that the necessary pieces are defined.
		if (!ref.current || !regions) {
			return;
		}

		// Initialize a D3 starting point with the component root.
		const container = d3.select(ref.current);

		// Initialize general purpose functions for plotting.
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

		// Draw the grid and x-axis labels.

		// The grid lines have "tails" (a.k.a. axis marks) that extend downward from the plot
		// region into the x-axis labels region. The tails are the hypotenuse of a right triangle
		// having height `opposite` and angle `theta` (counter-clockwise radians from 9 o'clock).
		// This function calculates the polyline points of a single grid line.
		function xGridPoints(skillLevel: SkillRating): string {
			const opposite = xLabelsHeight;
			const theta = (xLabelsRotationDegrees * Math.PI) / 180;
			const adjacent = opposite / Math.tan(theta);

			const x0 = range(skillLevel);
			const y0 = regions!.plot.y;
			const x1 = x0;
			const y1 = regions!.xLabels.y;
			const x2 = x0 - adjacent;
			const y2 = regions!.xLabels.bottom;

			return `${x0},${y0} ${x1},${y1} ${x2},${y2}`;
		}

		container
			.select('g.x-grid')
			.selectAll('polyline')
			.data(skillLevels)
			.join('polyline')
			.attr('data-level', skill)
			.attr('data-rating', rating)
			.attr('fill', 'none')
			.attr('points', xGridPoints);

		function xLabelTransform(skillLevel: SkillRating): string {
			return `rotate(-${xLabelsRotationDegrees},${range(skillLevel)},${regions!.xLabels.y})`;
		}

		const xLabelY = regions.xLabels.y + fontSize;

		container
			.select('g.x-labels')
			.selectAll('text')
			.data(skillLevels)
			.join('text')
			.attr('data-level', skill)
			.attr('data-rating', rating)
			.attr('text-anchor', 'end')
			.attr('transform', xLabelTransform)
			.attr('x', range)
			.attr('y', xLabelY)
			.text(skill);

		// Draw the y-axis labels and bars.
		const sortedSkillRatings = props.skillRatings.slice().sort(sortComparer);

		const durationShortMilliseconds = 500;
		const durationLongMilliseconds = 2000;

		const yLabelX = regions.yLabels.right;

		function yLabelY(_skillRating: SkillRating, skillIndex: number): number {
			return skillIndex * lineHeight + fontSize;
		}

		container
			.select('g.y-labels')
			.selectAll<SVGTextElement, SkillRating>('text')
			.data(sortedSkillRatings, skill)
			.join(
				(enter) =>
					enter
						.append('text')
						.attr('data-skill', skill)
						.attr('data-rating', rating)
						.attr('text-anchor', 'end')
						.attr('x', yLabelX)
						.attr('y', yLabelY)
						.text(skill),
				(update) =>
					update.call((update) =>
						update.transition().duration(durationShortMilliseconds).attr('y', yLabelY),
					),
			);

		const barHeight = fontSize * 0.75;

		function barY(_skillRating: SkillRating, skillIndex: number): number {
			return skillIndex * lineHeight + fontSize * 0.3;
		}

		function barWidth(skillRating: SkillRating): number {
			return range(skillRating) - scale(0);
		}

		container
			.select('g.bars')
			.selectAll<SVGRectElement, SkillRating>('rect')
			.data(sortedSkillRatings, skill)
			.join(
				(enter) =>
					enter
						.append('rect')
						.attr('data-skill', skill)
						.attr('data-rating', rating)
						.attr('height', barHeight)
						.attr('width', 0)
						.attr('x', scale(0))
						.attr('y', barY)
						.call((enter) =>
							enter
								.transition()
								.duration(durationLongMilliseconds)
								.attr('width', barWidth),
						),
				(update) =>
					update.call((update) =>
						update
							.attr('width', barWidth)
							.transition()
							.duration(durationShortMilliseconds)
							.attr('y', barY),
					),
			);
	}, [
		fontSize,
		lineHeight,
		props.skillRatings,
		ref,
		regions,
		skillLevels,
		sortComparer,
		xLabelsHeight,
	]);

	// Create some unique IDs for SVG fragment IDs.
	const [linearGradientId] = useState(uniqueId('linear-gradient-'));
	const [maskId] = useState(uniqueId('mask-'));

	return (
		<div className="skill-ratings-chart-component" ref={ref}>
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
					<g
						className="y-labels"
						onClick={(): void => {
							setSortDesc(sortBy === 'skill' ? !sortDesc : false);
							setSortBy('skill');
						}}
						style={{ cursor: 'pointer' }}
					/>
					<g
						className="bars"
						mask={`url(#${maskId})`}
						onClick={(): void => {
							setSortDesc(sortBy === 'rating' ? !sortDesc : true);
							setSortBy('rating');
						}}
						style={{ cursor: 'pointer' }}
					/>
				</svg>
			)}
		</div>
	);
};
