import { describe, it, expect, vi, beforeEach } from 'vitest';
import projectsService from '@/services/projectsService';
import apiClient from '@/services/apiClient';

// Mock apiClient correctly
vi.mock('@/services/apiClient', () => ({
    default: {
        get: vi.fn()
    }
}));

describe('projectsService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    
    describe('getProjects', () => {
        it('calls correct API endpoint with proper params', async () => {
            // Mock API response
            const mockResponse = {
                results: [
                    { id: 1, name: 'Project 1' },
                    { id: 2, name: 'Project 2' }
                ],
                count: 2,
                next: null,
                previous: null
            };
            
            apiClient.get.mockResolvedValue(mockResponse);
            
            // Call with options
            const options = {
                page: 2,
                limit: 10,
                zip_code: '12345',
                state: 'CA'
            };
            
            await projectsService.getProjects(options);
            
            // Updated expectations to match actual implementation
            expect(apiClient.get).toHaveBeenCalledWith('projects/search', {
                params: {
                    page: 2,
                    limit: 10,
                    offset: 10, // (page-1) * limit
                    zip_code: '12345',
                    state: 'CA'
                }
            });
        });
        
        it('transforms API response to expected format', async () => {
            const mockResponse = {
                results: [{ id: 1, name: 'Project 1' }],
                count: 1,
                next: '/api/projects?page=2',
                previous: null
            };
            
            apiClient.get.mockResolvedValue(mockResponse);
            
            const result = await projectsService.getProjects();
            
            expect(result).toEqual({
                data: [{ id: 1, name: 'Project 1' }],
                totalCount: 1,
                next: '/api/projects?page=2',
                previous: null
            });
        });
    });
    
    describe('getProjectBySlug', () => {
        it('calls correct API endpoint with slug', async () => {
            const mockProject = { id: 1, name: 'Project 1', slug: 'project-1' };
            apiClient.get.mockResolvedValue(mockProject);
            
            const result = await projectsService.getProjectBySlug('project-1');
            
            expect(apiClient.get).toHaveBeenCalledWith('projects/project-1');
            expect(result).toEqual(mockProject);
        });
    });
});