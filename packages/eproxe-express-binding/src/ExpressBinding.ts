import { NextFunction, Request, Response, Router } from 'express';
import { decodeJsonUriComponent, getMethodFromName } from 'eproxe-http';

function generateRoutesFromProcedure(router: Router, procedure: any, path: string[] = []) {

	const pType = typeof procedure;
	if (pType === 'string') return;
	if (pType === 'number') return;
	if (pType === 'function') {

		const head = path[path.length - 1];
		const method = getMethodFromName(head);
		const route = path.join('/');
		const middlewares = { before: [], after: [] }

		const getHandlers = (argsGetter: (req: Request) => any[]) => [
			...middlewares.before,
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const args = argsGetter(req);
					return await procedure(...args);
				} catch (err) {
					next(err);
				}
			},
			...middlewares.after
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
		generateRoutesFromProcedure(router, value, [...path, key])
	})

}

export default function toExpress<TProcedures extends {}>(procedures: TProcedures): Router {
	const router = Router();

	generateRoutesFromProcedure(router, procedures);

	return router;
}