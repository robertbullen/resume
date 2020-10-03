import { PointInit } from './point';
import { SizeInit } from './size';

export type RectangleInit = PointInit & SizeInit;

export class Rectangle implements Readonly<RectangleInit> {
	public constructor(init?: Partial<RectangleInit>) {
		this.height = init?.height ?? 0;
		this.width = init?.width ?? 0;
		this.x = init?.x ?? 0;
		this.y = init?.y ?? 0;
	}

	public readonly height: number;
	public readonly width: number;
	public readonly x: number;
	public readonly y: number;

	public bottom(): number {
		return this.y + this.height;
	}

	public right(): number {
		return this.x + this.width;
	}
}
