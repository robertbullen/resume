import { RefCallback, RefObject, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';
import { measureText, MeasureTextResult } from '../drawing/measure-text';
import { useFont } from './use-font';
import { useMeasureTextParams } from './use-measure-text-params';

const debug = true;

export interface UseAutoscalingFontSizeResult<
	TParent extends HTMLElement,
	TChild extends HTMLElement
> {
	childRef: RefCallback<TChild>;
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
	const childHeights = useMemo(():
		| Record<'fontSize' | 'lineHeight' | 'maxHeight', number>
		| undefined => {
		if (child.style === undefined) {
			return undefined;
		}

		if (debug) console.log('childHeights');

		return {
			fontSize: Number.parseFloat(child.style.fontSize),
			maxHeight: Number.parseFloat(child.style.maxHeight),
			lineHeight: Number.parseFloat(child.style.lineHeight),
		};
	}, [child.style]);

	// Compute the child's initial text width, ensuring that the font is loaded before making any
	// measurements.
	const isFontReady: boolean = useFont(child.style?.font);
	const childInnerText: string | undefined = child.element?.innerText;
	const measureTextResult = useMemo((): MeasureTextResult | undefined => {
		if (!isFontReady || childInnerText === undefined || child.measureTextParams === undefined) {
			return undefined;
		}

		if (debug) console.log('measureTextResult');

		return measureText(childInnerText, child.measureTextParams);
	}, [childInnerText, child.measureTextParams, isFontReady]);

	if (
		child.element !== undefined &&
		childHeights !== undefined &&
		childInnerText !== undefined &&
		measureTextResult !== undefined &&
		parent.ref.current !== null &&
		parent.width !== undefined
	) {
		if (debug) console.log('childScaledFontSize');

		// From the initial text width, compute a scaled font size that will fit the parent's width.
		const fontSizeHorzFit: number =
			childHeights.fontSize * (parent.width / measureTextResult.actualWidth);

		// Compute the largest font size that won't exceed the child's max height.
		const fontSizeVertMax: number = !Number.isNaN(childHeights.maxHeight)
			? (childHeights.maxHeight * childHeights.fontSize) / childHeights.lineHeight
			: Number.MAX_VALUE;

		// Use the best option.
		const fontSize = Math.min(fontSizeHorzFit, fontSizeVertMax);

		child.element.style.setProperty('display', 'inline-block');
		child.element.style.setProperty('font-size', `${fontSize}px`);
		child.element.style.setProperty('white-space', 'nowrap');

		parent.ref.current.style.setProperty('max-width', '100%');
	}

	return {
		childRef: child.ref,
		parentRef: parent.ref,
	};
}
