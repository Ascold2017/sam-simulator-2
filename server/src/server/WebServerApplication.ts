interface Endpoint {
	pattern: URLPattern;
	handler: (
		req: Request,
		params: Params,
	) => Promise<Response> | Response;
}

interface Params {
	params: Record<string, string | undefined>;
	hash: Record<string, string | undefined>;
	search: Record<string, string | undefined>;
}

export interface HttpRoute {
	type: 'http';
	path: string;
	handler: (
		req: Request,
		params: Params,
	) => Promise<Response> | Response;
}

export interface WebSocketRoute {
	type: 'websocket';
	path: string;
	handler: (socket: WebSocket) => void;
}

export default class WebServerApplication {
	private server: Deno.Listener;
	private endpoints: Endpoint[] = [];
	constructor(port: number, router: (HttpRoute | WebSocketRoute)[]) {
		this.server = Deno.listen({ port });
		console.log('Server listen at port: ', port);
		this.init();
		this.addRouter(router);
	}

	private async init() {
		for await (const conn of this.server) {
			this.handleConnection(conn);
		}
	}

	private async handleConnection(conn: Deno.Conn) {
		const httpConn = Deno.serveHttp(conn);
		for await (const requestEvent of httpConn) {
			const url = new URL(requestEvent.request.url);
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
			!requestEvent.request.headers.get('upgrade') &&
				response.headers.set('Access-Control-Allow-Origin', '*');

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
			if (upgrade.toLowerCase() != 'websocket') {
				return new Response(
					"request isn't trying to upgrade to websocket.",
				);
			}
			const { socket, response } = Deno.upgradeWebSocket(req);

			handler(socket);

			return response;
		};

		this.endpoints.push({ pattern, handler: socketHandler });
	}

	private addRouter(routes: (HttpRoute | WebSocketRoute)[]) {
		routes.forEach((route) => {
			if (route.type === 'http') {
				this.addEndpoint(
					new URLPattern({ pathname: route.path }),
					route.handler,
				);
			}
			if (route.type === 'websocket') {
				console.log(route.path)
				this.addSocketEndpoint(
					new URLPattern({ pathname: route.path }),
					route.handler,
				);
			}
		});
	}
}
