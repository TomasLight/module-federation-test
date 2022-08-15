import { Request, Response } from 'express';
import { GetApi } from './GetApi';

type ApiConstructor = new (request: Request, response: Response) => any;

export const getApi: GetApi = (request, response) => {
	// clear route/query?id=123 ...
	const route = request.url.replace(/\?.*/, '');
	let api = apiMap.get(route);
	if (!api) {
		api = findClosestDefaultApi(route.split('/'));
	}

	return Promise.resolve(new api(request, response));
};

function findClosestDefaultApi(routeParts: string[]): ApiConstructor | undefined {
	const defaultRoute = `${routeParts.join('/')}/index`;

	const api = apiMap.get(defaultRoute);
	if (api) {
		return api;
	}

	routeParts.pop();
	if (routeParts.includes('api')) {
		return findClosestDefaultApi([...routeParts]);
	}

	return undefined;
}

const apiMap = new Map<string, ApiConstructor>();
apiMap.set('/api/env/config', require('../api/env/config').default);
