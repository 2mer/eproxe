import { Fn } from "hotscript";
import { ProxyExtension, ExtendLeaves } from "eproxe";
import useSWR, { } from "swr";

interface Promisify extends Fn {
	return: this['arg0'] extends (...args: any) => infer TRet ? (
		TRet extends Promise<any> ? (
			this['arg0']
		) : (
			(...args: Parameters<this['arg0']>) => Promise<TRet>
		)
	) : (
		this['arg0']
	)
}



export default class SwrProxyExtension extends ProxyExtension<ExtendLeaves<Promisify>> {
	constructor() {
		super({
			get(prop, internals) {
				if (prop === 'use') {
					const { path, } = internals.data
					return (...args: any) => {
						return useSWR([...path], internals.parent(...args));
					}
				}

				return internals.next();
			},
		});
	}
}