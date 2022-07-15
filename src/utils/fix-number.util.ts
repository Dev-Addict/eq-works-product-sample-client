export const fixNumber = (value: number, decimals = 2) =>
	Math.ceil(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
