import { Router, Endpoint, Params, HttpRoute, WebSocketRoute } from './router.ts';

export class Server {
	private server: Deno.Listener;
	private endpoints: Endpoint[] = [];
	constructor(port: number, router: Router) {
		this.server = Deno.listen({ port });
		console.log('Server listen at port: ', port);
		
		this.addRoutes(router.getRoutes());
		this.init();
	}

	private async init() {
		for await (const conn of this.server) {
			this.handleRequest(conn);
		}
	}

	private async handleRequest(conn: Deno.Conn) {
		const httpConn = Deno.serveHttp(conn);
		for await (const requestEvent of httpConn) {
			const url = new URL(requestEvent.request.url);

			if (requestEvent.request.method === 'OPTIONS') {
				const response = new Response(null, {
					status: 204,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				});
				await requestEvent.respondWith(response);
				continue;
			}
			
			const endpoint = this.endpoints.find((e) => e.pattern.test(url));
			const match = endpoint?.pattern.exec(url);

			const params: Params = {
				params: match?.pathname.groups || {},
				hash: match?.hash.groups || {},
				search: match?.search.groups || {},
			};
			const response = endpoint
				? await endpoint.handler(requestEvent.request, params)
				: new Response('Method not allowed', {
					status: 403,
				});
			if (!requestEvent.request.headers.get('upgrade')) {
				response.headers.set('Access-Control-Allow-Origin', '*');
				response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
				response.headers.set('Access-Control-Allow-Headers', ' Content-Type')
			}
				

			await requestEvent.respondWith(response);
		}
	}

	private addEndpoint(
		pattern: URLPattern,
		handler: (req: Request, params: Params) => Promise<Response> | Response,
	) {
		this.endpoints.push({ pattern, handler });
	}

	private addSocketEndpoint(
		pattern: URLPattern,
		handler: (socket: WebSocket) => void,
	) {
		const socketHandler = (req: Request) => {
			const upgrade = req.headers.get('upgrade') || '';
            if (upgrade.toLowerCase() !== 'websocket') {
                return new Response("Request isn't trying to upgrade to websocket.", { status: 426 });
            }
			const { socket, response } = Deno.upgradeWebSocket(req);

			handler(socket);

			return response;
		};

		this.endpoints.push({ pattern, handler: socketHandler });
	}

	private addRoutes(routes: (HttpRoute | WebSocketRoute)[]) {
		routes.forEach((route) => {
			if (route.type === 'http') {
				this.addEndpoint(
					new URLPattern({ pathname: route.path }),
					route.handler,
				);
			}
			if (route.type === 'websocket') {
				this.addSocketEndpoint(
					new URLPattern({ pathname: route.path }),
					route.handler,
				);
			}
		});
	}
}
