type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpRequestOptions<T> {
    method: HttpMethod;
    path: string;
    payload?: T;
    headers?: HeadersInit;
}

export class HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async request<TPayload, TResponse>(
        options: HttpRequestOptions<TPayload>,
    ): Promise<TResponse> {
        const url = `${this.baseUrl}${options.path}`;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(url, {
            method: options.method,
            headers,
            mode: "cors",
            body: options.method !== "GET" && options.payload
                ? JSON.stringify(options.payload)
                : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
            return response.json() as Promise<TResponse>;
        } else if (contentType && contentType.includes("text/")) {
            return response.text() as Promise<TResponse>;
        } else {
            throw new Error(`Unsupported content type: ${contentType}`);
        }
    }
}
