import { APIClient } from '../api/Client';
export interface ZyntrixConfig {
    apiKey: string;
    baseUrl?: string;
    debug?: boolean;
}
declare class Zyntrix {
    private static instance;
    private client;
    private config;
    private constructor();
    static getInstance(): Zyntrix;
    initialize(config: ZyntrixConfig): void;
    getClient(): APIClient;
}
declare const _default: Zyntrix;
export default _default;
//# sourceMappingURL=Zyntrix.d.ts.map