export function getMethodFromName(name: string) {
	if (name.startsWith('get')) return 'get';
	if (name.startsWith('post')) return 'post';
	if (name.startsWith('put')) return 'put';
	if (name.startsWith('delete')) return 'delete';

	return 'post';
}

export function encodeJsonUriComponent(obj: any) {
	return encodeURIComponent(JSON.stringify(obj))
}

export function decodeJsonUriComponent(str: string) {
	return JSON.parse(decodeURIComponent(str));
}