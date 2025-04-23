function getCookie(name: string) {
	const cname = name + '=';
	let decodedCookie: string;

	try {
		decodedCookie = decodeURIComponent(document.cookie);
	} catch (error) {
		return '';
	}

	const ca = decodedCookie.split(';');

	for (let c of ca) {
		while (c.startsWith(' ')) {
			c = c.substring(1);
		}
		if (c.startsWith(cname)) {
			return c.substring(cname.length);
		}
	}
	return '';
}

interface CookieSetParams {
	name: string;
	value: string;
	days?: number;
}

function setCookie(params: CookieSetParams): string {
	const { name, value, days } = params;
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	const cookie = name + '=' + (value || '') + expires + '; path=/';
	document.cookie = cookie;
	return cookie;
}

export const cookie = {
	get: getCookie,
	set: setCookie
};
