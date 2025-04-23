export const pseudoRandomId = (prefix: string = '') =>
	Math.random()
		.toString(36)
		.replace('0.', prefix || '');
