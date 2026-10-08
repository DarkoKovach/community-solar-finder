<template>
    <div class="card h-100 position-relative">
        <!-- Sign-up Bonus Badge - popped out of card -->
        <div v-if="hasSpecialOffer"
             class="position-absolute top-0 start-0 translate-middle-y ms-3">
            <span class="badge bg-light-green text-dark rounded-pill px-3 py-2 special-badge">
                {{ t('project.signUpBonus') }}
            </span>
        </div>

        <!-- Badges -->
        <div class="d-flex justify-content-end p-2">
            <span v-if="project.percent_full > 70"
                  class="badge bg-warning text-dark rounded-pill px-2 py-1">
                {{ t('project.fillingUp') }}
            </span>
        </div>

        <div class="card-body d-flex flex-column">
            <!-- Project name and location -->
            <h5 class="card-title mb-1">
                {{ project.name }}
            </h5>
            <p class="card-text mb-3">
                <i class="bi bi-geo-alt me-1"></i>
                {{ formatLocation(project.address) }}
            </p>

            <!-- Project details as rows with info icons -->
            <div class="mb-3">
                <div class="row mb-2 align-items-center">
                    <div class="col-7">
                        {{ t('project.discount') }} 
                        <i class="bi bi-info-circle text-muted small"
                           tabindex="0"
                           data-bs-toggle="popover"
                           data-bs-custom-class="info-popover-dark"
                           data-bs-placement="bottom"
                           :data-bs-content="t('project.info.discount')"
                           ref="discountPopover"></i>
                    </div>
                    <div class="col-5 text-end">
                        {{ project.estimated_savings_data?.offer_discount_percentage ?
                            project.estimated_savings_data.offer_discount_percentage + '%' : t('project.none') }}
                    </div>
                </div>

                <div class="row mb-2 align-items-center">
                    <div class="col-7">
                        {{ t('project.status') }} 
                        <i class="bi bi-info-circle text-muted small"
                           tabindex="0"
                           data-bs-toggle="popover"
                           data-bs-custom-class="info-popover-dark"
                           data-bs-placement="bottom"
                           :data-bs-content="t('project.info.status')"
                           ref="statusPopover"></i>
                    </div>
                    <div class="col-5 text-end">
                        {{ t(`project.${project.is_active ? 'statusActive' : 'statusInactive'}`) }}
                    </div>
                </div>

                <div class="row mb-2 align-items-center">
                    <div class="col-7">
                        {{ t('project.creditScore') }} 
                        <i class="bi bi-info-circle text-muted small"
                           tabindex="0"
                           data-bs-toggle="popover"
                           data-bs-custom-class="info-popover-dark"
                           data-bs-placement="bottom"
                           :data-bs-content="t('project.info.creditScore')"
                           ref="creditScorePopover"></i>
                    </div>
                    <div class="col-5 text-end">
                        {{ project.minimum_credit_score || t('project.none') }}
                    </div>
                </div>


                <!-- Cancellation info -->
                <div class="row mb-2">
                    <div class="col-12">
                        {{ project.cancellation_type === 'none' ? t('project.noCancellationFees') :
                            t('project.freeCancelDays', { days: project.cancellation_notice || 90 }) }}
                    </div>
                </div>

                <!-- Expected Go Live Date (new) -->
                <div class="row mb-2">
                    <div class="col-7">
                        {{ t('project.expectedGoLive') }}:
                    </div>
                    <div class="col-5 text-end">
                        {{ formatDate(project.expected_go_live) }}
                    </div>
                </div>
            </div>

            <!-- Subscription provider - redesigned -->
            <div class="mb-3">
                <div class="small text-muted mb-1">
                    {{ t('project.subscriptionBy') }}
                </div>
                <div class="d-flex">
                    <!-- Larger logo on left -->
                    <div class="me-3">
                        <img v-if="project.developer?.logo"
                             :src="project.developer.logo"
                             alt="Developer logo"
                             class="developer-logo" />
                    </div>

                    <!-- Developer info on right in two rows -->
                    <div class="d-flex flex-column">
                        <span class="fw-medium">{{ project.developer?.name }}</span>
                        <div class="d-flex align-items-center">
                            <div class="me-1">
                                <i v-for="i in 5"
                                   :key="i"
                                   class="bi"
                                   :class="i <= Math.round(project.average_review_score || 0) ?
                                       'bi-star-fill text-warning' : 'bi-star text-warning'"></i>
                            </div>
                            <small class="text-muted">({{ project.review_count || 0 }})</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action buttons -->
            <div class="d-flex mt-auto">
                <router-link :to="{ name: 'project-detail', params: { slug: project.slug } }"
                             class="btn btn-outline-primary me-2 flex-grow-1">
                    {{ t('project.details') }}
                </router-link>
                <button class="btn btn-primary flex-grow-1">
                    {{ t('project.getStarted') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { Popover } from 'bootstrap';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

const { t, locale } = useI18n();

// References for the popover elements
const discountPopover = ref(null);
const statusPopover = ref(null);
const creditScorePopover = ref(null);

// Array to hold popover instances for cleanup
const popovers = [];

// Initialize popovers
onMounted(() => {
    // Initialize each popover with the close button
    [discountPopover.value, statusPopover.value, creditScorePopover.value].forEach(el => {
        if (el) {
            const popoverInstance = new Popover(el, {
                trigger: 'click',
                html: true,
                sanitize: false,
                template: `
                    <div class="popover info-popover-dark" role="tooltip">
                        <div class="popover-arrow"></div>
                        <div class="d-flex justify-content-between popover-header">
                            <button type="button" class="btn-close btn-close-white btn-sm" 
                                    onclick="this.closest('.popover').popover.hide()"></button>
                        </div>
                        <div class="popover-body"></div>
                    </div>
                `
            });
            
            // Store instance for cleanup
            popovers.push(popoverInstance);
            
            // Add a custom hide method to the popover element
            el._popover = popoverInstance;
            
            // Close other popovers when one is shown
            el.addEventListener('show.bs.popover', () => {
                popovers.forEach(p => {
                    if (p._element !== el) {
                        p.hide();
                    }
                });
            });
        }
    });
    
    // Close popover when clicking outside
    document.addEventListener('click', closePopoversOnOutsideClick);
});

// Function to close popovers when clicking outside
const closePopoversOnOutsideClick = (event) => {
    const clickedOnPopover = event.target.closest('.popover') !== null;
    const clickedOnInfoIcon = event.target.classList.contains('bi-info-circle');
    
    if (!clickedOnPopover && !clickedOnInfoIcon) {
        popovers.forEach(popover => popover.hide());
    }
};

// Clean up
onBeforeUnmount(() => {
    // Dispose all popovers
    popovers.forEach(popover => {
        popover.dispose();
    });
    
    // Remove event listener
    document.removeEventListener('click', closePopoversOnOutsideClick);
});

// Computed property to check if project has special offer
const hasSpecialOffer = computed(() => {
    return props.project.superlatives &&
        props.project.superlatives.includes('special_offer');
});

// Formatting methods
const formatLocation = (address) => {
    if (!address) return t('project.unknownLocation');
    return `${address.city}, ${address.state}`;
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};
</script>

<style scoped>
/* Custom styles */
.bg-light-green {
    background-color: #e8f5e9;
}

.special-badge {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    font-weight: 500;
}

.developer-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
}

.bi-info-circle {
    cursor: pointer;
}

.bi-info-circle:hover {
    color: #0d6efd !important;
}
</style>