import { RefCallback, useCallback, useState } from 'react';

export interface UseComputedStyleResult<TElement extends Element> {
	element: TElement | undefined;
	style: CSSStyleDeclaration | undefined;
	ref: RefCallback<TElement>;
}

/**
 * A React hook that returns an element and its computed style via a ref. Use as follows:
 *
 * ```javascript
 * function MyComponent() {
 *     const { element, ref, style } = useComputedStyle();
 *     return (
 *        <div ref={ref}>
 *        </div>
 *     );
 * }
 * ```
 */
export function useComputedStyle<TElement extends Element>(): UseComputedStyleResult<TElement> {
	const [element, setElement] = useState<TElement>();
	const [style, setStyle] = useState<CSSStyleDeclaration>();
	const ref = useCallback((element: TElement | null): void => {
		setElement(element ?? undefined);
		setStyle(element ? window.getComputedStyle(element) : undefined);
	}, []);
	return {
		element,
		style,
		ref,
	};
}
