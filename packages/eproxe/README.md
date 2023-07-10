<p align="center">
	<img src="../../images/eproxe.svg"/>
</p>

# eproxe

use typesafe server actions in the client while keeping the same structure without having to learn new meta-syntax

superpower your requests with [extensions](../../README.md#Extensions)

## Install

```bash
npm i eproxe
```

```bash
pnpm add eproxe
```

## Usage

server/api.ts

```ts
const api = {
	users: {
		async getUserById(id: number) {
			// do some server work
			const user = await db.getUser(id);

			return user;
		},
	},
};

export type ServerAPI = typeof api;

export default api;
```

client/api.ts

```ts
import eproxe from 'eproxe';
import type ServerAPI from '../../server/api';

const api = eproxe<ServerAPI>();

api.users.getUserById(1).then(console.log);
```

> Note: calling from the eproxe object does little when not paired with an extension, if you wish to send http requests when calling methods on the eproxe proxy, see the [example project](../../example/README.md)

### Keeping it clean

in a real life scenario we would not want to have all of our apis in a single file, so instead separate each locigcal compartment to a separate file, and aggregate it at the api file

server/api/users.ts

```ts
export default {
	async getUserById(id: number) {
		// do some server work
		const user = await db.getUser(id);

		return user;
	},
};
```

server/api/index.ts

```ts
import users from 'api/users';

const api = {
	users,
};

export type ServerAPI = typeof api;

export default api;
```
