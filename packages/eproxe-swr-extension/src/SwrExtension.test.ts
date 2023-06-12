import { ProcedureProxy } from "eproxe";
import SwrProxyExtension from "./SwrExtension"

test('', () => {
	const prox = ProcedureProxy<{ a: 'hey', b: 'yo' }>();
	const ext = new SwrProxyExtension();

	const swrProx = ext.extend(prox);
	try {
		// @ts-expect-error
		swrProx.a.use.use
	} catch (err) { }

	expect(swrProx.a.use).toBeInstanceOf(Function);
})