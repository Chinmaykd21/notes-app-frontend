export const WS_URL = import.meta.env.VITE_WS_URL.replace(/\/$/, ""); // ✅ Remove trailing slashes if any

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private username: string;
  private readonly url: string;

  constructor(username: string, url: string = WS_URL) {
    this.username = username;
    this.url = `${url}?username=${encodeURIComponent(username)}`; // ✅ Append username to WebSocket URL
    console.log("connecting to websocket: ", this.url);
  }

  static getInstance(username: string, url: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(username, url);
    }
    return WebSocketService.instance;
  }

  connect(): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.url);
      // console.log("WebSocket connected");
    }

    this.socket.onopen = () => {
      console.log("Websocket connected as a ", this.username);
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
