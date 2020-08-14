interface RectangleInit {
	height: number;
	width: number;
	x: number;
	y: number;
}

export class Rectangle implements Readonly<RectangleInit> {
	public constructor(init: Partial<RectangleInit>) {
		Object.assign(this, init);
	}

	public readonly height: number = 0;
	public readonly width: number = 0;
	public readonly x: number = 0;
	public readonly y: number = 0;

	public get bottom(): number {
		return this.y + this.height;
	}

	public get right(): number {
		return this.x + this.width;
	}
}
