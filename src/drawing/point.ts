export interface PointInit {
	x: number;
	y: number;
}

export class Point implements Readonly<PointInit> {
	public constructor(init?: Partial<Readonly<PointInit>>) {
		this.x = init?.x ?? 0;
		this.y = init?.y ?? 0;
	}

	public readonly x: number;
	public readonly y: number;

	public static distance(p1: PointInit, p2: PointInit): number {
		return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
	}

	public static onLine(p1: PointInit, p2: PointInit, distanceFromP1: number): Point {
		const distance: number = Point.distance(p1, p2);
		const xProportion: number = (p2.x - p1.x) / distance;
		const yProportion: number = (p2.y - p1.y) / distance;
		return new Point({
			x: p1.x + xProportion * distanceFromP1,
			y: p1.y + yProportion * distanceFromP1,
		});
	}

	public toString(): string {
		return `${this.x},${this.y}`;
	}
}
