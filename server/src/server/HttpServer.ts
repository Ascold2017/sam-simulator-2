interface Endpoint {
	path: string;
	handler: (reqEvent: Deno.RequestEvent) => void;
}

export default class HttpServer {
	private server: Deno.Listener;
	private endpoints: Endpoint[] = [];
	constructor(port: number) {
		this.server = Deno.listen({ port });
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
			if (endpoint) return endpoint.handler(requestEvent);
			await requestEvent.respondWith(
				new Response('Method not allowed', {
					status: 403,
				}),
			);
		}
	}

	public addEndpoint(
		path: string,
		handler: (reqEvent: Deno.RequestEvent) => void,
	) {
		this.endpoints.push({ path, handler });
	}
}
