import axios, { type AxiosInstance } from 'axios';

export interface ScanResult {
    risk_level: 'safe' | 'suspicious' | 'dangerous';
    score: number;
    details: string;
}

export class APIClient {
    private client: AxiosInstance;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async scanUrl(url: string): Promise<ScanResult> {
        try {
            const response = await this.client.post('/api/analyze/url', { url });
            return {
                risk_level: response.data.risk_level,
                score: response.data.risk_score,
                details: 'Analysis completed successfully',
            };
        } catch (error) {
            console.warn('Zyntrix SDK: URL Scan failed', error);
            // Fail open (assume safe if API fails) to not block user flow unless strict mode
            return {
                risk_level: 'safe',
                score: 0,
                details: 'Scan failed, defaulting to safe',
            };
        }
    }

    async scanMessage(content: string): Promise<ScanResult> {
        try {
            const response = await this.client.post('/api/analyze/sms', { sms_content: content });
            return {
                risk_level: response.data.risk_level,
                score: response.data.risk_score,
                details: 'Message analysis completed',
            };
        } catch (error) {
            console.warn('Zyntrix SDK: Message Scan failed', error);
            return {
                risk_level: 'safe',
                score: 0,
                details: 'Scan failed, defaulting to safe',
            };
        }
    }
}
