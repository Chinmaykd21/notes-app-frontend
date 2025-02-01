export const WS_URL = import.meta.env.VITE_WS_URL; // Use env variable for the WebSocket URL
console.log("WS URL", WS_URL);

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private readonly url: string;

  constructor(url: string = WS_URL) {
    this.url = url;
  }

  static getInstance(url: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  connect(): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.url);
      // console.log("WebSocket connected");
    }

    this.socket.onopen = () => {
      console.log("Websocket connected.");
    };

    this.socket.onclose = () => {
      console.log("Websocket disconnected.");
    };

    this.socket.onerror = (error) => {
      console.error("Websocket error:", error);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      // console.log("WebSocket disconnected.");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error("Cannot send message: WebSocket is not connected or open.");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        callback(JSON.parse(event.data));
      };
    }
  }
}
