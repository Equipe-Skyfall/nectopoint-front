// Classe SSERefetch melhorada para uso flexível e seguro

type Callback = (data: any) => void;

export default class SSEReceiver {
    private static instance: SSEReceiver | null = null;
    private eventSource: EventSource | null = null;
    private callback: Callback | null = null;

    private constructor() {}

    // Permite atualizar o callback a qualquer momento
    public static getInstance(): SSEReceiver {
        if (!SSEReceiver.instance) {
            SSEReceiver.instance = new SSEReceiver();
        }
        return SSEReceiver.instance;
    }

    // Inicia o SSE e define o callback a ser chamado ao receber mensagem
    public start(url: string, callback: Callback): void {
        this.stop(); // Garante que não há conexão anterior aberta
        this.callback = callback;
        this.eventSource = new EventSource(url);

        this.eventSource.onmessage = (event) => {
            
            try {
                const data = JSON.parse(event.data);
                if (this.callback) {
                    this.callback(data);
                }
                console.log(data)
                console.log(this.eventSource)
            } catch (e) {
                console.error("Erro ao processar mensagem SSE:", e);
            }
        };

        this.eventSource.onerror = (error) => {
            console.error("Erro na conexão SSE:", error);
            this.stop();
        };
    }

    // Para a conexão SSE
    public stop(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.callback = null;
    }
}