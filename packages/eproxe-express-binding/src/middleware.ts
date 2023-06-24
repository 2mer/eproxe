import { RequestHandler } from "express";

export const MiddlewareSymbol = Symbol('Middleware');

const middlewareX = (key: string) => (...middlewares: RequestHandler[]) => {
	return <THandler extends (...args: any) => any>(handler: THandler): THandler => {
		// @ts-ignore
		const middlewareStore = handler[MiddlewareSymbol] ??= {}
		const xMiddlewares = middlewareStore[key] ??= [];

		xMiddlewares.push(...middlewares);
		return handler;
	}
}

const middleware = middlewareX('before');
const ext = {
	before: middlewareX('before'),
	after: middlewareX('after'),
};
Object.assign(middleware, ext);
const typedMiddleware = middleware as typeof middleware & typeof ext

export { typedMiddleware as middleware }