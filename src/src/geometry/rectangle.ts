import { Point, PointInit } from './point';
import { Size, SizeInit } from './size';

export type RectangleInit = PointInit & SizeInit;

export class Rectangle implements Readonly<RectangleInit>, Readonly<SizeInit> {
	public constructor(init?: Partial<RectangleInit>) {
		this.point = new Point(init);
		this.size = new Size(init);
	}

	public static fromTuple(tuple: [[number, number], [number, number]]): Rectangle {
		return new Rectangle({ ...Point.fromTuple(tuple[0]), ...Size.fromTuple(tuple[1]) });
	}

	public readonly point: Point;
	public readonly size: Size;

	public get height(): number {
		return this.size.height;
	}
	public get width(): number {
		return this.size.width;
	}
	public get x(): number {
		return this.point.x;
	}
	public get y(): number {
		return this.point.y;
	}

	public get bottom(): number {
		return this.y + this.height;
	}

	public get right(): number {
		return this.x + this.width;
	}

	public toJSON(): RectangleInit {
		return { height: this.height, width: this.width, x: this.x, y: this.y };
	}

	public toTuple(): [[number, number], [number, number]] {
		return [this.point.toTuple(), this.size.toTuple()];
	}
}
