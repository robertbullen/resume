import classNames from 'classnames';
import React, { Fragment, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { HexGrid } from '../drawing/hex-grid';
import { Hexagon } from '../drawing/hexagon';
import { sideOfSquareInCircle } from '../drawing/inscriptions';
import { measureText } from '../drawing/measure-text';
import { Point } from '../drawing/point';
import { Rectangle } from '../drawing/rectangle';
import { useMeasureTextParams } from '../hooks/use-measure-text-params';
import { Interest, ResumeProps } from '../resume/resume-model';

const debug = false;

export function InterestsHexGrid(props: ResumeProps) {
	const { ref: divRef, width } = useResizeObserver<HTMLDivElement>();
	const div: HTMLDivElement | null = divRef.current;

	const labelsGroup = useMeasureTextParams<SVGGElement>('initial');

	interface HexGridDimensions {
		columns: number;
		height: number;
		grid: HexGrid;
		labelFontSize: number;
		rows: number;
		textSquareSide: number;
		width: number;
	}
	const hexGridDimensions = useMemo((): HexGridDimensions | undefined => {
		let result: HexGridDimensions | undefined;
		if (div && labelsGroup.measureTextParams && labelsGroup.style && width) {
			const allInterests: Interest[] = Object.values(props.resume.interests).flat();
			const columns: number =
				Math.max(...allInterests.map((interest: Interest): number => interest.column)) + 1;
			const rows: number =
				Math.max(...allInterests.map((interest: Interest): number => interest.row)) + 1;

			const grid: HexGrid = HexGrid.fitToWidth(width, columns);
			const height: number = grid.height(rows);
			const textSquareSide: number = sideOfSquareInCircle(grid.hexagonRadius);

			const maxWordWidth: number = Math.max(
				...allInterests
					.flatMap((interest: Interest): string[] => interest.name.split(/\s+/))
					.map(
						(word: string): number =>
							measureText(word, labelsGroup.measureTextParams).actualWidth,
					),
			);
			const labelFontSize: number =
				(Number.parseFloat(labelsGroup.style.fontSize) * textSquareSide) / maxWordWidth;

			result = {
				columns,
				grid,
				height,
				labelFontSize,
				rows,
				textSquareSide,
				width,
			};
		}
		return result;
	}, [div, labelsGroup.measureTextParams, labelsGroup.style, props.resume.interests, width]);

	function calcAnimationOffsetStyle(
		dimensions: HexGridDimensions | undefined,
		hexagon: Hexagon | undefined,
	): object | undefined {
		if (!dimensions || !hexagon) {
			return undefined;
		}

		const topLeft = new Point();
		const bottomRight = new Point({ x: dimensions.width, y: dimensions.height });
		return {
			style: {
				'--animation-offset':
					Point.distance(topLeft, {
						x: hexagon.cx ?? 0,
						y: hexagon.cy ?? 0,
					}) / Point.distance(topLeft, bottomRight),
			},
		};
	}

	return (
		<div className="interests-hexgrid-component" ref={divRef}>
			<svg style={{ height: hexGridDimensions?.height, width: '100%' }}>
				<g className="root">
					<g className="hexagons">
						{Object.entries(props.resume.interests).map(
							([cluster, interests]: [string, Interest[]]) => (
								<g className="cluster" key={cluster}>
									{interests.map((interest: Interest) => {
										const hexagon:
											| Hexagon
											| undefined = hexGridDimensions?.grid.hexagon(interest);
										const isClusterName: boolean = interest.name === cluster;
										const hexagonOuterRadiusOffset = -1.5;
										const hexagonInnerRadiusOffset = -5.5;
										const hexagonCornerRadius = 3;
										return (
											<Fragment key={interest.name}>
												{hexagon && (
													<g
														className={classNames({
															'cluster-name': isClusterName,
															'hexagon': true,
														})}
														{...calcAnimationOffsetStyle(
															hexGridDimensions,
															hexagon,
														)}
													>
														<path
															d={hexagon.toSvgPath(
																hexagonOuterRadiusOffset,
																hexagonCornerRadius,
															)}
														/>
														{isClusterName && (
															<path
																d={hexagon.toSvgPath(
																	hexagonInnerRadiusOffset,
																	hexagonCornerRadius,
																)}
															/>
														)}
														{debug && (
															<>
																<circle
																	{...hexagon}
																	fill="green"
																	r="2"
																/>
																<circle
																	{...hexagon}
																	fill="none"
																	stroke="green"
																/>
															</>
														)}
													</g>
												)}
											</Fragment>
										);
									})}
								</g>
							),
						)}
					</g>

					<g className="labels" ref={labelsGroup.ref}>
						{Object.entries(props.resume.interests).map(
							([cluster, interests]: [string, Interest[]]) => (
								<g className="cluster" key={cluster}>
									{interests.map((interest: Interest) => {
										const hexagon:
											| Hexagon
											| undefined = hexGridDimensions?.grid.hexagon(interest);
										const isClusterName: boolean = interest.name === cluster;
										const textRectangle =
											hexagon &&
											new Rectangle({
												x:
													hexagon.cx -
													(hexGridDimensions?.textSquareSide ?? 0) / 2,
												y:
													hexagon.cy -
													(hexGridDimensions?.textSquareSide ?? 0) / 2,
												width: hexGridDimensions?.textSquareSide,
												height: hexGridDimensions?.textSquareSide,
											});
										return (
											<Fragment key={interest.name}>
												{hexagon && textRectangle && (
													<g
														className={classNames({
															'cluster-name': isClusterName,
															'label': true,
														})}
														{...calcAnimationOffsetStyle(
															hexGridDimensions,
															hexagon,
														)}
													>
														{debug && (
															<rect
																fill="none"
																stroke="blue"
																{...textRectangle}
															/>
														)}
														<foreignObject {...textRectangle}>
															<div
																style={{
																	display: 'table-cell',
																	fontSize:
																		hexGridDimensions?.labelFontSize,
																	height: textRectangle.height,
																	textAlign: 'center',
																	verticalAlign: 'middle',
																	width: textRectangle.width,
																}}
																{...{
																	xmlns:
																		'http://www.w3.org/1999/xhtml',
																}}
															>
																{interest.name}
															</div>
														</foreignObject>
													</g>
												)}
											</Fragment>
										);
									})}
								</g>
							),
						)}
					</g>
				</g>
			</svg>
		</div>
	);
}
