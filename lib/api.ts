// API client for ZYNTRIX backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface APIResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface HealthResponse {
    status: string;
    message: string;
    timestamp: string;
    version: string;
    services: {
        mongodb: string;
        redis: string;
        ml_engine: string;
    };
}

/**
 * Test backend connection
 */
export async function testConnection(): Promise<APIResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Connection test failed:', error);
        throw error;
    }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<HealthResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
}

/**
 * Get API information
 */
export async function getAPIInfo(): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/info`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to get API info:', error);
        throw error;
    }
}

/**
 * Analyze URL for phishing and malicious patterns
 */
export async function analyzeURL(url: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('URL analysis failed:', error);
        throw error;
    }
}

/**
 * Analyze email content for phishing and social engineering
 */
export async function analyzeEmail(emailContent: string, senderEmail?: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_content: emailContent,
                sender_email: senderEmail
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Email analysis failed:', error);
        throw error;
    }
}

/**
 * Analyze SMS/text message for scams and social engineering
 */
export async function analyzeSMS(smsContent: string, senderNumber?: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze/sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sms_content: smsContent,
                sender_number: senderNumber
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('SMS analysis failed:', error);
        throw error;
    }
}

// Export API base URL for direct use
export { API_BASE_URL };
