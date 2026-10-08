<template>
    <div class="project-detail-container">
        <div v-if="loading"
             class="text-center my-5">
            <LoadingSpinner :message="t('project.loading')" />
        </div>

        <ErrorAlert v-else-if="error"
                    class="my-4"
                    :title="errorTitle"
                    :message="errorMessage" />

        <div v-else
             class="container py-4">
            <!-- Breadcrumbs -->
            <BreadcrumbsComponent :breadcrumbs="breadcrumbs" />
            <!-- Project header with name, location, and sign-up bonus -->
            <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 class="mb-2">
                        {{ project.name }}
                    </h1>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-geo-alt me-2"></i>
                        <span>{{ formatLocation(project.address) }}</span>
                    </div>
                </div>
                <span v-if="hasSpecialOffer"
                      class="badge signup-bonus-badge">
                    {{ t('project.signUpBonus') }}
                </span>
            </div>

            <!-- Main content area with two columns -->
            <div class="card shadow">
                <div class="card-body">
                    <div class="row mb-4">
                        <!-- Left column -->
                        <div class="col-md-5">
                            <div class="mb-4">
                                <div class="card-body">
                                    <img v-if="project.hero_image"
                                         :src="project.hero_image"
                                         class="img-fluid rounded mb-4"
                                         :alt="project.name" />

                                    <h5 class="mb-3">
                                        {{ t('project.provider') }}
                                    </h5>
                                    <div class="d-flex align-items-center mb-4">
                                        <img v-if="project.developer?.logo"
                                             :src="project.developer?.logo"
                                             class="developer-logo me-3"
                                             :alt="project.developer?.name" />
                                        <div>
                                            <div class="fw-medium fs-5 mb-1">
                                                {{ project.developer?.name }}
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <div class="me-2">
                                                    <i v-for="i in 5"
                                                       :key="i"
                                                       class="bi"
                                                       :class="i <= Math.round(project.average_review_score || 0) ?
                                                           'bi-star-fill text-warning' : 'bi-star text-warning'"></i>
                                                </div>
                                                <span class="text-muted">({{ project.review_count || 0 }})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card bonus-card mb-4">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                {{ t('project.signUpBonus') }}
                                            </h5>
                                            <p class="mb-0 mt-2">
                                                {{ t('project.giftCardWhenSignUp', { amount: 75 }) }}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Project details section moved to left column -->
                                    <h5 class="mb-3">
                                        {{ t('project.theProject') }}
                                    </h5>
                                    <div class="mb-2">
                                        <div class="row mb-2">
                                            <div class="col-7">
                                                {{ t('project.projectSize') }}
                                            </div>
                                            <div class="col-5 text-end fw-medium">
                                                1,300 kW
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-7">
                                                {{ t('project.remainingSpots') }}
                                            </div>
                                            <div class="col-5 text-end fw-medium">
                                                6
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-7">
                                                {{ t('project.status') }}
                                            </div>
                                            <div class="col-5 text-end fw-medium">
                                                {{ t('project.statusActive') }}
                                            </div>
                                        </div>
                                    </div>
                                    <p class="mb-0 mt-2">
                                        {{ t('project.energizedDescription') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Right column -->
                        <div class="col-md-7">
                            <div class="">
                                <div class="card-body">
                                    <h5 class="mb-3">
                                        {{ t('project.yourSavings') }}
                                    </h5>
                                    <div class="row mb-2">
                                        <div class="col-8">
                                            {{ t('project.annualSavings') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            ${{ calculateAnnualSavings() }}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-8">
                                            {{ t('project.annualCarbonOffset') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            10 {{ t('project.tons') }}
                                        </div>
                                    </div>
                                    <p>
                                        {{ t('project.savingsExplanation') }}
                                        <a href="#"
                                           class="text-decoration-none">{{ t('project.editYourInfo') }}</a>
                                    </p>

                                    <hr class="my-4">

                                    <h5 class="mb-3">
                                        {{ t('project.cancellationInfo') }}
                                    </h5>
                                    <div class="row mb-2">
                                        <div class="col-8">
                                            {{ t('project.cancellationFee') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            {{ project.cancellation_type === 'none' ? t('project.noCancellationFees') :
                                                t('project.hasCancellationFees') }}
                                        </div>
                                    </div>
                                    <p class="mb-4">
                                        {{ formatCancellationDetails(project) }}
                                    </p>

                                    <hr class="my-4">

                                    <h5 class="mb-3">
                                        {{ t('project.billingInfo') }}
                                    </h5>
                                    <div class="row mb-2">
                                        <div class="col-8">
                                            {{ t('project.creditScore') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            {{ project.minimum_credit_score || t('project.none') }}
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-8">
                                            {{ t('project.discountOffered') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            {{ formatDiscount(
                                                project.estimated_savings_data?.offer_discount_percentage
                                            ) }}
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-8">
                                            {{ t('project.autoPayRequired') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            {{ t('project.no') }}
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-8">
                                            {{ t('project.consolidatedBill') }}
                                        </div>
                                        <div class="col-4 text-end fw-medium">
                                            {{ t('project.no') }}
                                        </div>
                                    </div>
                                    <p>
                                        {{ t('project.billingExplanation') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Call to action button - right aligned -->
            <div class="d-flex justify-content-end mt-4">
                <button class="btn btn-primary btn-lg px-5">
                    {{ t('project.getStarted') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/projectStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import BreadcrumbsComponent from '@/components/common/BreadcrumbsComponent.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

const props = defineProps({
    slug: {
        type: String,
        default: ''
    }
});

const { t } = useI18n();

const route = useRoute();
const projectStore = useProjectStore();

const project = ref({});
const loading = ref(true);
const error = ref(null);

// Process error for ErrorAlert component
const errorTitle = computed(() => {
    if (!error.value) return '';
    
    // If error is an object with a title property, use it
    if (typeof error.value === 'object' && error.value.title) {
        return error.value.title;
    }
    
    // Default title
    return t('errors.projectDetailError');
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

// Define breadcrumbs
const breadcrumbs = computed(() => [
    { text: t('app.home'), path: '/' },
    { text: project.value.name || t('project.details'), path: '' }
]);

// Check if project has special offer
const hasSpecialOffer = computed(() => {
    return project.value.superlatives &&
        project.value.superlatives.includes('special_offer');
});

// Format location from address object
const formatLocation = (address) => {
    if (!address) return t('project.unknownLocation');
    return `${address.city}, ${address.state}`;
};

// Format discount percentage
const formatDiscount = (discount) => {
    return discount ? `${discount}%` : '10%';
};

// Calculate annual savings based on discount percentage
const calculateAnnualSavings = () => {
    return project.value.estimated_savings_data?.offer_discount_percentage ? '135' : '68';
};

// Format cancellation details - Fixed parameter name to avoid shadowing
const formatCancellationDetails = (projectData) => {
    if (projectData.cancellation_type === 'none') {
        return t('project.noCancellationFeesExplanation');
    }

    // For projects with cancellation notice
    return t('project.cancellationExplanation', {
        days: projectData.cancellation_notice || 90,
        email: projectData.developer?.unsubscribe_email || 'customercare@pureskyenergy.com',
        phone: '1-877-267-8727'
    });
};

// Load project data when component mounts
onMounted(async () => {
    try {
        const slug = route.params.slug;
        await projectStore.loadProjectDetail(slug);
        project.value = projectStore.currentProject;
    } catch (e) {
        error.value = e.message || t('project.loadError');
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Sign-up bonus badge */
.signup-bonus-badge {
    background-color: #e8f5e9;
    color: #1b5e20;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
}

/* Bonus card styling - Bold outline instead of shadow */
.bonus-card {
    border: 2px solid #4caf50;
    border-radius: 8px;
}

/* Developer logo styling */
.developer-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 4px;
}
</style>