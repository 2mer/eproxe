import { Fn } from "hotscript";
import { Axios } from "axios";
import { ProxyExtension, ExtendLeaves } from "eproxe";
import { encodeJsonUriComponent, getMethodFromName } from "eproxe-http";
import { DynamicProxyHandlersClass, DynamicProxyPushFunction } from "eproxe/dist/DynamicProxyHandler";

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

	extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
		const axiosInstance = this.axiosInstance;

		return class AxiosHandlers extends PrevHandlers {
			apply(args: any[], data: any, push: DynamicProxyPushFunction): any {
				const { path } = data;
				const head = path[path.length - 1];
				const method = getMethodFromName(head);
				const route = path.join('/');

				const callApi = () => {
					if (method === 'get') {
						return axiosInstance.get(route, { params: { args: encodeJsonUriComponent(args) } })
					}
					if (method === 'delete') {
						return axiosInstance.delete(route, { params: { args: encodeJsonUriComponent(args) } })
					}
					if (method === 'post') {
						return axiosInstance.post(route, { args })
					}
					if (method === 'put') {
						return axiosInstance.put(route, { args })
					}
				}

				return callApi()?.then(res => res.data);
			}
		}
	}


}