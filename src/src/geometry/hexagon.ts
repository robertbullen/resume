import { Point } from './point';

// Double width layouts.
// See <https://www.redblobgames.com/grids/hexagons/>

//  / \ / \
// |0,0|2,0|
//  \ / \ / \
//   |1,1|3,1|
//    \ / \ /

export function calcRadiusToFitColumns(width: number, columns: number): number {
	return (2 * width) / ((columns + 1) * Math.sqrt(3));
}

export function calcRadiusToFitRows(height: number, rows: number): number {
	return height / ((rows - 1) * Math.sin(Math.PI / 6) + rows + 1);
}

export function calcHeightToFitRows(radius: number, rows: number): number {
	return rows > 0 ? 2 * radius + (rows - 1) * 1.5 * radius : 0;
}

export function calcCenter(radius: number, column: number, row: number): Point {
	return new Point({
		x: ((radius * Math.sqrt(3)) / 2) * (column + 1),
		y: radius + radius * 1.5 * row,
	});
}
