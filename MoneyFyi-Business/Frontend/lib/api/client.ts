const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface APIError {
    detail: string;
    status: number;
}

export class APIClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const error: APIError = {
                    detail: await response.text(),
                    status: response.status,
                };
                throw error;
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // User Profile APIs
    async getUserProfile() {
        return this.request('/user/profile');
    }

    async createUserProfile(data: any) {
        return this.request('/user/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateUserProfile(data: any) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Document APIs
    async getDocuments() {
        return this.request('/documents');
    }

    async getDocument(id: string) {
        return this.request(`/documents/${id}`);
    }

    async uploadDocument(formData: FormData) {
        // For file upload, we don't set Content-Type header (let browser set it with boundary)
        const response = await fetch(`${this.baseURL}/documents`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return response.json();
    }

    async deleteDocument(id: string) {
        return this.request(`/documents/${id}`, {
            method: 'DELETE',
        });
    }

    // Transaction APIs
    async getTransactions(params?: {
        limit?: number;
        offset?: number;
        start_date?: string;
        end_date?: string;
        flagged?: boolean;
    }) {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.offset) queryParams.set('offset', params.offset.toString());
        if (params?.start_date) queryParams.set('start_date', params.start_date);
        if (params?.end_date) queryParams.set('end_date', params.end_date);
        if (params?.flagged !== undefined) queryParams.set('flagged', params.flagged.toString());

        const query = queryParams.toString();
        return this.request(`/transactions${query ? `?${query}` : ''}`);
    }

    async getTransaction(id: string) {
        return this.request(`/transactions/${id}`);
    }

    async analyzeTransactions(transaction_ids: string[]) {
        return this.request('/transactions/analyze', {
            method: 'POST',
            body: JSON.stringify({ transaction_ids }),
        });
    }

    // Alert APIs
    async getAlerts() {
        return this.request('/alerts');
    }

    async getAlert(id: string) {
        return this.request(`/alerts/${id}`);
    }

    async markAlertAsRead(id: string) {
        return this.request(`/alerts/${id}/read`, {
            method: 'PUT',
        });
    }

    async resolveAlert(id: string) {
        return this.request(`/alerts/${id}/resolve`, {
            method: 'PUT',
        });
    }

    // Insights APIs
    async getExecutiveSummary() {
        return this.request('/insights/executive-summary');
    }

    async getCashflowForecast(days: number = 30) {
        return this.request(`/insights/cashflow?days=${days}`);
    }

    async getComplianceReport() {
        return this.request('/insights/compliance');
    }
}

// Singleton instance
export const apiClient = new APIClient();
