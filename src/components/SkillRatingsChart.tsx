import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useResizeObserver from 'use-resize-observer';
import { measureText, MeasureTextResult } from '../drawing/measure-text';
import { Point } from '../drawing/point';
import { Rectangle } from '../drawing/rectangle';
import { useMeasureTextParams, UseMeasureTextParamsResult } from '../hooks/use-measure-text-params';
import {
	getRating,
	getSkill,
	ResumeProps,
	SkillRating,
	skillRatingLevels,
	skillRatingMax,
} from '../resume/resume-model';

const debug = false;

const durations = {
	get short(): number {
		return 100;
	},
	get medium(): number {
		return this.short * 5;
	},
	get long(): number {
		return this.short * 20;
	},
};

const xLabelsRotateDegrees = -30;
const xLabelsRotateRadians = (xLabelsRotateDegrees * Math.PI) / 180;

interface Props extends ResumeProps {
	initialSortBy?: keyof SkillRating;
	initialSortDesc?: boolean;
	skillCategory: string;
}

export function SkillRatingsChart(props: Props) {
	if (!(props.skillCategory in props.resume.skills)) {
		throw new Error(
			`Invalid skill category key \`props.skillCategory\`: '${props.skillCategory}'`,
		);
	}

	// Declare some helpful skill variables.
	const skillRatings: SkillRating[] = props.resume.skills[props.skillCategory];

	const allSkills = useMemo(
		(): string[] =>
			Object.values(
				props.resume.skills,
			).flatMap((innerSkillRatings: SkillRating[] | undefined) =>
				(innerSkillRatings ?? []).map(getSkill),
			),
		[props.resume.skills],
	);

	const skillLevels: SkillRating[] = useMemo(skillRatingLevels, [skillRatingLevels]);
	const allLevels = useMemo((): string[] => skillLevels.map(getSkill), [skillLevels]);

	// Declare some state and a function for sorting.
	const [sortBy, setSortBy] = useState<keyof SkillRating>(props.initialSortBy ?? 'skill');
	const [sortDesc, setSortDesc] = useState<boolean>(props.initialSortDesc ?? sortBy === 'rating');

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

	const sortedSkillRatings = useMemo(
		(): SkillRating[] => skillRatings.slice().sort(sortComparer),
		[skillRatings, sortComparer],
	);

	// Declare some variables that determine whether to start debut animations.
	const [svgRef, inView] = useInView({ threshold: 0.25, triggerOnce: true });

	// Declare some variables for dynamic (re)sizing.
	const { ref: divRef, width } = useResizeObserver<HTMLDivElement>();
	const div: HTMLDivElement | null = divRef.current;

	interface LabelsGroupResult extends UseMeasureTextParamsResult<SVGGElement> {
		fontSize: number | undefined;
		lineHeight: number | undefined;
	}

	function useLabelsGroup(): LabelsGroupResult {
		const useMeasureTextParamsResult: UseMeasureTextParamsResult<SVGGElement> = useMeasureTextParams<
			SVGGElement
		>('initial');
		const style: CSSStyleDeclaration | undefined = useMeasureTextParamsResult.style;
		return {
			...useMeasureTextParamsResult,
			fontSize: style && (Number.parseFloat(style.fontSize) || undefined),
			lineHeight: style && (Number.parseFloat(style.lineHeight) || undefined),
		};
	}

	const xLabelsGroup: LabelsGroupResult = useLabelsGroup();
	const yLabelsGroup: LabelsGroupResult = useLabelsGroup();

	type Regions = Record<'chart' | 'plot' | 'xLabels' | 'yLabels', Rectangle>;
	const regions = useMemo((): Regions | undefined => {
		let result: Regions | undefined;
		if (
			xLabelsGroup &&
			xLabelsGroup.fontSize &&
			yLabelsGroup &&
			yLabelsGroup.fontSize &&
			yLabelsGroup.lineHeight &&
			width !== undefined
		) {
			// Determine the y-labels width.
			let skillWidthMax = 0;
			for (const skill of allSkills) {
				const result: MeasureTextResult = measureText(
					skill,
					yLabelsGroup.measureTextParams,
				);
				skillWidthMax = Math.max(skillWidthMax, result.actualWidth);
			}
			const yLabelsWidth = Math.ceil(Math.min(skillWidthMax, width / 2));

			// Determine the x-labels height.
			let unrotatedWidthMax = 0;
			for (const level of allLevels) {
				const result: MeasureTextResult = measureText(
					level,
					xLabelsGroup.measureTextParams,
				);
				unrotatedWidthMax = Math.max(unrotatedWidthMax, result.actualWidth);
			}

			const adjacent = Math.abs(Math.cos(xLabelsRotateRadians) * xLabelsGroup.fontSize);
			const opposite = Math.abs(Math.sin(xLabelsRotateRadians) * unrotatedWidthMax);
			const xLabelsHeight = Math.ceil(adjacent + opposite);

			// Create bounding rectangles for the various regions of the chart.
			const plotRegionMargin = Math.min(xLabelsGroup.fontSize, yLabelsGroup.fontSize) / 2;

			const chart = new Rectangle({
				x: 0,
				y: 0,
				width,
				height:
					skillRatings.length * yLabelsGroup.lineHeight +
					plotRegionMargin +
					xLabelsHeight,
			});

			const plot = new Rectangle({
				x: chart.x + yLabelsWidth + plotRegionMargin,
				y: chart.y,
				width: chart.width - yLabelsWidth - plotRegionMargin,
				height: skillRatings.length * yLabelsGroup.lineHeight,
			});

			const yLabels = new Rectangle({
				x: chart.x,
				y: chart.y,
				width: yLabelsWidth,
				height: skillRatings.length * yLabelsGroup.lineHeight,
			});

			const xLabels = new Rectangle({
				x: chart.x,
				y: chart.bottom() - xLabelsHeight,
				width: chart.width,
				height: xLabelsHeight,
			});

			result = {
				chart,
				plot,
				xLabels,
				yLabels,
			};

			if (debug) {
				console.log({ regions: result });
			}
		}
		return result;
	}, [allLevels, allSkills, skillRatings.length, width, xLabelsGroup, yLabelsGroup]);

	interface XAxis {
		getX(skillRating: SkillRating): number;
		scale: d3.ScaleLinear<number, number>;
	}
	const xAxis = useMemo((): XAxis | undefined => {
		let result: XAxis | undefined;
		if (regions) {
			const scale = d3
				.scaleLinear()
				.domain([0, skillRatingMax])
				.range([regions.plot.x, regions.plot.right()]);
			result = {
				getX(skillRating: SkillRating): number {
					return scale(skillRating.rating);
				},
				scale,
			};

			if (debug) {
				console.log({ xAxis: result });
			}
		}
		return result;
	}, [regions]);

	// Draw the x-axis grid polylines.
	useEffect((): void => {
		if (div && regions && xAxis) {
			const xGridPolyline = {
				fill: 'none',
				// This function calculates the polyline points of a single grid line, which have
				// "tails (a.k.a. axis marks) that extend downward from the plot region into the
				// x-axis labels region. The tails are the hypotenuse of a right triangle having
				// height `opposite` and angle `xLabelsRotateRadians` (clockwise radians as is
				// SVG's convention).
				points: (skillLevel: SkillRating): string => {
					const opposite = regions.xLabels.height;
					const adjacent = opposite / Math.tan(Math.abs(xLabelsRotateRadians));

					const x0: number = xAxis.getX(skillLevel);
					return [
						new Point({ x: x0, y: regions.plot.y }),
						new Point({ x: x0, y: regions.xLabels.y }),
						new Point({ x: x0 - adjacent, y: regions.xLabels.bottom() }),
					].join(' ');
				},
			};

			d3.select(div)
				.select('g.x-grid')
				.selectAll('polyline')
				.data(skillLevels)
				.join('polyline')
				.attr('data-level', getSkill)
				.attr('data-rating', getRating)
				.attr('fill', xGridPolyline.fill)
				.attr('points', xGridPolyline.points);

			if (debug) {
				console.log('rendered x-grid');
			}
		}
	}, [div, regions, skillLevels, xAxis]);

	// Draw the x-axis labels.
	useEffect((): void => {
		if (div && regions && xAxis && xLabelsGroup && xLabelsGroup.fontSize !== undefined) {
			const xLabel = {
				textAnchor: 'end',
				transform: (skillLevel: SkillRating): string =>
					`rotate(${xLabelsRotateDegrees},${xAxis.getX(skillLevel)},${
						regions.xLabels.y
					})`,
				x: xAxis.getX,
				y: regions.xLabels.y + xLabelsGroup.fontSize,
			};

			d3.select(div)
				.select('g.x-labels')
				.selectAll('text')
				.data(skillLevels)
				.join('text')
				.attr('data-level', getSkill)
				.attr('data-rating', getRating)
				.attr('text-anchor', xLabel.textAnchor)
				.attr('transform', xLabel.transform)
				.attr('x', xLabel.x)
				.attr('y', xLabel.y)
				.text(getSkill);

			if (debug) {
				console.log('rendered x-labels');
			}
		}
	}, [div, skillLevels, regions, xAxis, xLabelsGroup]);

	// Draw the y-axis labels.
	useEffect((): void => {
		if (
			div &&
			inView &&
			regions &&
			yLabelsGroup &&
			yLabelsGroup.fontSize !== undefined &&
			yLabelsGroup.lineHeight !== undefined
		) {
			const yLabel = {
				fadeInDelay: (_skillRating: SkillRating, skillIndex: number): number =>
					skillIndex * durations.short,
				fadeInDuration: durations.medium,
				fadeInOpacityFrom: 0,
				fadeInOpacityTo: 1,
				fadeInTransition: 'fade-in',
				sortDuration: durations.medium,
				sortTransition: 'sort',
				textAnchor: 'end',
				x: regions.yLabels.right(),
				y: (_skillRating: SkillRating, skillIndex: number): number =>
					skillIndex * yLabelsGroup.lineHeight! + yLabelsGroup.fontSize!,
			};

			d3.select(div)
				.select('g.y-labels')
				.selectAll<SVGTextElement, SkillRating>('text')
				.data(sortedSkillRatings, getSkill)
				.join(
					(enter) =>
						enter
							.append('text')
							.attr('data-skill', getSkill)
							.attr('data-rating', getRating)
							.attr('text-anchor', yLabel.textAnchor)
							.attr('opacity', yLabel.fadeInOpacityFrom)
							.attr('x', yLabel.x)
							.attr('y', yLabel.y)
							.text(getSkill)
							.call((enter) =>
								enter
									.transition(yLabel.fadeInTransition)
									.delay(yLabel.fadeInDelay)
									.duration(yLabel.fadeInDuration)
									.attr('opacity', yLabel.fadeInOpacityTo),
							),
					(update) =>
						update.call((update) =>
							update
								.transition(yLabel.sortTransition)
								.duration(yLabel.sortDuration)
								.attr('y', yLabel.y),
						),
				);

			if (debug) {
				console.log('rendered y-labels');
			}
		}
	}, [div, inView, sortedSkillRatings, regions, yLabelsGroup]);

	// Draw the bars.
	useEffect((): void => {
		if (
			div &&
			inView &&
			xAxis &&
			yLabelsGroup &&
			yLabelsGroup.fontSize !== undefined &&
			yLabelsGroup.lineHeight !== undefined
		) {
			const bar = {
				growInDelay: (_skillRating: SkillRating, skillIndex: number): number =>
					skillIndex * durations.short,
				growInDuration: durations.long,
				growInTransition: 'grow-in',
				height: yLabelsGroup.fontSize * 0.75,
				x: xAxis.scale(0),
				y: (_skillRating: SkillRating, skillIndex: number): number =>
					skillIndex * yLabelsGroup.lineHeight! + yLabelsGroup.fontSize! * 0.3,
				sortDuration: durations.medium,
				sortTransition: 'sort',
				widthFrom: 0,
				width: (skillRating: SkillRating): number => xAxis.getX(skillRating) - bar.x,
			};

			d3.select(div)
				.select('g.bars')
				.selectAll<SVGRectElement, SkillRating>('rect')
				.data(sortedSkillRatings, getSkill)
				.join(
					(enter) =>
						enter
							.append('rect')
							.attr('data-skill', getSkill)
							.attr('data-rating', getRating)
							.attr('height', bar.height)
							.attr('width', bar.widthFrom)
							.attr('x', bar.x)
							.attr('y', bar.y)
							.call((enter) =>
								enter
									.transition(bar.growInTransition)
									.delay(bar.growInDelay)
									.duration(bar.growInDuration)
									.attr('width', bar.width),
							),
					(update) =>
						update.call((update) =>
							update
								.attr('width', bar.width)
								.transition(bar.sortTransition)
								.duration(bar.sortDuration)
								.attr('y', bar.y),
						),
				);

			if (debug) {
				console.log('rendered bars');
			}
		}
	}, [div, inView, sortedSkillRatings, xAxis, yLabelsGroup]);

	// Create some unique IDs for SVG fragment IDs.
	const [xGridLinearGradientId] = useState(uniqueId('x-grid-linear-gradient-'));
	const [xGridMaskId] = useState(uniqueId('x-grid-mask-'));

	const [barsLinearGradientId] = useState(uniqueId('bars-linear-gradient-'));
	const [barsMaskId] = useState(uniqueId('bars-mask-'));

	return (
		<div className="skill-ratings-chart-component" ref={divRef}>
			<svg height={regions?.chart.height} ref={svgRef} width="100%">
				<defs>
					{/* Fade out the x-grid tails from top to bottom with a transparency mask. */}
					<linearGradient id={xGridLinearGradientId} x1="0%" x2="0%" y1="0%" y2="100%">
						<stop
							offset={regions && 1 - regions.xLabels.height / regions.chart.height}
							stopColor="white"
							stopOpacity="1"
						/>
						<stop offset="1" stopColor="white" stopOpacity="0" />
					</linearGradient>
					<mask id={xGridMaskId}>
						<rect fill={`url(#${xGridLinearGradientId})`} {...regions?.chart} />
					</mask>

					{/* Fade in the bars from left to right with a transparency mask. */}
					<linearGradient id={barsLinearGradientId}>
						<stop offset="0" stopColor="white" stopOpacity="0.25" />
						<stop offset="1" stopColor="white" stopOpacity="1" />
					</linearGradient>
					<mask id={barsMaskId}>
						<rect fill={`url(#${barsLinearGradientId})`} {...regions?.plot} />
					</mask>
				</defs>

				{debug && (
					<g className="regions">
						{regions &&
							Object.entries(regions).map(([key, region]: [string, Rectangle]) => (
								<rect key={key} fill="none" stroke="red" {...region} />
							))}
					</g>
				)}
				<g className="x-grid" mask={`url(#${xGridMaskId})`} />
				<g className="x-labels" ref={xLabelsGroup.ref} />
				<g
					className="y-labels"
					onClick={(): void => {
						setSortDesc(sortBy === 'skill' ? !sortDesc : false);
						setSortBy('skill');
					}}
					ref={yLabelsGroup.ref}
					style={{ cursor: 'pointer' }}
				/>
				<g
					className="bars"
					mask={`url(#${barsMaskId})`}
					onClick={(): void => {
						setSortDesc(sortBy === 'rating' ? !sortDesc : true);
						setSortBy('rating');
					}}
					style={{ cursor: 'pointer' }}
				/>
			</svg>
		</div>
	);
}
