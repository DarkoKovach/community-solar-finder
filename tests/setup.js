import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/vue';

// Global teardown after each test
afterEach(() => {
    cleanup();
});