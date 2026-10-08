<template>
    <div>
        <!-- Breadcrumbs -->
        <BreadcrumbsComponent :breadcrumbs="breadcrumbs" />

        <!-- Title -->
        <h1 class="mb-4">
            {{ t('projects.title') }}
        </h1>
        <p class="lead mb-4">
            {{ t('projects.subtitle') }}
        </p>

        <!-- Pass the events but don't take action on them -->
        <SearchFilters @filter="() => {}"
                       @clear="() => {}" />

        <div v-if="loading"
             class="text-center my-5">
            <LoadingSpinner :message="t('projects.loading')" />
        </div>

        <ErrorAlert v-else-if="error"
                    class="my-4"
                    :title="errorTitle"
                    :message="errorMessage" />

        <div v-else-if="hasProjects">
            <div class="row gy-4 my-4">
                <div v-for="project in projects"
                     :key="project.id"
                     class="col-12 col-md-6 col-lg-4">
                    <ProjectCard :project="project" />
                </div>
            </div>

            <!-- Pagination -->
            <PaginationComponent :current-page="pagination.currentPage"
                                 :items-per-page="pagination.itemsPerPage"
                                 :total-items="pagination.totalItems"
                                 :next-url="pagination.nextPageUrl"
                                 :previous-url="pagination.previousPageUrl"
                                 @page-change="onPageChange" />
        </div>

        <div v-else
             class="alert alert-info my-4">
            {{ t('projects.noResults') }}
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import SearchFilters from '@/components/filters/SearchFilters.vue';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import BreadcrumbsComponent from '@/components/common/BreadcrumbsComponent.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

// Setup i18n
const { t } = useI18n();

// Setup router and route
const route = useRoute();
const router = useRouter();

// Breadcrumbs configuration
const breadcrumbs = ref([
    { text: t('app.home'), path: '/' }
]);

// Setup project store
const projectStore = useProjectStore();
const {
    projects,
    loading,
    error,
    pagination
} = storeToRefs(projectStore);

const { loadProjects } = projectStore;

// Computed properties
const hasProjects = computed(() => projects.value && projects.value.length > 0);

// Process error for ErrorAlert component
const errorTitle = computed(() => {
    if (!error.value) return '';
    
    // If error is an object with a title property, use it
    if (typeof error.value === 'object' && error.value.title) {
        return error.value.title;
    }
    
    // Default title
    return t('errors.projectsLoadError');
});

const errorMessage = computed(() => {
    if (!error.value) return '';
    
    // If error is an object with a message property, use it
    if (typeof error.value === 'object' && error.value.message) {
        return error.value.message;
    }
    
    // If error is a simple string
    return typeof error.value === 'string' ? error.value : t('errors.unknownError');
});

// Handle pagination UI updates but use route for actual data loading
const onPageChange = (page) => {
    // Update URL with new page number
    router.replace({
        query: {
            ...route.query,
            page
        }
    });
};

watch(
    () => route.query,
    (newQuery) => {
        // Convert query params to load parameters
        const params = {
            page: parseInt(newQuery.page) || 1,
            zip_code: newQuery.zip_code,
            state: newQuery.state,
        };

        // Single call to load data with all parameters
        loadProjects(params);
    },
    { immediate: true, deep: true }
);

</script>