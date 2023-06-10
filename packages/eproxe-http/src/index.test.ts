import { getMethodFromName } from "./index"

describe('eproxe http util', () => {
	it('method return types', () => {
		expect(getMethodFromName('postX')).toBe('post');
		expect(getMethodFromName('getX')).toBe('get');
		expect(getMethodFromName('deleteX')).toBe('delete');
		expect(getMethodFromName('putX')).toBe('put');
		expect(getMethodFromName('somethingElse')).toBe('post');
	})
})