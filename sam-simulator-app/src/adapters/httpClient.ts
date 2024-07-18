import axios, { type AxiosInstance, type Method } from "axios";


export class HTTPClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({ baseURL });
    }

    public async request<R, T>({ url, method, payload }: { url: string; method: Method; payload?: R }): Promise<T> {
        try {
            const response = await this.client.request<T>({ url, data: payload, method });
            return response.data;
        } catch (error) {
            // Обработка ошибок
            if (axios.isAxiosError(error)) {
                console.error('Ошибка запроса:', error.message);
                throw new Error(`Ошибка запроса: ${error.message}`);
            } else {
                console.error('Неизвестная ошибка:', error);
                throw new Error('Неизвестная ошибка');
            }
        }
    }
}

export const httpClient = new HTTPClient(import.meta.env.VITE_APP_API_URL)