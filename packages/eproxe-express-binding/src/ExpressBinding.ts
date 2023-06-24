import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { decodeJsonUriComponent, getMethodFromName } from 'eproxe-http';
import { MiddlewareSymbol } from './middleware';

type RouteData = { path: string[], middleware: { before: RequestHandler[], after: RequestHandler[] } }

function generateRoutesFromProcedure(router: Router, procedure: any, data: RouteData = { path: [], middleware: { before: [], after: [] } }) {

	const { path, middleware } = data;

	const pMiddlewares = procedure[MiddlewareSymbol];

	const combinedMiddlewares = {
		before: [...middleware.before, ...(pMiddlewares?.before ?? [])],
		after: [...middleware.after, ...(pMiddlewares?.after ?? [])],
	}


	const pType = typeof procedure;
	if (pType === 'string') return;
	if (pType === 'number') return;
	if (pType === 'function') {

		const head = path[path.length - 1];
		const method = getMethodFromName(head);
		const route = '/' + path.join('/');

		const getHandlers = (argsGetter: (req: Request) => any[]) => [
			...combinedMiddlewares.before,
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const args = argsGetter(req);
					const ret = await procedure(...args);

					res.status(200).send({ result: ret });
				} catch (err) {
					next(err);
				}
			},
			...combinedMiddlewares.after,
		]

		const handleMethod = () => {
			if (['get', 'delete'].includes(method)) {
				router[method](route, getHandlers(req => decodeJsonUriComponent(req.query.args as string)))
				return;
			}

			router[method](route, getHandlers(req => (req.body.args)))
		}

		handleMethod();
	}

	const entries = Object.entries(procedure);

	entries.forEach(([key, value]) => {
		generateRoutesFromProcedure(router, value, { path: [...path, key], middleware: combinedMiddlewares })
	})

}

export default function toExpress<TProcedures extends {}>(procedures: TProcedures): Router {
	const router = Router();

	generateRoutesFromProcedure(router, procedures);

	return router;
}