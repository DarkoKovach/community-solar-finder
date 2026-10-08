<template>
    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title mb-3">
                {{ t('filters.title') }}
            </h5>

            <div class="row g-3">
                <!-- Zip Code Filter -->
                <div class="col-md-6">
                    <!-- Wrap label and input group in a form-group div -->
                    <div class="form-group">
                        <label
                            for="zipCode"
                            class="form-label">
                            {{ t('filters.zipCode') }}
                        </label>
                        <div class="input-group">
                            <input
                                id="zipCode"
                                v-model="zipCode"
                                type="text"
                                class="form-control"
                                name="zipCode"
                                :placeholder="t('filters.enterZipCode')"
                                @keyup.enter="applyFilters" />
                            <button
                                v-if="zipCode"
                                class="btn btn-outline-secondary"
                                type="button"
                                aria-label="Clear zip code"
                                @click="clearZipCode">
                                <i class="bi bi-x"
                                   aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- State Filter -->
                <div class="col-md-6">
                    <div class="form-group">
                        <label
                            for="state"
                            class="form-label">
                            {{ t('filters.state') }}
                        </label>
                        <select
                            id="state"
                            v-model="selectedState"
                            class="form-select"
                            name="state"
                            @change="onStateChange">
                            <option value="">
                                {{ t('filters.selectState') }}
                            </option>
                            <option
                                v-for="state in states"
                                :key="state.value"
                                :value="state.value">
                                {{ state.text }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end mt-3">
                <button
                    class="btn btn-outline-secondary me-2"
                    type="button"
                    @click="clearAllFilters">
                    {{ t('filters.clear') }}
                </button>

                <button
                    class="btn btn-primary"
                    type="button"
                    @click="applyFilters">
                    {{ t('filters.apply') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { US_STATES } from '@/constants/selectOptions';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(['filter', 'clear']);

// Local state for filters
const zipCode = ref('');
const selectedState = ref('');
const states = US_STATES;

// Flag to prevent update loops
const isProcessingRouteChange = ref(false);

// Initialize filters from URL params
const initFromQuery = () => {
    // Only update local state if we're not in the middle of applying filters
    if (!isProcessingRouteChange.value) {
        zipCode.value = route.query.zip_code || '';
        selectedState.value = route.query.state || '';
    }
};

// Initialize on component mount
onMounted(() => {
    initFromQuery();
});

// Watch for route query changes
watch(() => route.query, () => {
    initFromQuery();
}, { deep: true });

// Methods to handle user actions
const applyFilters = () => {
    // Set flag to prevent route watcher from updating local state
    isProcessingRouteChange.value = true;

    // Update URL query params
    const query = { ...route.query };

    // Handle zip code
    if (zipCode.value) {
        query.zip_code = zipCode.value;
    } else {
        delete query.zip_code;
    }

    // Handle state
    if (selectedState.value) {
        query.state = selectedState.value;
    } else {
        delete query.state;
    }

    // Reset to page 1 when filtering
    query.page = '1';

    // Update route with replace to avoid extra history entries
    router.replace({ query }).then(() => {
        // Reset flag after route is updated
        isProcessingRouteChange.value = false;
        
        // Keep emit for backward compatibility, but parent should ignore
        emit('filter', { zipCode: zipCode.value, state: selectedState.value });
    });
};

const clearZipCode = () => {
    zipCode.value = '';
    applyFilters();
};

const onStateChange = () => {
    applyFilters();
};

const clearAllFilters = () => {
    zipCode.value = '';
    selectedState.value = '';

    // Update URL by removing filter params
    const query = { ...route.query };
    delete query.zip_code;
    delete query.state;
    query.page = '1';

    // Use replace instead of push to avoid extra history entries
    router.replace({ query }).then(() => {
        // Keep emit for backward compatibility
        emit('clear');
    });
};
</script>