import { DynamicProxy, ProxyExtension } from './DynamicProxy';

export function ProcedureProxy<TProcedure = any>() {
	const BaseLogic = new ProxyExtension<TProcedure>({
		get(prop, { data, next }) {
			const path = [...(data.path ?? []), prop];
			const head = prop;

			return next({ data: { ...data, path, head } })
		},
		apply(args, { data }) {
			return { data, args };
		},
	});

	return BaseLogic.extend(DynamicProxy());
}