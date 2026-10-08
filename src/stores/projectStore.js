import { defineStore } from 'pinia';
import projectsService from '@services/projectsService';

export const useProjectStore = defineStore('projects', {
    state: () => ({
        // List page state
        projects: [],
        loading: false,
        error: null,
        filters: {
            zipCode: '',
            state: '',
            name: ''
        },
        pagination: {
            currentPage: 1,
            itemsPerPage: 6,
            totalItems: 0,
            nextPageUrl: null,
            previousPageUrl: null
        },

        // Detail page state
        currentProject: null,
        projectLoading: false,
        projectError: null
    }),

    getters: {
        hasProjects: (state) => state.projects.length > 0,
        totalPages: (state) => Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage)
    },

    actions: {
        async loadProjects(options = {}) {
            this.loading = true;
            this.error = null;

            try {
                const page = options.page || this.pagination.currentPage;
                const limit = this.pagination.itemsPerPage;
                const offset = (page - 1) * limit;

                // Build query parameters
                const queryParams = {
                    page,
                    limit,
                    offset,
                };

                // Add filters if they exist
                if (this.filters.zipCode && !options.zip_code) {
                    queryParams.zip_code = this.filters.zipCode;
                } else if (options.zip_code) {
                    queryParams.zip_code = options.zip_code;
                }

                if (this.filters.state && !options.state) {
                    queryParams.state = this.filters.state;
                } else if (options.state) {
                    queryParams.state = options.state;
                }

                if (this.filters.name && !options.name) {
                    queryParams.name = this.filters.name;
                } else if (options.name) {
                    queryParams.name = options.name;
                }

                // Fetch from API
                const response = await projectsService.getProjects(queryParams);

                // Update state with results
                this.projects = response.data;
                this.pagination.totalItems = response.totalCount;
                this.pagination.currentPage = page;
                this.pagination.nextPageUrl = response.next;
                this.pagination.previousPageUrl = response.previous;

            } catch (error) {
                this.error = error.message || 'An unexpected error occurred';
            } finally {
                this.loading = false;
            }
        },

        async loadProjectDetail(slug) {
            this.projectLoading = true;
            this.projectError = null;

            try {
                // First check if project is in our current list
                const projectFromList = this.projects.find(p => p.slug === slug);

                if (projectFromList) {
                    this.currentProject = projectFromList;
                } else {
                    // Fetch from API if not found in current list
                    const response = await projectsService.getProjectBySlug(slug);
                    this.currentProject = response;
                }
            } catch (error) {
                this.projectError = error.message || 'An unexpected error occurred';
                throw error;
            } finally {
                this.projectLoading = false;
            }
        }
    }
});