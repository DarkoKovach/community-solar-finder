import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import ProjectCard from '@/components/projects/ProjectCard.vue';

// Mock router
const router = createRouter({
    history: createWebHistory(),
    routes: [
         { 
            path: '/', 
            name: 'home',
            component: { template: '<div>Home Page</div>' } 
        },
        { 
            path: '/projects/:slug', 
            name: 'project-detail',
            component: { template: '<div></div>' } 
        }
    ]
});

// Create i18n with all the required translations
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
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
                getStarted: 'Get Started'
            }
        }
    }
});

describe('ProjectCard.vue', () => {
    const mockProject = {
        id: 1,
        name: 'Solar Project Test',
        slug: 'solar-project-test',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345',
        developer: { name: 'Test Developer' },
        capacity: 500,
        estimatedSavings: '10%',
        image: 'https://example.com/image.jpg'
    };

    it('renders project information correctly', () => {
        render(ProjectCard, {
            props: {
                project: mockProject
            },
            global: {
                plugins: [router, i18n]
            }
        });
        
        // Check that project name and developer are displayed
        expect(screen.getByText('Solar Project Test')).toBeTruthy();
        expect(screen.getByText('Test Developer')).toBeTruthy();
    });

    it('links to the correct project detail page', () => {
        const { container } = render(ProjectCard, {
            props: {
                project: mockProject
            },
            global: {
                plugins: [router, i18n]
            }
        });
        
        // Check for an anchor tag with href instead of router-link with to
        const detailsLink = container.querySelector('a[href="/projects/solar-project-test"]');
        expect(detailsLink).toBeTruthy();
    });
});