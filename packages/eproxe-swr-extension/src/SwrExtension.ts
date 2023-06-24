import { B, ComposeLeft, Fn, _ } from "hotscript";
import { ProxyExtension, ExtendLeaves, DynamicProxyHandlersClass, DynamicProxyPushFunction, ExtendDeep } from "eproxe";
import useSWR, { SWRResponse, mutate } from "swr";
import { ScopedMutator } from "swr/_internal";

export const UseExtensionFingerprint = Symbol('UseExtensionFingerprint');

export interface UseExtension extends Fn {
	return: this['arg0'] extends (...args: infer TArgs) => infer TRet ? (
		this['arg0'] & { use: ((...args: TArgs) => SWRResponse<Awaited<TRet>>) & { [UseExtensionFingerprint]: true } }
	) : (
		this['arg0']
	)
}

type Shift<T extends any[]> = T extends [first: any, ...rest: infer TRest] ? TRest : never;

export interface MutateExtension extends Fn {
	return: this['arg0'] & {
		mutate: (...args: Shift<Parameters<ScopedMutator<any>>>) => ReturnType<ScopedMutator<any>>,
		key: string,
	}
}

export const SwrKeySymbol = Symbol('SwrKey');

type IsNotUseExtension = ComposeLeft<[B.Extends<{ [UseExtensionFingerprint]: true }>, B.Not]>

export default class SwrProxyExtension extends ProxyExtension<ComposeLeft<[ExtendLeaves<UseExtension>, ExtendDeep<MutateExtension, IsNotUseExtension>]>> {

	getSwrHook(key: string[], fetcher: () => Promise<any>) {
		return useSWR(key, fetcher);
	}

	getKey(data: any) {
		const { path } = data
		return [...path];
	}

	extendHandlers<THandlers extends DynamicProxyHandlersClass>(PrevHandlers: THandlers): DynamicProxyHandlersClass {
		const self = this;
		return class extends PrevHandlers {
			get(key: string, data: any, push: DynamicProxyPushFunction) {

				if (key === 'use') {
					return (...args: any) => {
						const key = self.getKey(data);
						const fetcher = () => super.apply(args, data, push);

						return self.getSwrHook(key, fetcher);
					}
				}

				if (key === 'key') {
					const key = self.getKey(data);

					return key;
				}

				if (key === 'mutate') {
					const key = self.getKey(data);

					return (...args: any[]) => {
						const discriminator = (cacheKey: string[]) => {
							const keyStr = key.join('.');
							const cacheKeyStr = cacheKey.join('.');

							return cacheKeyStr.startsWith(keyStr)
						};

						mutate(discriminator, ...args);
					}
				}

				return super.get(key, data, push);
			}
		}
	}
}