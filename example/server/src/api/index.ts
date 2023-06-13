import testApi from "./testApi"
import v2 from "./v2"

const api = {
	v2,
	testApi
}

export default api;

export type ServerApi = typeof api;