import { ProcedureProxy } from "./ProcedureProxy"
import { Expect, Equal } from "@type-challenges/utils";


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

		type tv1 = Expect<Equal<typeof p.a, 'hello'>>
		type tv2 = Expect<Equal<typeof p.b, 'world'>>
		type tv3 = Expect<Equal<typeof p.x.y.z.w, 'nested'>>
	})
})