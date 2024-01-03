interface Endpoint {
	path: string;
	handler: (req: Request) => Promise<Response> | Response;
}

export default class WebServer {
	private server: Deno.Listener;
	private endpoints: Endpoint[] = [];
	constructor(port: number) {
		this.server = Deno.listen({ port });
		console.log('Server listen at port: ', port);
		this.init();
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
			const endpoint = this.endpoints.find((e) =>
				e.path === url.pathname
			);
			const response = endpoint
				? await endpoint.handler(requestEvent.request)
				: new Response('Method not allowed', {
					status: 403,
				});
			!requestEvent.request.headers.get('upgrade') &&
				response.headers.set('Access-Control-Allow-Origin', '*');

			await requestEvent.respondWith(response);
		}
	}

	public addEndpoint(
		path: string,
		handler: (req: Request) => Promise<Response> | Response,
	) {
		this.endpoints.push({ path, handler });
	}

	public addSocketEndpoint(
		path: string,
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

		this.endpoints.push({ path, handler: socketHandler });
	}
}
