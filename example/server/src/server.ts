import express from 'express';

import { toExpress } from "eproxe-express-binding";
import api from "./api";

const app = express()
const port = 3000

const routes = toExpress(api);

app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})