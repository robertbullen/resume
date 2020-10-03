import { Point } from './point';

export interface HexagonInit {
	cx: number;
	cy: number;
	r: number;
}

export class Hexagon implements Readonly<HexagonInit> {
	public constructor(init?: Partial<Readonly<HexagonInit>>) {
		this.cx = init?.cx ?? 0;
		this.cy = init?.cy ?? 0;
		this.r = init?.r ?? 0;
	}

	public readonly cx: number;
	public readonly cy: number;
	public readonly r: number;

	public toSvgPath(radiusOffset: number = 0, cornerRadius: number = 0): string {
		const vertices: Point[] = [
			this.vertex(0, radiusOffset),
			this.vertex(1, radiusOffset),
			this.vertex(2, radiusOffset),
			this.vertex(3, radiusOffset),
			this.vertex(4, radiusOffset),
			this.vertex(5, radiusOffset),
		];
		if (cornerRadius === 0) {
			return `M ${vertices.join(' L ')} Z`;
		} else {
			interface QuadraticCurve {
				control: Point;
				finish: Point;
				start: Point;
			}
			const curves: QuadraticCurve[] = vertices.map(
				(currVertex: Point, index: number): QuadraticCurve => {
					const prevVertex: Point =
						vertices[index === 0 ? vertices.length - 1 : index - 1];
					const nextVertex: Point =
						vertices[index === vertices.length - 1 ? 0 : index + 1];

					return {
						control: currVertex,
						finish: Point.onLine(currVertex, nextVertex, cornerRadius),
						start: Point.onLine(currVertex, prevVertex, cornerRadius),
					};
				},
			);

			let path: string = '';
			for (const curve of curves) {
				path += `${!path ? 'M' : 'L'} ${curve.start} Q ${curve.control} ${curve.finish}`;
			}
			path += ' Z';

			return path;
		}
	}

	public vertex(index: 0 | 1 | 2 | 3 | 4 | 5, radiusOffset: number = 0): Point {
		// The trigonometic functions of `Math` operate on the standard unit circle using the
		// Cartesian coordinate system. But the most friendly sequence of vertices in the SVG
		// coordinate space are to starting from top-center and going clockwise from there,
		// progressing negatively by PI / 3 and flipping the y-offsets by negating `Math.sin()`.
		const topCenterRadians: number = Math.PI / 2;
		const vertexRadians: number = topCenterRadians - (Math.PI * index) / 3;
		return new Point({
			x: this.cx + (this.r + radiusOffset) * Math.cos(vertexRadians),
			y: this.cy + (this.r + radiusOffset) * -Math.sin(vertexRadians),
		});
	}
}
