export interface PointInit {
	x: number;
	y: number;
}

export class Point implements PointInit {
	public constructor(init?: Partial<PointInit>) {
		this.x = init?.x ?? 0;
		this.y = init?.y ?? 0;
	}

	public static fromTuple(tuple: [number, number]) {
		return new Point({ x: tuple[0], y: tuple[1] });
	}

	public readonly x: number;
	public readonly y: number;

	toTuple(): [number, number] {
		return [this.x, this.y];
	}

	toString(): string {
		return `${this.x},${this.y}`;
	}
}
