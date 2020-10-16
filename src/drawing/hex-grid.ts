import { Hexagon } from './hexagon';

export interface HexGridCoordinate {
	column: number;
	row: number;
}

/**
 * Encapsulates logic for working with double-width (pointy-topped) hexagonal grid [as opposed
 * to double-height (flat-topped) grid].
 *
 * See <https://www.redblobgames.com/grids/hexagons/#coordinates-doubled>.
 */
export class HexGrid {
	public static fitToWidth(width: number, columns: number): HexGrid {
		return new HexGrid((2 * width) / ((columns + 1) * Math.sqrt(3)));
	}

	public static fitToHeight(height: number, rows: number): HexGrid {
		return new HexGrid(height / ((rows - 1) * Math.sin(Math.PI / 6) + rows + 1));
	}

	public constructor(public readonly hexagonRadius: number) {}

	public distance(a: HexGridCoordinate, b: HexGridCoordinate): number {
		const dx: number = Math.abs(a.column - b.column);
		const dy: number = Math.abs(a.row - b.row);
		return dy + Math.max(0, (dx - dy) / 2);
	}

	public hexagon(coordinate: HexGridCoordinate): Hexagon {
		return new Hexagon({
			cx: ((this.hexagonRadius * Math.sqrt(3)) / 2) * (coordinate.column + 1),
			cy: this.hexagonRadius + this.hexagonRadius * 1.5 * coordinate.row,
			r: this.hexagonRadius,
		});
	}
	public height(rows: number): number {
		return rows > 0 ? 2 * this.hexagonRadius + (rows - 1) * 1.5 * this.hexagonRadius : 0;
	}
}
