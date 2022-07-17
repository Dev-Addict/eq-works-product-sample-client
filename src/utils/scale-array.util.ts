export const scaleArray = (
	array: number[],
	[rangeMin, rangeMax]: [number, number],
	min = Math.min(...array),
	max = Math.max(...array)
) =>
	array.map(
		(number) =>
			((number - min) * (rangeMax - rangeMin)) / (max - min) + rangeMin
	);
