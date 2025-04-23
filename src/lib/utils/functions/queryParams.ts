export const queryParams = <T extends Record<string, string | number | undefined | null>>(
	params: T
): string => {
	// create the string
	let query = '?';
	let isFirst = true;
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (!isFirst) query += '&';
		query += `${key}=${value}`;
		isFirst = false;
	}

	return isFirst ? '' : query;
};
