import { middleware } from "eproxe-express-binding";
import { RequestHandler } from "express";

const m1: RequestHandler = (_, res, next) => {
	res.setHeader('data-m1', 'nice1');
	console.log('hi from m1!');
	next();
}

export default {
	getRandomNumber: middleware(m1)((min: number, max: number) => {
		const range = max - min;
		return Math.round(min + (Math.random() * range));
	})
}