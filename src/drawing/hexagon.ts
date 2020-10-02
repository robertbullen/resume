import { Point } from './point';

// This file defines some functions that work with double-width layouts, as opposed to
// double-height. See <https://www.redblobgames.com/grids/hexagons/#coordinates-doubled>.

export function calcRadiusToFitColumns(width: number, columns: number): number {
	return (2 * width) / ((columns + 1) * Math.sqrt(3));
}

export function calcRadiusToFitRows(height: number, rows: number): number {
	return height / ((rows - 1) * Math.sin(Math.PI / 6) + rows + 1);
}

export function calcHeightToFitRows(hexRadius: number, rows: number): number {
	return rows > 0 ? 2 * hexRadius + (rows - 1) * 1.5 * hexRadius : 0;
}

export function calcCenter(hexRadius: number, column: number, row: number): Point {
	return new Point({
		x: ((hexRadius * Math.sqrt(3)) / 2) * (column + 1),
		y: hexRadius + hexRadius * 1.5 * row,
	});
}
