export function radiusOfCircleInHexagon(hexagonRadius: number): number {
	return hexagonRadius * Math.cos(Math.PI / 6);
}

export function sideOfSquareInCircle(circleRadius: number): number {
	return circleRadius * Math.cos(Math.PI / 4) * 2;
}
