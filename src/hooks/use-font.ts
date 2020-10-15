import { useEffect, useState } from 'react';

export function useFont(font?: string): boolean {
	const [fontReady, setFontReady] = useState<boolean>(false);

	useEffect(() => {
		let newFontReady: boolean = false;
		if (font) {
			newFontReady = document.fonts.check(font);
			setFontReady(newFontReady);

			if (!newFontReady) {
				document.fonts.ready.then((): void => setFontReady(true));
			}
		}
	}, [font]);

	return fontReady;
}
