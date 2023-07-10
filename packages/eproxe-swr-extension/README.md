<p align="center">
	<img src="../../images/eproxe.svg"/>
</p>
	<h2 align="center">+</h2>
<p align="center">
	<img width="400px" src="https://camo.githubusercontent.com/cd6cabc4794eae6f99339744c2db817f43eda5de8611360dce9955d2606a9f43/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313537323238393631382f7377722f62616e6e65722e706e67"/>
</p>

# eproxe-swr-extension

## Install

```bash
npm i eproxe-swr-extension
```

```bash
pnpm add eproxe-swr-extension
```

## Usage

> for this to work you need an extension that transforms eproxe calls to async data, see [extensions](../../README.md#extensions)

### Example

client/api.ts

```ts
import eproxe from 'eproxe';
import type { ServerApi } from '../../server/src/api';
import AxiosProxyExtension from 'eproxe-axios-extension';
import axios from 'axios';
import SwrProxyExtension from 'eproxe-swr-extension';

const procedures = eproxe<ServerApi>();
const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' });
const AxiosExtension = new AxiosProxyExtension(axiosInstance);
const SwrExtension = new SwrProxyExtension();

// the order matters! swr is ontop of an already present data fetching extension
const API = SwrExtension.extend(AxiosExtension.extend(procedures));

export default API;
```

client/App.tsx

```jsx
import API from './api';

function App() {
	const { data, mutate, isValidating } = API.testApi.getRandomNumber.use(
		-50,
		50
	);

	if (isValidating) return <>Loading...</>;

	return <button onClick={() => mutate()}>click to mutate ({data})</button>;
}
```

> see a full example [here](../../example/README.md)
