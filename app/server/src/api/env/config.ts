import { Request, Response } from 'express';

class ConfigApi {
  constructor(protected request: Request, protected response: Response) {}
  use() {
    this.response.setHeader('cache-control', 'no-cache');
    this.response.setHeader('X-Content-Type-Options', 'nosniff');

    this.response.status(200).send({
      testData: {
        id: '123',
        name: 'test-test',
      },
    });
  }
}

export default ConfigApi;
