import * as d3 from 'd3';
import React, { FC, useEffect, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Experience, ResumeProps } from '../resume';

type Props = ResumeProps;

export const ExperienceTimeline: FC<Props> = (props: Props) => {
	const { height, ref } = useResizeObserver<HTMLDivElement>();

	function startOfYear(date: Date): number {
		return new Date(date.getFullYear(), 0).getTime();
	}

	function startOfNextYear(date: Date): number {
		return new Date(date.getFullYear() + 1, 0).getTime();
	}

	const years = useMemo((): Date[] => {
		const max = new Date(
			d3.max(props.resume.experiences, (experience: Experience): number =>
				startOfNextYear(experience.finishDate ?? new Date()),
			) ?? startOfNextYear(new Date()),
		);
		const min = new Date(
			d3.min(props.resume.experiences, (experience: Experience): number =>
				startOfYear(experience.startDate),
			) ?? startOfYear(new Date()),
		);

		const years: Date[] = [];
		for (
			let year = min;
			year.getTime() < max.getTime();
			year = new Date(year.getFullYear() + 1, 0)
		) {
			years.push(year);
		}
		return years;
	}, [props.resume.experiences]);

	useEffect((): void => {
		if (height === undefined || !ref.current) {
			return;
		}

		const container = d3.select(ref.current);

		const scale = d3
			.scaleTime()
			.domain([years[0], startOfNextYear(years[years.length - 1])])
			.range([height ?? 0, 0]);

		function yearBoxClass(_year: Date, yearIndex: number): string {
			return yearIndex % 2 === 0 ? 'dark' : 'light';
		}

		// TODO: check for array length
		const yearBoxHeight: number = scale(years[0]) - scale(years[1]);
		const yearBoxWidth = 100;
		function yearBoxY(year: Date): number {
			return scale(year) - yearBoxHeight;
		}

		container
			.select('g.year-grid')
			.selectAll<SVGRectElement, Date>('rect')
			.data(years.slice().reverse())
			.join('rect')
			.attr('class', yearBoxClass)
			.attr('data-year', yearText)
			.attr('height', yearBoxHeight)
			.attr('width', yearBoxWidth)
			.attr('x', 0)
			.attr('y', yearBoxY);

		const fontSize = 12;

		const yearLabelX = fontSize;

		function yearLabelY(year: Date): number {
			return scale(year) - (yearBoxHeight - fontSize) / 2;
		}

		function yearText(year: Date): string {
			return year.getFullYear().toString();
		}

		container
			.select('g.year-labels')
			.selectAll<SVGTextElement, Date>('text')
			.data(years)
			.join('text')
			.attr('data-year', yearText)
			.attr('x', yearLabelX)
			.attr('y', yearLabelY)
			.text(yearText);
	}, [height, ref, years]);

	return (
		<div className="experience-timeline-component" ref={ref}>
			<svg height="100%" width="100%">
				<g className="year-grid" />
				<g className="year-labels" />
				<g className="boxes" />
				<g className="flyouts" />
			</svg>
		</div>
	);
};
