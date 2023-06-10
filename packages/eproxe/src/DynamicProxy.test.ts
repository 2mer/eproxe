import { DynamicProxy } from "./DynamicProxy"

test('base logic', () => {
	const d = DynamicProxy();

	expect(d.a).toBeTruthy();
	expect(d.a.b).toBeTruthy();
	expect(d.a.b.c).toBeTruthy();

	expect(d.a()).toBeUndefined();
})

test('apply handler', () => {
	const d = DynamicProxy({
		handlers: {
			apply(args, internals) {
				return args;
			},
		},
		data: {},
		parent: undefined
	});

	const data = [1, 2, 3]

	expect(d.a(...data)).toMatchObject(data);
})