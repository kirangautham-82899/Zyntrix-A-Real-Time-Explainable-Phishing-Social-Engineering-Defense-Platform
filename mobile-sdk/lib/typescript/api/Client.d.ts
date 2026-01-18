export interface ScanResult {
    risk_level: 'safe' | 'suspicious' | 'dangerous';
    score: number;
    details: string;
}
export declare class APIClient {
    private client;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    scanUrl(url: string): Promise<ScanResult>;
    scanMessage(content: string): Promise<ScanResult>;
}
//# sourceMappingURL=Client.d.ts.map