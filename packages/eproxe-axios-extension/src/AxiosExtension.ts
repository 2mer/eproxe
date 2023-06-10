import { Fn } from "hotscript";
import { Axios } from "axios";
import { ProxyExtension, ExtendLeaves } from "eproxe";
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
	constructor(axiosInstance: Axios) {
		super({
			get(prop, internals) {
				const route = internals.data.path.join('/');

				return internals.next({ data: { ...internals.data, route } });
			},


			apply(args, internals) {
				const { route, head } = internals.data;
				const method = getMethodFromName(head);

				const callApi = () => {
					if (method === 'get') {
						return axiosInstance.get(route, { params: { args: encodeJsonUriComponent(args) } })
					}
					if (method === 'delete') {
						return axiosInstance.delete(route, { params: { args: encodeJsonUriComponent(args) } })
					}
					if (method === 'post') {
						return axiosInstance.post(route, args)
					}
					if (method === 'put') {
						return axiosInstance.put(route, args)
					}
				}

				return callApi()?.then(res => res.data);
			},
		});
	}
}