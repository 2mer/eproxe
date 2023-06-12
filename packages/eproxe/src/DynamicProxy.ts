import { Call, Fn } from "hotscript";
import { DynamicProxyHandlers, DynamicProxyHandlersClass } from "./DynamicProxyHandlers";

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


export abstract class ProxyExtension<TProxyExtenderOrType> {

	abstract extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass;

	extend<TProxy extends ProxyBase>(proxy: TProxy) {
		const { data, handlers } = proxy[INTERNALS];

		const HandlersClass = handlers.constructor
		const ExtendedHandlers = this.extendHandlers(HandlersClass);
		const newHandlers = new ExtendedHandlers();

		return DynamicProxy({ data, handlers: newHandlers }) as TProxyExtenderOrType extends Fn ? Call<TProxyExtenderOrType, TProxy> : TProxyExtenderOrType & ProxyBase;
	}
}