import { HttpClient } from "./httpClient";
import { SocketClient } from "./socketClient";

export const samHttpClient = new HttpClient(
    import.meta.env.VITE_SAM_BASE_URL,
);

export const editorHttpClient = new HttpClient(
    import.meta.env.VITE_EDITOR_BASE_URL,
);

export const samSocketClient = new SocketClient(
    import.meta.env.VITE_SOCKET_BASE_URL,
);
