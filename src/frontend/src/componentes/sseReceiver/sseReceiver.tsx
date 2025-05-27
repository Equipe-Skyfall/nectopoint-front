// Fixed SSEReceiver with proper backend URL and authentication

type Callback = (data: any) => void;

class SSEReceiver {
    private static instance: SSEReceiver | null = null;
    private eventSource: EventSource | null = null;
    private callback: Callback | null = null;

    private constructor() {}

    public static getInstance(): SSEReceiver {
        if (!SSEReceiver.instance) {
            SSEReceiver.instance = new SSEReceiver();
        }
        return SSEReceiver.instance;
    }

    public start(url: string, callback: Callback): void {
        this.stop(); // Ensure no previous connection
        this.callback = callback;
        
        // Since you're using Vite proxy, use the relative URL
        console.log("Connecting to SSE at:", url);
        
        // EventSource with credentials (to send cookies)
        this.eventSource = new EventSource(url, {
            withCredentials: true
        });

        this.eventSource.onopen = () => {
            console.log("✅ SSE connection opened successfully");
        };

        // Listen for the named "ping" events that your backend sends
        this.eventSource.addEventListener('ping', (event: any) => {
            console.log("📩 Received ping event:", event.data);
            if (this.callback) {
                this.callback(event.data);
            }
        });

        this.eventSource.onmessage = (event) => {
            console.log("📩 Received unnamed message:", event.data);
            if (this.callback) {
                this.callback(event.data);
            }
        };

        this.eventSource.onerror = (error) => {
            console.error("❌ SSE connection error:", error);
            console.error("EventSource readyState:", this.eventSource?.readyState);
            
            // Provide more helpful error information
            if (this.eventSource?.readyState === EventSource.CLOSED) {
                console.error("SSE connection was closed. Possible causes:");
                console.error("1. Backend server is not running on port 8080");
                console.error("2. Authentication failed (cookies not sent)");
                console.error("3. CORS configuration issue");
                console.error("4. SSE endpoint returned an error");
            }
        };
    }

    public stop(): void {
        if (this.eventSource) {
            console.log("🔌 Closing SSE connection");
            this.eventSource.close();
            this.eventSource = null;
        }
        this.callback = null;
    }
}

export default SSEReceiver;