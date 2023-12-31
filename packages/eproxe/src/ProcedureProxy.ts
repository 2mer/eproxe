import { DynamicProxy, ProxyBase } from './DynamicProxy';

export function ProcedureProxy<TProcedure = any>() {
	return DynamicProxy() as TProcedure & ProxyBase;
}