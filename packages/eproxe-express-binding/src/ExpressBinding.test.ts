import { Router } from "express";
import toExpress from "./ExpressBinding"

describe('express binding', () => {
	it('router', () => {
		const p = { a: 1, b: 5, c: { x: 'hey' } };
		const bindings = toExpress(p);

		expect(bindings).toBeInstanceOf(Router);
	})
})