import { DynamicProxy } from "./DynamicProxy"
import { DynamicProxyHandlers, DynamicProxyPushFunction } from "./DynamicProxyHandlers";

test('base logic', () => {
	const d = DynamicProxy();

	expect(d.a).toBeTruthy();
	expect(d.a.b).toBeTruthy();
	expect(d.a.b.c).toBeTruthy();

	expect(d.a(1, 2, 3)).toMatchObject({ data: { path: ['a'] }, args: [1, 2, 3] });
	expect(d.a.b.c(3, 2, 1)).toMatchObject({ data: { path: ['a', 'b', 'c'] }, args: [3, 2, 1] });
})

test('apply handler', () => {

	class TestHandlers extends DynamicProxyHandlers {
		get(key: string, data: any, push: DynamicProxyPushFunction) {
			if (key === 'a') return push({ ...data, path: [...(data.path ?? []), key.toUpperCase()] });
			if (key === 'b') return push(data);

			return super.get(key, data, push);
		}
	}

	const d = DynamicProxy({ handlers: new TestHandlers() });

	expect(d.a()).toMatchObject({ data: { path: ['A'] }, args: [] });
	expect(d.b()).toMatchObject({ data: {}, args: [] });
	expect(d.c()).toMatchObject({ data: { path: ['c'] }, args: [] });
	expect(d.a.b.c()).toMatchObject({ data: { path: ['A', 'c'] }, args: [] });

})