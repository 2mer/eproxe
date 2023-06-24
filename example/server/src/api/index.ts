import { middleware } from "eproxe-express-binding";
import testApi from "./testApi"
import v2 from "./v2"
import { RequestHandler } from "express";

const mglobal: RequestHandler = (_, res, next) => {
	res.setHeader('data-mblobal', 'mglobal');
	console.log('hi from mglobal!');
	next();
}

const mroute: RequestHandler = (_, res, next) => {
	res.setHeader('data-mroute', 'mroute');
	console.log('hi from mroute!');
	next();
}

const api = middleware(mglobal)({
	v2,
	testApi: middleware(mroute)(testApi)
})

export default api;

export type ServerApi = typeof api;