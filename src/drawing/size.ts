export interface SizeInit {
	height: number;
	width: number;
}

export class Size implements Readonly<SizeInit> {
	public constructor(init?: Partial<Readonly<SizeInit>>) {
		this.height = init?.height ?? 0;
		this.width = init?.width ?? 0;
	}

	public readonly height: number;
	public readonly width: number;
}
