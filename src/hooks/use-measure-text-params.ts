import { useMemo } from 'react';
import { MeasureTextParams, measureTextParamsFromStyle } from '../drawing/measure-text';
import { useComputedStyle, UseComputedStyleResult } from './use-computed-style';

export interface UseMeasureTextParamsResult<TElement extends Element>
	extends UseComputedStyleResult<TElement> {
	measureTextParams: MeasureTextParams | undefined;
}

export function useMeasureTextParams<TElement extends Element>(
	frequency: 'continuous' | 'initial',
): UseMeasureTextParamsResult<TElement> {
	const useComputedStyleResult: UseComputedStyleResult<TElement> = useComputedStyle<TElement>();
	let measureTextParams = useMemo(
		(): MeasureTextParams | undefined =>
			useComputedStyleResult.style &&
			measureTextParamsFromStyle(useComputedStyleResult.style),
		[useComputedStyleResult.style],
	);
	if (frequency === 'continuous') {
		measureTextParams =
			useComputedStyleResult.style &&
			measureTextParamsFromStyle(useComputedStyleResult.style);
	}
	return {
		...useComputedStyleResult,
		measureTextParams,
	};
}
