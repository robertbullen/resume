import React, { FC, useMemo, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
import { ContactService, ResumeProps } from '../resume';
import { CandidateContactService } from './CandidateContactService';

export const Candidate: FC<ResumeProps> = (props: ResumeProps) => {
	// Acquire a reference to the parent. Assigning `h1Ref.current` to a local variable is done to
	// prevent linter warnings about using a ref's current property as a hook dependency.
	const h1Ref = useRef<HTMLHeadingElement>(null);
	const h1: HTMLHeadingElement | undefined = h1Ref.current ?? undefined;

	// Listen to resizes of the heading's parent.
	const { ref: divRef, width } = useResizeObserver<HTMLDivElement>();

	// Initialize static measurement factors once (and only once) when the heading ref is available.
	interface MeasurementFactors {
		canvasMeasureCompensation: number;
		context: CanvasRenderingContext2D;
		originalFontSize: number;
		originalLetterSpacing: number;
		originalLineHeight: number;
		originalMaxHeight: number;
	}
	const measurementFactors = useMemo((): MeasurementFactors | undefined => {
		let result: MeasurementFactors | undefined;
		if (h1) {
			const context: CanvasRenderingContext2D | null = document
				.createElement('canvas')
				.getContext('2d');
			if (context) {
				const style: CSSStyleDeclaration = window.getComputedStyle(h1);
				context.font = style.font;
				result = {
					canvasMeasureCompensation:
						Number.parseFloat(
							style?.getPropertyValue('--canvas-measure-compensation'),
						) || 1.0,
					context,
					originalFontSize: Number.parseFloat(style.fontSize) || 40,
					originalLetterSpacing: Number.parseFloat(style.letterSpacing) || 1.0,
					originalLineHeight: Number.parseFloat(style.lineHeight) || 1.5,
					originalMaxHeight: Number.parseFloat(style.maxHeight) || 100,
				};
			}
		}
		return result;
	}, [h1]);

	// Recompute the heading's font size whenever the width of its parent or its text changes.
	const scaledFontSize = useMemo((): string | undefined => {
		let result: string | undefined;
		if (measurementFactors !== undefined && width !== undefined) {
			const metrics: TextMetrics = measurementFactors.context.measureText(
				props.resume.candidate.name,
			);
			const actualWidth: number = Math.max(
				metrics.width,
				metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft,
			);

			// Determine the font size needed for a precise fit to the width. Letter spacing and
			// a custom CSS property that corrects for canvas mis-measurements are both taken into
			// account.
			const letterSpacingScale: number =
				1 + measurementFactors.originalLetterSpacing / measurementFactors.originalFontSize;
			let fontSizeHorzFit: number =
				(width / actualWidth) * measurementFactors.originalFontSize;
			fontSizeHorzFit *= letterSpacingScale;
			fontSizeHorzFit *= measurementFactors.canvasMeasureCompensation;

			// Prevent the font size from causing the heading's height to exceed its max height.
			const fontSizeVertMax: number =
				(measurementFactors.originalMaxHeight * measurementFactors.originalFontSize) /
				measurementFactors.originalLineHeight;

			const fontSize = Math.min(fontSizeHorzFit, fontSizeVertMax);
			result = `${fontSize}px`;
		}
		return result;
	}, [measurementFactors, props.resume.candidate.name, width]);

	return (
		<div className="candidate-component">
			<div ref={divRef} style={{ maxWidth: '100%' }}>
				<h1
					ref={h1Ref}
					style={{
						fontSize: scaledFontSize,
						whiteSpace: 'nowrap',
					}}
				>
					{props.resume.candidate.name}
				</h1>
				<ul>
					{props.resume.candidate.contactServices.map(
						(contactService: ContactService) => (
							<li key={contactService.url}>
								<CandidateContactService contactService={contactService} />
							</li>
						),
					)}
				</ul>
			</div>
		</div>
	);
};
