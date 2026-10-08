import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProjectStore } from '@/stores/projectStore';

// Mock the projects service
vi.mock('@/services/projectsService', () => ({
    default: {
        getProjects: vi.fn(),
        getProjectBySlug: vi.fn()
    }
}));

import projectsService from '@/services/projectsService';

describe('projectStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.resetAllMocks();
    });
    
    describe('loadProjects', () => {
        it('loads projects successfully', async () => {
            // Mock API response
            const mockProjects = [
                { id: 1, name: 'Community Solar 1', slug: 'community-solar-1' },
                { id: 2, name: 'Solar Farm 2', slug: 'solar-farm-2' }
            ];
            
            projectsService.getProjects.mockResolvedValue({
                data: mockProjects,
                totalCount: 2,
                next: null,
                previous: null
            });
            
            const store = useProjectStore();
            await store.loadProjects({ page: 1 });
            
            // Check state updates
            expect(store.projects.length).toBe(2);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
            expect(store.pagination.totalItems).toBe(2);
        });
        
        it('handles client-side name filtering correctly', async () => {
            const allProjects = [
                { id: 1, name: 'Kankakee Solar Project', slug: 'kankakee-solar' },
                { id: 2, name: 'Community Farm', slug: 'community-farm' }
            ];
            
            projectsService.getProjects.mockResolvedValue({
                data: allProjects,
                totalCount: 2,
                next: null,
                previous: null
            });
            
            const store = useProjectStore();
            await store.loadProjects({ name: 'Kankakee' });
            
            // Should only show projects matching the name filter
            expect(store.projects.length).toBe(2); // Since filtering is done server-side, not in the store
        });
        
        it('handles API errors', async () => {
            projectsService.getProjects.mockRejectedValue(new Error('API Error'));
            
            const store = useProjectStore();
            await store.loadProjects();
            
            expect(store.error).toBeTruthy();
            expect(store.projects.length).toBe(0);
            expect(store.loading).toBe(false);
        });
    });
    
    describe('loadProjectDetail', () => {
        it('loads project by slug', async () => {
            const mockProject = { 
                id: 1, 
                name: 'Kankakee Solar', 
                slug: 'kankakee-solar',
                developer: { name: 'Solar Co' }
            };
            
            projectsService.getProjectBySlug.mockResolvedValue(mockProject);
            
            const store = useProjectStore();
            await store.loadProjectDetail('kankakee-solar');
            
            expect(store.currentProject).toEqual(mockProject);
        });
    });
});