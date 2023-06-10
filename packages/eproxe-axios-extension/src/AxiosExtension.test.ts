import { ProcedureProxy } from "eproxe"
import { encodeJsonUriComponent } from "eproxe-http"
import AxiosProxyExtension from "./AxiosExtension"

describe('Axios extension', () => {
	it('correct axios method is called', () => {
		const mockAxios = {
			get: jest.fn(),
			post: jest.fn(),
			delete: jest.fn(),
			put: jest.fn(),
		}

		const prox = ProcedureProxy<{ getX: () => 'x', putY: (y: number) => void, deleteZ: (z: string) => void, w: { postW: (w: any) => any }, doSomething: () => 'weird' }>();
		const ext = new AxiosProxyExtension(mockAxios as any);

		const axiosProxy = ext.extend(prox);

		axiosProxy.getX();
		axiosProxy.putY(6);
		axiosProxy.deleteZ('test');
		axiosProxy.w.postW({ a: 1, b: 2, c: 3 });
		axiosProxy.doSomething();

		expect(mockAxios.get.mock.calls).toHaveLength(1);
		expect(mockAxios.put.mock.calls).toHaveLength(1);
		expect(mockAxios.delete.mock.calls).toHaveLength(1);
		expect(mockAxios.post.mock.calls).toHaveLength(2);

		expect(mockAxios.get.mock.calls[0]).toMatchObject(['getX', { params: { args: encodeJsonUriComponent([]) } }]);
		expect(mockAxios.put.mock.calls[0]).toMatchObject(['putY', { args: [6] }]);
		expect(mockAxios.delete.mock.calls[0]).toMatchObject(['deleteZ', { params: { args: encodeJsonUriComponent(['test']) } }]);
		expect(mockAxios.post.mock.calls[0]).toMatchObject(['w/postW', { args: [{ a: 1, b: 2, c: 3 }] }]);
		expect(mockAxios.post.mock.calls[1]).toMatchObject(['doSomething', { args: [] }]);

	})
})