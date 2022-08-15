import fs from 'fs';
import path from 'path';
import { ApiBase } from '../api';
import { GetApi } from './GetApi';
import { isConstructor } from './isConstructor';

const rootPath = path.join(__dirname, '..');

const getApiByRequest: GetApi = async (request, response) => {
	if (!request) {
		return;
	}

	const routeParts = request.url
		.replace(/\?.*/, '') // clear route/query?id=123 ...
		.split('/');
	let filePath = path.join(rootPath, ...routeParts);

	if (await fileExists(`${filePath}.ts`)) {
		filePath = `${filePath}.ts`;
	} else {
		filePath = await findClosestDefaultApi([...routeParts]);
		if (!filePath) {
			return undefined;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const ApiClass: typeof ApiBase = require(filePath).default;
	if (!ApiClass || typeof ApiClass !== 'function') {
		console.log(`${filePath} has no default export to register it as endpoint`);
		return undefined;
	}

	if (!isConstructor(ApiClass)) {
		console.log(`${ApiClass.name} is not constructable`);
		return undefined;
	}

	return new ApiClass(request, response);
};

async function fileExists(filePath: string) {
	try {
		await fs.promises.access(filePath);
		return true;
	} catch (error) {
		return false;
	}
}

async function findClosestDefaultApi(routeParts: string[]): Promise<string> {
	const tsFilePath = path.join(rootPath, ...routeParts, 'index.ts');

	if (await fileExists(tsFilePath)) {
		return tsFilePath;
	}

	routeParts.pop();
	if (routeParts.includes('api')) {
		return findClosestDefaultApi([...routeParts]);
	}

	return '';
}

export { getApiByRequest };
