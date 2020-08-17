import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
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
			{ rating: skillRatingMax * 0.15, skill: 'Capable' },
			{ rating: skillRatingMax * 0.5, skill: 'Proficient' },
			{ rating: skillRatingMax * 0.85, skill: 'Expert' },
		],
		[],
	);

	// Declare some constants for sizing.
	const { ref, width } = useResizeObserver<HTMLDivElement>();

	const computedStyle: CSSStyleDeclaration | null =
		ref.current && window.getComputedStyle(ref.current);
	const fontSize: number = computedStyle
		? Number.parseFloat(computedStyle.getPropertyValue('font-size'))
		: 14;
	const lineHeight: number = computedStyle
		? Number.parseFloat(computedStyle.getPropertyValue('line-height'))
		: fontSize * 1.25;

	const plotRegionMargin = fontSize / 2;
	const xLabelsHeight = lineHeight * 3;
	const yLabelsWidth = lineHeight * 4.5;

	type Regions = Record<'chart' | 'plot' | 'xLabels' | 'yLabels', Rectangle>;

	const regions = useMemo((): Regions | undefined => {
		if (!width) {
			return undefined;
		}

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
	}, [
		lineHeight,
		plotRegionMargin,
		props.skillRatings.length,
		width,
		xLabelsHeight,
		yLabelsWidth,
	]);

	const [sortBy, setSortBy] = useState<keyof SkillRating>(props.sortBy ?? 'skill');
	const [sortDesc, setSortDesc] = useState<boolean>(props.sortDesc ?? sortBy === 'rating');

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

		// Draw the grid.
		container
			.select('g.x-grid')
			.selectAll('polyline')
			.data(skillLevels)
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

		// Draw the x-axis labels.
		container
			.select('g.x-labels')
			.selectAll('text')
			.data(skillLevels)
			.join('text')
			.attr('data-level', skill)
			.attr('data-rating', rating)
			.attr('text-anchor', 'end')
			.attr(
				'transform',
				(skillLevel: SkillRating): string =>
					`rotate(-45,${range(skillLevel)},${regions.xLabels.y})`,
			)
			.attr('x', range)
			.attr('y', regions.xLabels.y + fontSize)
			.text(skill);

		// Draw the y-axis labels and bars.
		type Comparer = Parameters<Array<SkillRating>['sort']>[0];
		const comparer: Comparer = (left: SkillRating, right: SkillRating): number => {
			let result: number =
				sortBy === 'rating'
					? left.rating - right.rating
					: left.skill.localeCompare(right.skill);
			if (sortDesc) {
				result = -result;
			}
			return result;
		};
		const sortedSkillRatings = props.skillRatings.slice().sort(comparer);

		container
			.select('g.y-labels')
			.selectAll('text')
			.data(sortedSkillRatings)
			.join('text')
			.attr('text-anchor', 'end')
			.attr('x', regions.yLabels.right)
			.attr('y', (_, skillIndex: number): number => skillIndex * lineHeight + fontSize)
			.text(skill);

		container
			.select('g.bars')
			.selectAll('rect')
			.data(sortedSkillRatings)
			.join('rect')
			.attr('data-skill', skill)
			.attr('data-rating', rating)
			.attr('height', fontSize * 0.75)
			.attr('width', (skillRating: SkillRating): number => range(skillRating) - scale(0))
			.attr('x', scale(0))
			.attr('y', (_, skillIndex: number): number => skillIndex * lineHeight + fontSize * 0.3);
	}, [
		fontSize,
		lineHeight,
		props.skillRatings,
		ref,
		regions,
		skillLevels,
		sortBy,
		sortDesc,
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
