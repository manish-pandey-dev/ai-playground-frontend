// ===== src/services/api.js =====
class APIService {
    constructor() {
        this.baseURL = 'https://ai-playground-421016501960.europe-west4.run.app';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    async request(endpoint, options = {}) {
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    async getModels() {
        return this.request('/models');
    }

    async getStats() {
        return this.request('/stats');
    }

    async sendMessage(model, prompt, maxTokens = 150, temperature = 0.7) {
        return this.request('/ask-ai', {
            method: 'POST',
            body: JSON.stringify({
                model,
                prompt,
                max_tokens: maxTokens,
                temperature
            })
        });
    }

    async runHealthCheck() {
        return this.request('/health-check');
    }
}

export const apiService = new APIService();