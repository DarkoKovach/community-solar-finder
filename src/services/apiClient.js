import axios from 'axios';

// Create axios instance with proper base URL configuration
const apiClient = axios.create({
    baseURL: 'https://api.cdgm.energysage.com/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Helper method to clean endpoint paths
const getCleanEndpoint = (endpoint) => {
    // First remove leading slash if it exists
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // Then ensure there's a trailing slash
    return cleanEndpoint.endsWith('/') ? cleanEndpoint : `${cleanEndpoint}/`;
};

// Error handler helper
const handleApiError = (error) => {
    if (error.response) {
        // Server responded with non-2xx status
        const status = error.response.status;
        if (status === 404) {
            throw new Error('Endpoint not found. Please check the API URL.');
        } else if (status === 429) {
            throw new Error('Too many requests. Please try again later.');
        } else {
            throw new Error(`API error: ${error.response.data.message || 'Unknown server error'}`);
        }
    } else if (error.request) {
        // No response received
        throw new Error('No response from the server. Please check your network connection.');
    } else {
        // Request setup error
        throw new Error(`Request failed: ${error.message}`);
    }
};

// Universal API methods
export default {
    async get(endpoint, options = {}) {
        try {
            const cleanEndpoint = getCleanEndpoint(endpoint);
            const { params } = options;
            const response = await apiClient.get(cleanEndpoint, { params });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async post(endpoint, data = {}, options = {}) {
        try {
            const cleanEndpoint = getCleanEndpoint(endpoint);
            const { params } = options;
            const response = await apiClient.post(cleanEndpoint, data, { params });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async put(endpoint, data = {}, options = {}) {
        try {
            const cleanEndpoint = getCleanEndpoint(endpoint);
            const { params } = options;
            const response = await apiClient.put(cleanEndpoint, data, { params });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async patch(endpoint, data = {}, options = {}) {
        try {
            const cleanEndpoint = getCleanEndpoint(endpoint);
            const { params } = options;
            const response = await apiClient.patch(cleanEndpoint, data, { params });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async delete(endpoint, options = {}) {
        try {
            const cleanEndpoint = getCleanEndpoint(endpoint);
            const { params } = options;
            const response = await apiClient.delete(cleanEndpoint, { params });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};