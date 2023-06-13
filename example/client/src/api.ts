import { ProcedureProxy } from "eproxe"
import type { ServerApi } from '../../server/src/api';
import AxiosProxyExtension from "eproxe-axios-extension";
import axios from 'axios';
import SwrProxyExtension from "eproxe-swr-extension";

const procedures = ProcedureProxy<ServerApi>();
const AxiosExtension = new AxiosProxyExtension(axios);
const SwrExtension = new SwrProxyExtension();

const API = (
	SwrExtension.extend(
		AxiosExtension.extend(
			procedures
		)
	)
)

export default API;