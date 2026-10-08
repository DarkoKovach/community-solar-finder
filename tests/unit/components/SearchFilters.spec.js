import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import SearchFilters from '@/components/filters/SearchFilters.vue';

// Mock router
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
            filters: {
                title: 'Filter Projects',
                zipCode: 'ZIP Code',
                enterZipCode: 'Enter ZIP code',
                state: 'State',
                selectState: 'Select state',
                clear: 'Clear',
                apply: 'Apply Filters'
            }
        }
    }
});

// Mock route
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useRoute: () => ({
            query: {}
        })
    };
});

describe('SearchFilters.vue', () => {
    const renderComponent = () => {
        return render(SearchFilters, {
            global: {
                plugins: [router, i18n],
                mocks: {
                    // Add any global mocks if needed
                }
            }
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        router.replace({ query: {} });
    });

    it('renders filter form correctly', () => {
        renderComponent();
        
        // Check that all form elements are rendered - removed Project Name which doesn't exist
        expect(screen.getByLabelText(/ZIP Code/i)).toBeTruthy();
        expect(screen.getByLabelText(/State/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /Apply Filters/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /Clear/i })).toBeTruthy();
    });

    it('updates URL when applying filters', async () => {
        // Mock the router.replace method
        const routerReplaceSpy = vi.spyOn(router, 'replace');
        
        renderComponent();
        
        // Input values - removed Project Name field, focusing on ZIP Code only
        await fireEvent.update(screen.getByLabelText(/ZIP Code/i), '12345');
        
        // Click apply button
        await fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));
        
        // Check if router was called with correct query params
        expect(routerReplaceSpy).toHaveBeenCalledWith({
            query: {
                zip_code: '12345',
                page: '1'
            }
        });
    });

    it('clears all filters when clear button is clicked', async () => {
        // Set initial route with filters
        router.replace({ 
            query: { 
                zip_code: '12345', 
                state: 'CA',
                page: '2'
            }
        });
        
        const routerReplaceSpy = vi.spyOn(router, 'replace');
        renderComponent();
        
        // Click clear button
        await fireEvent.click(screen.getByRole('button', { name: /Clear/i }));
        
        // Check if router was called with cleared params
        expect(routerReplaceSpy).toHaveBeenCalledWith({
            query: { page: '1' }
        });
    });
});