import * as d3 from 'd3-hexbin';
import React, { FC, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { calcCenter, calcHeightToFitRows, calcRadiusToFitColumns } from '../geometry/hexagon';
import { Point } from '../geometry/point';
import { Interest, ResumeProps } from '../resume';

export const InterestsHoneycomb: FC<ResumeProps> = (props: ResumeProps) => {
	const { ref: divRef, width } = useResizeObserver<HTMLDivElement>();

	const columns = 11;
	const rows = 5;

	interface DerivedDimensions {
		height: number;
		radius: number;
	}
	const derivedDimensions = useMemo((): DerivedDimensions | undefined => {
		let result: DerivedDimensions | undefined;
		if (width) {
			const radius: number = calcRadiusToFitColumns(width, columns);
			const height: number = calcHeightToFitRows(radius, rows);
			result = {
				height,
				radius,
			};
			console.log({ result });
		}
		return result;
	}, [columns, rows, width]);

	const hexbin = useMemo(() => d3.hexbin<Interest>(), []);
	if (derivedDimensions && width !== undefined) {
		hexbin.extent([
			[0, -derivedDimensions.radius],
			[width, derivedDimensions.height + derivedDimensions.radius],
		]);
		hexbin.radius(derivedDimensions.radius);
		hexbin.x(
			(interest: Interest): number =>
				calcCenter(derivedDimensions.radius, interest.column, interest.row).x,
		);
		hexbin.y(
			(interest: Interest): number =>
				calcCenter(derivedDimensions.radius, interest.column, interest.row).y,
		);
	}

	return (
		<div className="interests-honeycomb-component" ref={divRef}>
			<svg style={{ height: derivedDimensions?.height, width: '100%' }}>
				<g>
					{/* <path d={hexbin.mesh()} fill="none" stroke="black" /> */}

					{Object.values(props.resume.interests)
						.flat()
						.map((interest: Interest) => {
							const center: Point = calcCenter(
								derivedDimensions?.radius ?? 0,
								interest.column,
								interest.row,
							);
							return (
								<path
									d={`M${center.x},${center.y}${hexbin
										.hexagon
										// (derivedDimensions?.radius ?? 0) - 1,
										()}`}
									key={interest.name}
									fill="orange"
									stroke="white"
									strokeWidth="2"
									strokeLinejoin="round"
								/>
							);
						})}
				</g>
				<g>
					{Object.values(props.resume.interests)
						.flat()
						.map((interest: Interest) => {
							const center: Point = calcCenter(
								derivedDimensions?.radius ?? 0,
								interest.column,
								interest.row,
							);
							return (
								<text
									x={center.x}
									y={center.y + 8}
									fill="white"
									textAnchor="middle"
								>
									{interest.name}
								</text>
							);
						})}
				</g>
			</svg>
		</div>
	);
};
