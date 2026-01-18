import { APIClient } from '../api/Client';

export interface ZyntrixConfig {
    apiKey: string;
    baseUrl?: string;
    debug?: boolean;
}

class Zyntrix {
    private static instance: Zyntrix;
    private client: APIClient | null = null;
    private config: ZyntrixConfig | null = null;

    private constructor() { }

    public static getInstance(): Zyntrix {
        if (!Zyntrix.instance) {
            Zyntrix.instance = new Zyntrix();
        }
        return Zyntrix.instance;
    }

    public initialize(config: ZyntrixConfig) {
        this.config = {
            baseUrl: 'http://localhost:8000', // Default relative to where it runs, likely needs IP in real RN app
            ...config,
        };
        this.client = new APIClient(this.config.baseUrl!);
        if (this.config.debug) {
            console.log('Zyntrix SDK Initialized with config:', this.config);
        }
    }

    public getClient(): APIClient {
        if (!this.client) {
            throw new Error("Zyntrix SDK not initialized. Call Zyntrix.getInstance().initialize() first.");
        }
        return this.client;
    }
}

export default Zyntrix.getInstance();
