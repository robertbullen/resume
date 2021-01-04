import * as d3 from 'd3';
import { Size } from '../drawing/size';
import { Experience } from '../resume/resume-model';

function yearStart(date: Date): number {
	return new Date(date.getFullYear(), 0).getTime();
}

function yearStartOfNext(date: Date): number {
	return new Date(date.getFullYear() + 1, 0).getTime();
}

function yearText(date: Date): string {
	return date.getFullYear().toString();
}

interface Extent<T> {
	maxExclusive: T;
	minInclusive: T;
}

function yearsExtent(experiences: Experience[]): Extent<Date> {
	const maxExclusive = new Date(
		d3.max(experiences, (experience: Experience): number =>
			yearStartOfNext(experience.finishDate ?? new Date()),
		) ?? yearStartOfNext(new Date()),
	);
	const minInclusive = new Date(
		d3.min(experiences, (experience: Experience): number => yearStart(experience.startDate)) ??
			yearStart(new Date()),
	);
	return {
		maxExclusive,
		minInclusive,
	};
}

function yearsArray(extent: Extent<Date>): Date[] {
	const years: Date[] = [];
	for (
		let year = extent.minInclusive;
		year.getTime() < extent.maxExclusive.getTime();
		year = new Date(year.getFullYear() + 1, 0)
	) {
		years.push(year);
	}
	return years.reverse();
}

function drawYearGrid(
	gridGroup: d3.Selection<SVGGElement, unknown, null, unknown>,
	scale: d3.ScaleTime<number, number>,
	years: Date[],
	rectSize: Size,
): void {
	const yearGridRect = {
		dataYear: yearText,
		height: rectSize.height,
		width: rectSize.width,
		x: 0,
		y: (year: Date): number => scale(year) - rectSize.height,
	};

	gridGroup
		.selectAll<SVGRectElement, Date>('rect')
		.data(years)
		.join('rect')
		.attr('data-year', yearGridRect.dataYear)
		.attr('height', yearGridRect.height)
		.attr('width', yearGridRect.width)
		.attr('x', yearGridRect.x)
		.attr('y', yearGridRect.y);
}

function drawYearLabels(
	labelsGroup: d3.Selection<SVGGElement, unknown, null, unknown>,
	scale: d3.ScaleTime<number, number>,
	years: Date[],
	yearGridRectSize: Size,
	yearLabelMaxSize: Size,
): void {
	const yearLabel = {
		dataYear: yearText,
		text: yearText,
		textAnchor: 'end',
		x: yearLabelMaxSize.height + yearLabelMaxSize.width,
		y: (year: Date): number =>
			scale(year) - (yearGridRectSize.height - yearLabelMaxSize.height) / 2,
	};

	labelsGroup
		.selectAll<SVGTextElement, Date>('text')
		.data(years)
		.join('text')
		.attr('data-year', yearLabel.dataYear)
		.attr('text-anchor', yearLabel.textAnchor)
		.attr('x', yearLabel.x)
		.attr('y', yearLabel.y)
		.text(yearLabel.text);
}

function drawTimeBoxes(
	timeBoxesGroup: d3.Selection<SVGGElement, unknown, null, unknown>,
	scale: d3.ScaleTime<number, number>,
	experiences: Experience[],
	yearLabelMaxSize: Size,
): void {
	const timeBox = {
		dataFinish: (experience: Experience): string =>
			(experience.finishDate ?? new Date()).toDateString(),
		dataStart: (experience: Experience): string => experience.startDate.toDateString(),
		height: (experience: Experience): number =>
			scale(experience.startDate) - timeBox.y(experience),
		width: yearLabelMaxSize.height,
		x: (_experience: Experience, experienceIndex: number): number =>
			yearLabelMaxSize.height +
			yearLabelMaxSize.width +
			yearLabelMaxSize.height +
			(experienceIndex % 2) * timeBox.width,
		y: (experience: Experience): number => scale(experience.finishDate ?? new Date()),
	};

	timeBoxesGroup
		.selectAll<SVGRectElement, Experience>('rect')
		.data(experiences)
		.join('rect')
		.attr('data-finish', timeBox.dataFinish)
		.attr('data-start', timeBox.dataStart)
		.attr('height', timeBox.height)
		.attr('width', timeBox.width)
		.attr('x', timeBox.x)
		.attr('y', timeBox.y);
}

export interface DrawChartParams {
	drawForeground: boolean;
	experiences: Experience[];
	parent: d3.BaseType;
	yearLabelContext: CanvasRenderingContext2D;
	yearLabelFont: string;
	yearLabelFontSize: number;
	yearLabelLineHeight: number;
}

export function drawChart(params: DrawChartParams): void {
	// Generate the years of the grid.
	const extent: Extent<Date> = yearsExtent(params.experiences);
	const years: Date[] = yearsArray(extent);

	// Determine the dimensions.
	const parent: d3.Selection<d3.BaseType, unknown, null, unknown> = d3.select(params.parent);

	const maxHeight: number = parent.property('clientHeight');
	const minHeight: number = params.yearLabelLineHeight * years.length;
	const height: number = Math.max(maxHeight, minHeight);

	const scale: d3.ScaleTime<number, number> = d3
		.scaleTime()
		.domain([extent.minInclusive, extent.maxExclusive])
		.range([height, 0]);

	// Create the SVG tree.
	let svg: d3.Selection<SVGSVGElement, unknown, null, unknown> = parent.select<SVGSVGElement>(
		'svg',
	);
	let yearGridGroup: d3.Selection<SVGGElement, unknown, null, unknown>;
	let yearLabelsGroup: d3.Selection<SVGGElement, unknown, null, unknown>;
	let timeBoxesGroup: d3.Selection<SVGGElement, unknown, null, unknown>;
	let flyoutsGroup: d3.Selection<SVGGElement, unknown, null, unknown>;

	if (svg.size() === 0) {
		svg = parent.append('svg').attr('height', height).attr('width', '100%');

		yearGridGroup = svg.append('g').attr('class', 'year-grid');
		yearLabelsGroup = svg.append('g').attr('class', 'year-labels');
		timeBoxesGroup = svg.append('g').attr('class', 'time-boxes');
		flyoutsGroup = svg.append('g').attr('class', 'flyouts');
	} else {
		yearGridGroup = svg.select('g.year-grid');
		yearLabelsGroup = svg.select('g.year-labels');
		timeBoxesGroup = svg.select('g.time-boxes');
		flyoutsGroup = svg.select('g.flyouts');
	}

	// Draw the layers.
	const gridRectSize = new Size({
		height: height / years.length,
		width: 100,
	});
	const labelMaxSize = new Size({
		height: params.yearLabelFontSize,
		width: 30,
	});

	drawYearGrid(yearGridGroup, scale, years, gridRectSize);
	drawYearLabels(yearLabelsGroup, scale, years, gridRectSize, labelMaxSize);

	if (params.drawForeground) {
		drawTimeBoxes(timeBoxesGroup, scale, params.experiences, labelMaxSize);
		void flyoutsGroup;
	}
}

export class D3ExperienceTimeline {
	public static readonly yearLabelsClass = 'year-labels';
}
