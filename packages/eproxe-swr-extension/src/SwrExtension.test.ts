import { ProcedureProxy } from "eproxe";
import SwrProxyExtension from "./SwrExtension"

test('', () => {
	const prox = ProcedureProxy<{ a: 'hey', b: 'yo', doSomething: (a: 'test') => Promise<'ret'>, c: { x: { y: { z: () => {} } } } }>();
	const ext = new SwrProxyExtension();

	const swrProx = ext.extend(prox);

	// @ts-expect-error
	swrProx.a.use

	expect(swrProx.doSomething.use).toBeInstanceOf(Function);
	expect(swrProx.c.key).toMatchObject(['c']);
	expect(swrProx.c.x.y.z.key).toMatchObject(['c', 'x', 'y', 'z']);

	try {
		// @ts-expect-error
		swrProx.doSomething.use.use
		// @ts-expect-error
		swrProx.doSomething.use.mutate
		// @ts-expect-error
		swrProx.doSomething.use.key
	} catch (e) { }


	// type testUseType = Expect<Equal<typeof swrProx.doSomething.use, (a: 'test') => SWRResponse<'ret'>>>

})