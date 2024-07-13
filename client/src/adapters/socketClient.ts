export class SocketClient {
    private socket: WebSocket | null = null;
    private eventCallbacks: { [eventName: string]: (data: any) => void } = {};

    constructor(private baseUrl: string) {}

    private handleMessage(event: MessageEvent) {
        const message = event.data;
        const [eventName, jsonBody] = message.split('|', 2);
        const data = JSON.parse(jsonBody);

        if (this.eventCallbacks[eventName]) {
            this.eventCallbacks[eventName](data);
        }
    }

    public connect() {
        this.socket = new WebSocket(this.baseUrl);
        this.socket.onmessage = this.handleMessage.bind(this);

        this.socket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            this.socket = null;
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    public listenToEvent(eventName: string, callback: (data: any) => void) {
        this.eventCallbacks[eventName] = callback;
    }
}
