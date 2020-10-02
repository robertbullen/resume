import { Property } from 'csstype';

export interface MeasureTextParams {
	compensationFactor?: number;
	font?: string;
	letterSpacing?: number;
	textTransform?: Property.TextTransform;
	wordSpacing?: number;
}

export function measureTextParamsFromStyle(style: CSSStyleDeclaration): MeasureTextParams {
	return {
		compensationFactor:
			Number.parseFloat(style.getPropertyValue('--measure-text-compensation-factor')) ||
			undefined,
		font: style.font,
		letterSpacing: Number.parseFloat(style.letterSpacing) || undefined,
		textTransform: style.textTransform as Property.TextTransform,
		wordSpacing: Number.parseFloat(style.wordSpacing) || undefined,
	};
}

export interface MeasureTextRefinements {
	/** The pixel-width adjustment caused by `MeasureTextParams.compensationFactor`.  */
	compensationFactor: number;

	/** The pixel-width adjustment caused by `MeasureTextParams.letterSpacing'. */
	letterSpacing: number;

	/** The pixel-width adjustment caused by `MeasureTextParams.textTransform'. */
	textTransform: number;

	/** The sum of all pixel-width adjustments in this type. */
	total: number;

	/** The pixel-width adjustment caused by `MeasureTextParams.wordSpacing'. */
	wordSpacing: number;
}

export interface MeasureTextResult {
	actualWidth: number;
	metrics: TextMetrics;
	refinements: MeasureTextRefinements;
}

export function measureText(
	text: string,
	params?: MeasureTextParams,
	context?: CanvasRenderingContext2D,
): MeasureTextResult {
	// Process arguments.
	if (!context) {
		measureText._context =
			measureText._context ?? document.createElement('canvas').getContext('2d') ?? undefined;
		context = measureText._context;
	}
	if (context === undefined) {
		throw new Error(
			'A canvas rendering context was not provided as an argument and a default instance could not be created',
		);
	}

	// Measure the text as-is.
	if (params?.font) {
		context.font = params.font;
	}
	const metrics: TextMetrics = context.measureText(text);
	const width: number = Math.max(
		metrics.width,
		metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft,
	);

	// Declare an object to hold all refinements.
	const refinements: MeasureTextRefinements = {
		compensationFactor: 0,
		letterSpacing: 0,
		textTransform: 0,
		total: 0,
		wordSpacing: 0,
	};

	// Calculate text transform refinements.
	let transformedText: string = text;
	if (params?.textTransform) {
		switch (params.textTransform) {
			case 'capitalize':
				transformedText =
					transformedText[0].toUpperCase() + transformedText.slice(1).toLowerCase();
				break;

			case 'lowercase':
				transformedText = transformedText.toLowerCase();
				break;

			case 'uppercase':
				transformedText = transformedText.toUpperCase();
				break;
		}
		if (transformedText !== text) {
			const transformedMetrics: TextMetrics = context.measureText(transformedText);
			const transformedWidth: number = Math.max(
				transformedMetrics.width,
				transformedMetrics.actualBoundingBoxRight -
					transformedMetrics.actualBoundingBoxLeft,
			);

			refinements.textTransform = transformedWidth - width;
			refinements.total += refinements.textTransform;
		}
	}

	if (params?.letterSpacing) {
		const letterCount: number = transformedText.length;
		refinements.letterSpacing = (letterCount - 1) * params.letterSpacing;
		refinements.total += refinements.letterSpacing;
	}

	if (params?.wordSpacing) {
		const wordCount: number = transformedText.trim().split(/\s+/).length;
		refinements.wordSpacing = (wordCount - 1) * params.wordSpacing;
		refinements.total += refinements.wordSpacing;
	}

	if (params?.compensationFactor) {
		const prefudgedWidth: number = width + refinements.total;
		refinements.compensationFactor =
			prefudgedWidth * params.compensationFactor - prefudgedWidth;
		refinements.total += refinements.compensationFactor;
	}

	return {
		actualWidth: width + refinements.total,
		metrics,
		refinements,
	};
}
measureText._context = undefined as CanvasRenderingContext2D | undefined;
