export interface Endpoint {
	pattern: URLPattern;
	handler: (
		req: Request,
		params: Params,
	) => Promise<Response> | Response;
}

export interface Params {
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

export class Router {
    private basePath: string;
    private routes: (HttpRoute | WebSocketRoute)[] = [];

    constructor(basePath: string = '') {
        this.basePath = basePath;
    }

    // Добавление маршрута
    addRoute(route: HttpRoute | WebSocketRoute) {
        const fullPath = `${this.basePath}${route.path}`;
        this.routes.push({ ...route, path: fullPath });
    }

    // Добавление саброутера
    addRouter(subRouter: Router) {
        subRouter.getRoutes().forEach(route => {
            this.addRoute(route);
        });
    }

    // Получение всех маршрутов
    getRoutes(): (HttpRoute | WebSocketRoute)[] {
        return this.routes;
    }
}