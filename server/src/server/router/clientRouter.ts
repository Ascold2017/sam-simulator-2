import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
	{
		type: 'http',
		path: '/',
		handler: async (req) => {
			try {
				const file = Deno.openSync('./client/dist/index.html', {
					read: true,
				});
				return new Response(file.readable);
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},
	{
		type: 'http',
		path: '/assets/:filename',
		handler: async (req, { params }) => {
			const ext = params.filename?.split('.').slice(-1)[0]!;

			const contentTypes = {
				'js': 'application/javascript',
				'css': 'text/css',
				'ogg': 'audio/ogg',
				'mp3': 'audio/mpeg',
			};

			try {
				const file = Deno.openSync(
					'./client/dist/assets/' + params.filename,
					{
						read: true,
					},
				);
				return new Response(file.readable, {
					// @ts-ignore
					headers: { 'Content-type': contentTypes[ext] || '' },
				});
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},
	{
		type: 'http',
		path: '/fonts/:filename',
		handler: async (req, { params }) => {
			try {
				const file = Deno.openSync(
					'./client/dist/fonts/' + params.filename,
					{
						read: true,
					},
				);
				return new Response(file.readable);
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},
];

export default router;
