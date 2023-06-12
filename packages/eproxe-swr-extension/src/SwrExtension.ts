import { Fn } from "hotscript";
import { ProxyExtension, ExtendLeaves, DynamicProxyHandlersClass, DynamicProxyPushFunction } from "eproxe";
import useSWR, { SWRResponse } from "swr";

interface Hookify extends Fn {
	return: this['arg0'] extends (...args: infer TArgs) => infer TRet ? (
		this['arg0'] & { use: (...args: TArgs) => SWRResponse<Awaited<TRet>> }
	) : (
		this['arg0']
	)
}



export default class SwrProxyExtension extends ProxyExtension<ExtendLeaves<Hookify>> {
	extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
		return class extends PrevHandlers {
			get(key: string, data: any, push: DynamicProxyPushFunction) {

				if (key === 'use') {
					const { path } = data
					return (...args: any) => {
						return useSWR([...path], super.apply(args, data, push));
					}
				}

				return super.get(key, data, push);
			}
		}
	}
}