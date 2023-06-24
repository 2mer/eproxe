import JsonURL from "@jsonurl/jsonurl";

export function getMethodFromName(name: string) {
	if (name.startsWith('get')) return 'get';
	if (name.startsWith('post')) return 'post';
	if (name.startsWith('put')) return 'put';
	if (name.startsWith('delete')) return 'delete';

	return 'post';
}

export function encodeJsonUriComponent(obj: any, options?: Parameters<typeof JsonURL.stringify>[1]) {
	return JsonURL.stringify(obj, options ?? { AQF: true });
}

export function decodeJsonUriComponent(str: string, options?: Parameters<typeof JsonURL.parse>[1]) {
	return JsonURL.parse(str, options ?? { AQF: true });
}