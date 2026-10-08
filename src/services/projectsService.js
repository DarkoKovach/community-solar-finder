import apiClient from './apiClient';

const projectsService = {
    /**
     * Get projects with pagination and filters
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Processed response data
     */
    async getProjects(options = {}) {
        // Extract pagination parameters
        const { page = 1, limit = 6 } = options;
        const offset = (page - 1) * limit;

        // Create direct query params object
        const queryParams = {
            page,
            limit,
            offset
        };

        // Add any filter parameters
        if (options.zip_code) queryParams.zip_code = options.zip_code;
        if (options.state) queryParams.state = options.state;

        // Use search endpoint which has pagination structure
        const response = await apiClient.get('projects/search', { params: queryParams });

        // Process the new response format
        return {
            data: response.results || [],
            totalCount: response.count || 0,
            next: response.next,
            previous: response.previous
        };
    },

    /**
    * Get a single project by slug
    * @param {string} slug - Project slug
    * @returns {Promise<Object>} - Project data
    */
    async getProjectBySlug(slug) {
        const response = await apiClient.get(`projects/${slug}`);
        return response;
    }
};

export default projectsService;