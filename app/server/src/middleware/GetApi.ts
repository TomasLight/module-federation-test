import { Request, Response } from 'express';
import { ApiBase } from '../api';

export type GetApi = (request: Request, response: Response) => Promise<ApiBase | undefined>;
