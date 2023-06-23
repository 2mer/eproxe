import { Fn } from "hotscript";
import { Axios } from "axios";
import { ProxyExtension, ExtendLeaves, DynamicProxyHandlersClass, DynamicProxyPushFunction } from "eproxe";
import { encodeJsonUriComponent, getMethodFromName } from "eproxe-http";

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

export default class AxiosProxyExtension extends ProxyExtension<ExtendLeaves<Promisify>> {
	axiosInstance: Axios;

	constructor(axiosInstance: Axios) {
		super();
		this.axiosInstance = axiosInstance;
	}

	argsToParams(args: any[]): any {
		return { args: encodeJsonUriComponent(args) };
	}

	extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
		const axiosInstance = this.axiosInstance;
		const ext = this;

		return class AxiosHandlers extends PrevHandlers {
			// configure prefix
			// get(key: string, data: any, push: DynamicProxyPushFunction) {
			// 	if (key === '') return '';

			// 	return '';
			// }

			apply(args: any[], data: any, push: DynamicProxyPushFunction): any {
				const { path } = data;
				const head = path[path.length - 1];
				const method = getMethodFromName(head);
				const route = path.join('/');

				const callApi = () => {
					if (method === 'get') {
						return axiosInstance.get(route, { params: ext.argsToParams(args) })
					}
					if (method === 'delete') {
						return axiosInstance.delete(route, { params: ext.argsToParams(args) })
					}
					if (method === 'post') {
						return axiosInstance.post(route, { args })
					}
					if (method === 'put') {
						return axiosInstance.put(route, { args })
					}
				}

				return callApi()?.then(res => res.data.result);
			}
		}
	}


}