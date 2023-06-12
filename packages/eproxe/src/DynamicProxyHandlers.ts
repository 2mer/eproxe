export type DynamicProxyPushFunction = (data: any) => any;

export class DynamicProxyHandlers {
	constructor(...args: any[]) {
	}

	get(key: string, data: any, push: DynamicProxyPushFunction): any {

		const path: string[] = data.path ?? []
		path.push(key);

		return push({ ...data, path });
	}

	apply(args: any[], data: any, push: DynamicProxyPushFunction): any {
		return { args, data };
	}
}

export type DynamicProxyHandlersClass = { new(...args: any[]): DynamicProxyHandlers };