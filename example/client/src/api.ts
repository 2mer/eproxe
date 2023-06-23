import { ProcedureProxy } from "eproxe"
import type { ServerApi } from '../../server/src/api';
import AxiosProxyExtension from "eproxe-axios-extension";
import axios from 'axios';
import SwrProxyExtension from "eproxe-swr-extension";

const procedures = ProcedureProxy<ServerApi>();
const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' })
const AxiosExtension = new AxiosProxyExtension(axiosInstance);
const SwrExtension = new SwrProxyExtension();

// combine(
// 	AxiosExtension,
// 	SwrExtension
// ).extend(procedures)

const API = (
	SwrExtension.extend(
		AxiosExtension.extend(
			procedures
		)
	)
)

export default API;