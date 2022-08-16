import { Application, Response } from 'express';
import path from 'path';

function handleSpaRoutes(app: Application, uiBundlePath: string) {
  app.get('/*', (request, response) => {
    setHeaders(response);
    const pathToView = path.join(uiBundlePath, 'index.html');
    response.sendFile(pathToView);
  });
}

function setHeaders(response: Response) {
  response.setHeader(
    'Feature-Policy',
    "microphone 'none'; geolocation 'none'; accelerometer 'none'; camera 'none';gyroscope 'none';usb 'none'"
  );
  response.setHeader('Referrer-Policy', 'strict-origin');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  response.setHeader('X-Frame-Options', 'deny'); // for IE support
  response.setHeader('Content-Security-Policy', 'frame-ancestors none');

  response.setHeader('X-XSS-Protection', '1; mode=block');
  response.setHeader('Strict-Transport-Security', 'max-age=31536000');
}

export { handleSpaRoutes };
