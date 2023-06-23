import express from 'express';
import cors from 'cors';

import { toExpress } from "eproxe-express-binding";
import api from "./api";

const app = express()
const port = 3000

app.use(cors({
	origin: 'http://localhost:5173'
}))

const routes = toExpress(api);

app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})