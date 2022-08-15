import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { logger } from '@libs/utils';
import { getApi } from "./productionApiMap";

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const apiMiddleware = async (request: Request, response: Response, next: NextFunction) => {
	if (!request.url.startsWith('/api')) {
		return next();
	}

	const api = await getApi(request, response);
	if (!api) {
		response.status(404).send('Not found');
		logger(request, response);
		return;
	}

	if (api.parseBody) {
		const parseMiddleware = bodyParser.json({ limit: '50mb' });

		await new Promise<void>((resolve) => {
			parseMiddleware(request, response, resolve);
		});
	}

	try {
		const method = request.method.toLowerCase() as HttpMethod;
		await api[method]();
		logger(request, response);
	} catch (error) {
		if (error instanceof Error) {
			logger(error);
		} else {
			response.status(500).send('Something went wrong');
			logger(request, response, error);
		}
	}
};

export { apiMiddleware };
