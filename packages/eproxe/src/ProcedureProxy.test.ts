import { ProcedureProxy } from "./ProcedureProxy"

describe('procedure proxy', () => {
	test('getter type check', () => {
		const p = ProcedureProxy<{ a: 'hello', b: 'world', x: { y: { z: { w: 'nested' } } } }>();
		p.a;
		p.b;
		p.x.y.z.w;

		// @ts-expect-error
		p.z;
		// @ts-expect-error
		p.x.y.z.w.a;
	})
})