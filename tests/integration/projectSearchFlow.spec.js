import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { render, fireEvent, screen } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { createPinia, setActivePinia } from 'pinia';
import ProjectList from '@/views/projects/ProjectList.vue';
import { useProjectStore } from '@/stores/projectStore';

// Mock the project service
vi.mock('@/services/projectsService', () => ({
    default: {
        getProjects: vi.fn(),
        getProjectBySlug: vi.fn()
    }
}));

import projectsService from '@/services/projectsService';

// Create actual router & i18n instances with all required translations
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ProjectList },
        { path: '/projects/:slug', name: 'project-detail', component: { template: '<div>Project Detail</div>' } }
    ]
});

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
            filters: {
                title: 'Filter Projects',
                zipCode: 'ZIP Code',
                enterZipCode: 'Enter ZIP code',
                state: 'State',
                selectState: 'Select state',
                clear: 'Clear',
                apply: 'Apply Filters'
            },
            project: {
                unknownLocation: 'Unknown Location',
                annualSavings: 'Annual Savings',
                status: 'Status',
                statusActive: 'Active',
                creditScore: 'Credit Score',
                none: 'None',
                freeCancelDays: 'Free cancellation within 14 days',
                expectedGoLive: 'Expected Go-Live Date',
                subscriptionBy: 'Subscription By',
                details: 'View Details',
                getStarted: 'Get Started',
                signUpBonus: 'Sign-up Bonus',
                fillingUp: 'Filling Up'
            },
            pagination: {
                showing: 'Showing {start}-{end} of {total} projects'
            }
        }
    }
});

describe('Project Search Flow', () => {
    beforeEach(() => {
        // Create fresh Pinia for each test
        const pinia = createPinia();
        setActivePinia(pinia);
        vi.clearAllMocks();
    });
    
    it('filters projects and updates URL when searching by zip code', async () => {
        // Mock API responses
        const mockProjects = [
            { id: 1, name: 'Kankakee Solar Project', slug: 'kankakee-solar' },
            { id: 2, name: 'Community Farm', slug: 'community-farm' },
            { id: 3, name: 'Other Solar Project', slug: 'other-solar' }
        ];
        
        projectsService.getProjects.mockImplementation(async (options) => {
            // Return filtered results if zip_code is provided
            if (options && options.zip_code === '12345') {
                return {
                    data: [mockProjects[0]],
                    totalCount: 1,
                    next: null,
                    previous: null
                };
            }
            
            return {
                data: mockProjects,
                totalCount: mockProjects.length,
                next: null,
                previous: null
            };
        });
        
        // Render the component tree
        render(ProjectList, {
            global: {
                plugins: [router, i18n, setActivePinia(createPinia())]
            }
        });
        
        // Wait for initial data load
        await flushPromises();
        
        // Reset the mock to focus only on the calls after initialization
        projectsService.getProjects.mockClear();
        
        // Fill in the ZIP code filter
        const zipCodeInput = screen.getByLabelText(/ZIP Code/i);
        await fireEvent.update(zipCodeInput, '12345');
        
        // Click apply filters button
        const applyButton = screen.getByRole('button', { name: /Apply Filters/i });
        await fireEvent.click(applyButton);
        
        // Wait for data to update
        await flushPromises();
        
        // Check if URL was updated
        expect(router.currentRoute.value.query.zip_code).toBe('12345');
        
        // Check if the store loading was triggered
        const store = useProjectStore();
        
        // Now we should only expect 1 call since we cleared the mock after initialization
        expect(projectsService.getProjects).toHaveBeenCalledTimes(1);
        expect(projectsService.getProjects).toHaveBeenLastCalledWith(
            expect.objectContaining({ zip_code: '12345' })
        );
    });
});