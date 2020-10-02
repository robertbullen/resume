import classNames from 'classnames';
import * as d3 from 'd3-hexbin';
import React, { useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { calcCenter, calcHeightToFitRows, calcRadiusToFitColumns } from '../drawing/hexagon';
import { radiusOfCircleInHexagon, sideOfSquareInCircle } from '../drawing/inscriptions';
import { Point } from '../drawing/point';
import { Rectangle } from '../drawing/rectangle';
import { Interest, ResumeProps } from '../resume/resume-model';

const debug = false;

export function InterestsHexGrid(props: ResumeProps) {
	const { ref: divRef, width } = useResizeObserver<HTMLDivElement>();

	interface HexGridDimensions {
		columns: number;
		height: number;
		hexagonRadius: number;
		rows: number;
		textSquareSide: number;
		width: number;
	}
	const hexGridDimensions = useMemo((): HexGridDimensions | undefined => {
		let result: HexGridDimensions | undefined;
		if (width) {
			const allInterests: Interest[] = Object.values(props.resume.interests).flat();
			const columns: number =
				Math.max(...allInterests.map((interest: Interest): number => interest.column)) + 1;
			const rows: number =
				Math.max(...allInterests.map((interest: Interest): number => interest.row)) + 1;

			const hexagonRadius: number = calcRadiusToFitColumns(width, columns);
			const height: number = calcHeightToFitRows(hexagonRadius, rows);
			const textSquareSide: number = sideOfSquareInCircle(hexagonRadius);

			result = {
				columns,
				height: height,
				hexagonRadius: hexagonRadius,
				rows,
				textSquareSide,
				width,
			};
		}
		return result;
	}, [props.resume.interests, width]);

	const hexbin = useMemo(() => d3.hexbin<Interest>(), []);
	if (hexGridDimensions) {
		hexbin.radius(hexGridDimensions.hexagonRadius);
	}

	const rotationDegrees = 0;

	return (
		<div className="interests-hexgrid-component" ref={divRef}>
			<svg
				style={{ height: hexGridDimensions?.height, width: '100%' }}
				transform={`rotate(${rotationDegrees})`}
			>
				<g transform={`scale(0.9) translate(${(width ?? 0) * 0.05})`}>
					{Object.entries(props.resume.interests).map(
						([cluster, interests]: [string, Interest[]], clusterIndex: number) => (
							<g className="hexagons" data-cluster-index={clusterIndex} key={cluster}>
								{interests.map((interest: Interest) => {
									const center: Point = calcCenter(
										hexGridDimensions?.hexagonRadius ?? 0,
										interest.column,
										interest.row,
									);
									return (
										<>
											<path
												className={classNames({
													cluster: interest.name === cluster,
												})}
												d={`M ${center.x},${center.y} ${hexbin.hexagon(
													(hexGridDimensions?.hexagonRadius ?? 0) - 1.5,
												)}`}
												key={interest.name}
											/>
											{debug && (
												<>
													<circle
														cx={center.x}
														cy={center.y}
														fill="green"
														r="2"
													/>
													<circle
														cx={center.x}
														cy={center.y}
														fill="none"
														r={radiusOfCircleInHexagon(
															hexGridDimensions?.hexagonRadius ?? 0,
														)}
														stroke="green"
													/>
													<circle
														cx={center.x}
														cy={center.y}
														fill="none"
														r={hexGridDimensions?.hexagonRadius}
														stroke="green"
													/>
												</>
											)}
										</>
									);
								})}
							</g>
						),
					)}

					{Object.entries(props.resume.interests).map(
						([cluster, interests]: [string, Interest[]], clusterIndex: number) => (
							<g className="labels" data-cluster-index={clusterIndex} key={cluster}>
								{interests.map((interest: Interest) => {
									const center: Point = calcCenter(
										hexGridDimensions?.hexagonRadius ?? 0,
										interest.column,
										interest.row,
									);
									const textSquareSide: number = sideOfSquareInCircle(
										hexGridDimensions?.hexagonRadius ?? 0,
									);
									const textRectangle = new Rectangle({
										x: center.x - textSquareSide / 2,
										y: center.y - textSquareSide / 2,
										width: textSquareSide,
										height: textSquareSide,
									});
									return (
										<>
											{debug && (
												<rect
													fill="none"
													stroke="blue"
													transform={`rotate(-${rotationDegrees}, ${center.x}, ${center.y})`}
													{...textRectangle.toJSON()}
												/>
											)}
											<foreignObject
												transform={`rotate(-${rotationDegrees}, ${center.x}, ${center.y})`}
												{...textRectangle.toJSON()}
											>
												<div
													className={classNames({
														cluster: interest.name === cluster,
													})}
													style={{
														display: 'table-cell',
														height: textRectangle.height,
														textAlign: 'center',
														verticalAlign: 'middle',
														width: textRectangle.width,
													}}
												>
													{interest.name}
												</div>
											</foreignObject>
										</>
									);
								})}
							</g>
						),
					)}
				</g>
			</svg>
		</div>
	);
}
