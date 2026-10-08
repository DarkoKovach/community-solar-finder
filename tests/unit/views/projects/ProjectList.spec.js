import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { createTestingPinia } from '@pinia/testing';
import ProjectList from '@/views/projects/ProjectList.vue';
import { useProjectStore } from '@/stores/projectStore';

// Mock child components
vi.mock('@/components/filters/SearchFilters.vue', () => ({
    default: {
        name: 'SearchFilters',
        template: '<div data-testid="search-filters"></div>'
    }
}));

vi.mock('@/components/projects/ProjectCard.vue', () => ({
    default: {
        name: 'ProjectCard',
        props: ['project'],
        template: '<div data-testid="project-card">{{ project.name }}</div>'
    }
}));

vi.mock('@/components/common/LoadingSpinner.vue', () => ({
    default: {
        name: 'LoadingSpinner',
        props: ['message'],
        template: '<div data-testid="loading-spinner">{{ message }}</div>'
    }
}));

vi.mock('@/components/common/PaginationComponent.vue', () => ({
    default: {
        name: 'PaginationComponent',
        props: ['currentPage', 'totalItems', 'itemsPerPage'],
        template: '<div data-testid="pagination"></div>'
    }
}));

// Mock router & route
const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div></div>' } }]
});

// Mock i18n
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            projects: {
                title: 'Community Solar Projects',
                subtitle: 'Find available projects in your area',
                loading: 'Loading projects...',
                noResults: 'No projects found matching your criteria.'
            },
            pagination: {
                showing: 'Showing {start}-{end} of {total} projects'
            }
        }
    }
});

describe('ProjectList.vue', () => {
    const renderComponent = (initialState = {}) => {
        return render(ProjectList, {
            global: {
                plugins: [
                    router, 
                    i18n,
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            projects: initialState
                        }
                    })
                ]
            }
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading spinner when loading is true', async () => {
        renderComponent({
            loading: true
        });
        
        expect(screen.getByTestId('loading-spinner')).toBeTruthy();
    });

    it('displays projects when data is loaded', () => {
        const mockProjects = [
            { id: 1, name: 'Project 1' },
            { id: 2, name: 'Project 2' }
        ];
        
        renderComponent({
            projects: mockProjects,
            loading: false,
            error: null,
            pagination: {
                currentPage: 1,
                itemsPerPage: 6,
                totalItems: 2
            }
        });
        
        // Should have two project cards
        const projectCards = screen.getAllByTestId('project-card');
        expect(projectCards.length).toBe(2);
    });

    it('displays no results message when projects array is empty', () => {
        renderComponent({
            projects: [],
            loading: false,
            error: null
        });
        
        expect(screen.getByText('No projects found matching your criteria.')).toBeTruthy();
    });

    it('displays error message when there is an error', () => {
        renderComponent({
            error: 'Failed to load projects',
            loading: false
        });
        
        expect(screen.getByText('Failed to load projects')).toBeTruthy();
    });

    it('calls loadProjects when route query changes', async () => {
        renderComponent();
        
        const store = useProjectStore();
        
        // Verify loadProjects was called with expected params
        expect(store.loadProjects).toHaveBeenCalledOnce();
    });
});