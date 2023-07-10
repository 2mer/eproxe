<p align="center">
	<img src="../../images/eproxe.svg"/>
</p>
	<p align="center"><img src="../../images/plus.svg"/></p>
<p align="center">
	<img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/express-logo.png"/>
</p>

# eproxe-express-binding

## Install

```bash
npm i eproxe-express-binding
```

```bash
pnpm add eproxe-express-binding
```

## Usage

### Convetions

This exntesion relies method naming conventions to keep the syntax to a minimum

-   methods starting with `get` will result in `GET` routes, the parameters passed to the method call will be parsed from the query parameters on the request, the parameters will be human readable using [JSON->URL](https://jsonurl.org/)
-   methods starting with `delete` will result in `DELETE` routes, the parameters passed to the method call will be parsed from the query parameters on the request, the parameters will be human readable using [JSON->URL](https://jsonurl.org/)
-   methods starting with `post` will result in `POST` routes, the parameters passed to the method call will be parsed from the request's body
-   methods starting with `put` will result in `PUT` routes, the parameters passed to the method call will be parsed from the request's body
-   defaults to `post` if none of these convetions are met

### Example

server.ts

```ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { toExpress } from 'eproxe-express-binding';
import api from './api';

const app = express();
const port = 3000;

app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);

app.use(bodyParser.json());

// create routes from the api object
const routes = toExpress(api);

app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
```

> see a full example [here](../../example/README.md)

### Accessing request/response

eproxe tries to abstract most of the request/response interface from the library consumer, but sometimes we must still use it when writing more complicated code

in these scenarios we can either:

#### Context (Recommended)

as a way of life, i cannot reccomend enough you use context inside express, it kinda makes you wonder why it isnt like this in the first place
taking the power of context and hooks known and loved by react devs into node
here is a short example of accessing the request/response in our api using express context

app.ts

```ts
import { ExpressProvider } from '@sgty/kontext-express';
import api from './api';

// wrap the app with the express context
app.use(ExpressProvider());

app.use(toExpress(api));
```

api/index.ts

```ts
import { useExpress } from '@sgty/kontext-express';

const api = {
	doSomething() {
		const { req, res } = useExpress();

		res.setHeader('is-using-context', 'absolutely');

		return `something was done here: ${req.originalUrl}`;
	},
};

export default api;
```

see more about context in node and express [here](https://github.com/2mer/kontext)

#### Middleware

write an express middleware, we can invoke our code before, or after the original eproxe code is run
