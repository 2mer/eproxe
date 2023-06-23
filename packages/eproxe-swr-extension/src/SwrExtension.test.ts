import { ProcedureProxy } from "eproxe";
import SwrProxyExtension, { UseExtensionFingerprint } from "./SwrExtension"

test('', () => {
	const prox = ProcedureProxy<{ a: 'hey', b: 'yo', doSomething: (a: 'test') => Promise<'ret'> }>();
	const ext = new SwrProxyExtension();

	const swrProx = ext.extend(prox);

	// @ts-expect-error
	swrProx.a.use

	expect(swrProx.doSomething.use).toBeInstanceOf(Function);

	try {
		// @ts-expect-error
		swrProx.doSomething.use.use
	} catch (e) { }

	swrProx.doSomething.use.mutate
	swrProx.doSomething.use[typeof UseExtensionFingerprint]

	// type testUseType = Expect<Equal<typeof swrProx.doSomething.use, (a: 'test') => SWRResponse<'ret'>>>

})