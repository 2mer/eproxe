import { Call, ComposeLeft, Fn, Tuples } from "hotscript";
import { DynamicProxyHandlers, DynamicProxyHandlersClass } from "./DynamicProxyHandlers";
import { Type } from "./util/Type";
import { GetSymbol } from "./hot";

const INTERNALS = Symbol('INTERNALS');

export type ProxyBase = { [INTERNALS]: any };
export type ProxyProps = { handlers?: DynamicProxyHandlers, data?: any }

const coreHandler = new DynamicProxyHandlers();

export const DynamicProxy = ({ handlers = coreHandler, data = {} }: ProxyProps = {}) => {
	const target = () => { };

	const internals = {
		handlers,
		data,
	};

	function push(data: any) {
		return DynamicProxy({ data, handlers });
	}

	const proxy: any = new Proxy(target, {
		get(target, p, receiver) {
			if (p === INTERNALS) {
				return internals;
			}

			return handlers.get(p as string, data, push);
		},

		apply(target, thisArg, argArray) {
			return handlers.apply(argArray, data, push);
		},
	});



	return proxy;
}

export const ExtenderTypeSymbol = Symbol('ExtenderType');

export abstract class ProxyExtension<TProxyExtenderOrType> {

	abstract extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass;

	extend<TProxy extends ProxyBase>(proxy: TProxy) {
		const { data, handlers } = proxy[INTERNALS];

		const HandlersClass = handlers.constructor
		const ExtendedHandlers = this.extendHandlers(HandlersClass);
		const newHandlers = new ExtendedHandlers();

		return DynamicProxy({ data, handlers: newHandlers }) as TProxyExtenderOrType extends Fn ? Call<TProxyExtenderOrType, TProxy> : TProxyExtenderOrType & ProxyBase;
	}

	[ExtenderTypeSymbol] = Type<TProxyExtenderOrType>();
}

type CombinedExtender<TExtensions extends ProxyExtension<any>[]> = ComposeLeft<Call<Tuples.Map<GetSymbol<typeof ExtenderTypeSymbol>>, TExtensions>>

export function combine<TExtensions extends ProxyExtension<any>[], TCombinedExtender extends CombinedExtender<TExtensions>>(...extensions: TExtensions): ProxyExtension<TCombinedExtender> {

	return new class extends ProxyExtension<TCombinedExtender> {
		extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
			throw new Error("Method not implemented.");
		}

		extend(proxy: any): any {
			return extensions.reduce((prox, ext) => ext.extend(prox), proxy);
		}
	} as ProxyExtension<TCombinedExtender>
}