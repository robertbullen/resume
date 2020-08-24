export interface SizeInit {
	height: number;
	width: number;
}

export class Size implements Readonly<SizeInit> {
	public constructor(init?: Partial<SizeInit>) {
		this.height = init?.height ?? 0;
		this.width = init?.width ?? 0;
	}

	public static fromTuple(tuple: [number, number]): Size {
		return new Size({ width: tuple[0], height: tuple[1] });
	}

	public readonly height: number;
	public readonly width: number;

	toTuple(): [number, number] {
		return [this.width, this.height];
	}
}
