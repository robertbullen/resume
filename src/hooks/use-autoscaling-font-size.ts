import { RefCallback, RefObject, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { measureText, MeasureTextResult } from '../drawing/measure-text';
import { useMeasureTextParams } from './use-measure-text-params';

export interface UseAutoscalingFontSizeResult<
	TParent extends HTMLElement,
	TChild extends HTMLElement
> {
	childRef: RefCallback<TChild>;
	childScaledFontSize: number | undefined;
	parentRef: RefObject<TParent>;
}

export function useAutoscalingFontSize<
	TParent extends HTMLElement,
	TChild extends HTMLElement
>(): UseAutoscalingFontSizeResult<TParent, TChild> {
	// Listen to resizes of the parent.
	const parent = useResizeObserver<TParent>();

	// Capture the initial font metrics of the child just once when its style becomes available.
	const child = useMeasureTextParams<TChild>('initial');
	const childHeights = useMemo(
		(): Record<'fontSize' | 'lineHeight' | 'maxHeight', number> | undefined =>
			child.style && {
				fontSize: Number.parseFloat(child.style.fontSize),
				maxHeight: Number.parseFloat(child.style.maxHeight),
				lineHeight: Number.parseFloat(child.style.lineHeight),
			},
		[child.style],
	);

	// Compute the child's text width.
	const childInnerText: string | undefined = child.element?.innerText;
	const measureTextResult = useMemo(
		(): MeasureTextResult | undefined =>
			childInnerText !== undefined && child.measureTextParams
				? measureText(childInnerText, child.measureTextParams)
				: undefined,
		[childInnerText, child.measureTextParams],
	);

	const childScaledFontSize = useMemo((): number | undefined => {
		if (
			childHeights === undefined ||
			childInnerText === undefined ||
			measureTextResult === undefined ||
			parent.width === undefined
		) {
			return undefined;
		}

		// Compute the child's text width. From that, determine a font size that will fit the
		// parent's width.
		const fontSizeHorzFit: number =
			childHeights.fontSize * (parent.width / measureTextResult.actualWidth);

		// Compute the largest font size that won't exceed the child's max height.
		const fontSizeVertMax: number =
			(childHeights.maxHeight * childHeights.fontSize) / childHeights.lineHeight;

		// Return the best option.
		return Math.min(fontSizeHorzFit, fontSizeVertMax);
	}, [childHeights, childInnerText, measureTextResult, parent.width]);

	return {
		childRef: child.ref,
		childScaledFontSize,
		parentRef: parent.ref,
	};
}
