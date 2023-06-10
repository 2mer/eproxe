import { Call, Fn } from "hotscript";

const INTERNALS = Symbol('INTERNALS');

export type ProxyBase = { [INTERNALS]: any };
export type ProxyProps = { handlers: ProxyHandlers, data: any, parent: any }
export type ProxyNext = (internals?: Partial<ProxyProps>) => any;
export type ProxyInternals = ProxyProps & { next: ProxyNext };
export type ProxyHandlers = {
	get?: (prop: string | symbol, internals: ProxyInternals) => any;
	apply?: (args: any[], internals: ProxyInternals) => any;
};

export const DynamicProxy = ({ handlers, data, parent }: ProxyProps = { handlers: {}, data: {}, parent: undefined }) => {
	const target = () => { };

	const next = (props?: Partial<ProxyProps>) => {
		return DynamicProxy({ handlers, data, parent: proxy, ...props });
	}

	const internals = {
		handlers,
		data,
		parent,
		next,
	};

	const proxy: any = new Proxy(target, {
		get(target, p, receiver) {
			if (p === INTERNALS) {
				return internals;
			}

			const handler = handlers.get ?? (() => next());

			return handler(p, internals);
		},

		apply(target, thisArg, argArray) {
			const handler = handlers.apply;

			return handler && handler(argArray, internals);
		},
	});



	return proxy;
}


const extendProxy = <TProx extends ProxyBase, TProxyExtenderOrType>(prox: TProx, handlers: ProxyHandlers) => {
	const internals: ProxyInternals = prox[INTERNALS];

	return DynamicProxy({ ...internals, handlers }) as TProxyExtenderOrType extends Fn ? Call<TProxyExtenderOrType, TProx> : TProxyExtenderOrType & ProxyBase;
}

export class ProxyExtension<TProxyExtenderOrType> {
	handlers: ProxyHandlers;

	constructor(handlers: ProxyHandlers) {
		this.handlers = handlers;
	}

	extend<TProxy extends ProxyBase>(proxy: TProxy) {
		return extendProxy<TProxy, TProxyExtenderOrType>(proxy, this.handlers);
	}
}

const proxy = DynamicProxy();
const eProxy = extendProxy(proxy, ({
	get(prop, p) {
		if (prop === 'use') {
			return (...args: any) => {
				// useSWR(data.route)
			}
		}

		return p.handlers.get!(prop, p);
	},
}))