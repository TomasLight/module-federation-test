import { Application, Response } from 'express';
import path from 'path';

function handleSpaRoutes(app: Application, uiBundlePath: string) {
	const sendHtml = (response: Response, htmlName: string) => {
		const pathToView = path.join(uiBundlePath, `${htmlName}.html`);
		response.sendFile(pathToView);
	};

	const handle = (route: string, htmlName: string) =>
		app.get(route, (request, response) => {
			setHeaders(response);
			sendHtml(response, htmlName);
		});

	handle('/*', 'index');
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
