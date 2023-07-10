<p align="center">
	<img src="../../images/eproxe.svg"/>
</p>
	<p align="center"><img src="../../images/plus.svg"/></p>
<p align="center">
	<img width="400px" src="https://camo.githubusercontent.com/272811d860f3fab0dd8ff0690e2ca36afbf0c96ad44100b8d42dfdce8511679b/68747470733a2f2f6178696f732d687474702e636f6d2f6173736574732f6c6f676f2e737667"/>
</p>

# eproxe-axios-extension

## Install

```bash
npm i eproxe-axios-extension
```

```bash
pnpm add eproxe-axios-extension
```

## Usage

### Convetions

This exntesion relies method naming conventions to keep the syntax to a minimum

-   methods starting with `get` will result in `GET` requests, the parameters passed to the method call will be passed as query parameters on the request, the parameters will be human readable using [JSON->URL](https://jsonurl.org/)
-   methods starting with `delete` will result in `DELETE` requests, the parameters passed to the method call will be passed as query parameters on the request, the parameters will be human readable using [JSON->URL](https://jsonurl.org/)
-   methods starting with `post` will result in `POST` requests, the parameters passed to the method call will be passed as the request's body
-   methods starting with `put` will result in `PUT` requests, the parameters passed to the method call will be passed as the request's body
-   defaults to `post` if none of these convetions are met

### Example

client/api.ts

```ts
import axios from 'axios';
import eproxe from 'eproxe';
import AxiosProxyExtension from 'eproxe-axios-extension';

import type ServerAPI from '../../server/api';

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' });
const AxiosExtension = new AxiosProxyExtension(axiosInstance);

const api = AxiosExtension.extend(eproxe<ServerAPI>());

api.users.getUserById(1).then(console.log);
// ^ AxiosResponse
// GET request is sent over http
```

> see a full example [here](../../example/README.md)
