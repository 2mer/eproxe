import { ProcedureProxy } from "eproxe";
import { Expect, Equal } from "@type-challenges/utils";
import SwrProxyExtension from "./SwrExtension"
import { SWRResponse } from "swr";

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

	type testUseType = Expect<Equal<typeof swrProx.doSomething.use, (a: 'test') => SWRResponse<'ret'>>>

})