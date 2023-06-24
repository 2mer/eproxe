import { ComposeLeft, Fn } from "hotscript";
import { ProcedureProxy } from "./ProcedureProxy"
import { Expect, Equal } from "@type-challenges/utils";
import { ProxyExtension, combine } from "./DynamicProxy";
import { DynamicProxyHandlersClass, DynamicProxyPushFunction } from "./DynamicProxyHandlers";


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

	test('extensions', () => {

		interface EE1 extends Fn { return: this['arg0'] & { 1: true } }
		interface EE2 extends Fn { return: this['arg0'] & { 2: true } }

		class E1 extends ProxyExtension<EE1> {
			extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
				return class extends PrevHandlers {
					get(key: string, data: any, push: DynamicProxyPushFunction) {
						if (key === '1') return true;
						return super.get(key, data, push);
					}
				}
			}
		}

		class E2 extends ProxyExtension<EE2> {
			extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
				return class extends PrevHandlers {
					get(key: string, data: any, push: DynamicProxyPushFunction) {
						if (key === '2') return true;
						return super.get(key, data, push);
					}
				}
			}
		}

		class E3 extends ProxyExtension<ComposeLeft<[EE1, EE2]>> {
			extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
				return class extends PrevHandlers { }
			}
		}

		const prox = ProcedureProxy<{ a: () => void, b: () => void }>()

		const e1p = new E1().extend(prox)
		e1p.a()
		e1p.b()
		type e1p_t1 = Expect<Equal<typeof e1p[1], true>>
		// @ts-expect-error
		e1p[2]

		const e2p = new E2().extend(prox)
		e2p.a()
		e2p.b()
		// @ts-expect-error
		e2p[1]
		type e2p_t1 = Expect<Equal<typeof e2p[2], true>>

		const e3p = new E3().extend(prox)
		e3p.a()
		e3p.b()
		type e3p_t1 = Expect<Equal<typeof e3p[1], true>>
		type e3p_t2 = Expect<Equal<typeof e3p[2], true>>

		const ext = [new E1(), new E2()] as const;
		const ec = combine(...ext);
		const ecp = ec.extend(prox);
		ecp.a()
		ecp.b()
		const v1 = ecp[1];
		const v2 = ecp[2];
		type ecp_t1 = Expect<Equal<typeof v1, true>>;
		type ecp_t2 = Expect<Equal<typeof v2, true>>;
		expect(v1).toBe(true);
		expect(v2).toBe(true);



	})
})