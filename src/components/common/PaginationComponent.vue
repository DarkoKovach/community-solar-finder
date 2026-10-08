<template>
    <div class="d-flex flex-column align-items-end">
        <nav v-if="totalPages > 1"
             class="d-flex justify-content-end mt-5">
            <ul class="pagination">
                <!-- Previous page button -->
                <li class="page-item"
                    :class="{ disabled: !previousUrl }">
                    <button class="page-link"
                            :disabled="!previousUrl"
                            aria-label="Previous"
                            @click="onPageChange(currentPage - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>

                <!-- Page numbers -->
                <li v-for="page in displayedPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === currentPage }">
                    <button class="page-link"
                            @click="onPageChange(page)">
                        {{ page }}
                    </button>
                </li>

                <!-- Next page button -->
                <li class="page-item"
                    :class="{ disabled: !nextUrl }">
                    <button class="page-link"
                            :disabled="!nextUrl"
                            aria-label="Next"
                            @click="onPageChange(currentPage + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>

        <!-- Dynamic page info - also right-aligned -->
        <div v-if="totalItems > 0"
             class="text-end text-muted mt-3">
            {{ t('pagination.showing', {
                start: displayStart,
                end: displayEnd,
                total: totalItems
            }) }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    itemsPerPage: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    nextUrl: {
        type: String,
        default: null
    },
    previousUrl: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['page-change']);

// Computed properties remain unchanged
const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage))
);

const displayStart = computed(() =>
    props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
);

const displayEnd = computed(() =>
    Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
);

const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = props.currentPage;

    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
        return [1, 2, 3, 4, 5];
    } else if (current >= total - 2) {
        return [total - 4, total - 3, total - 2, total - 1, total];
    } else {
        return [current - 2, current - 1, current, current + 1, current + 2];
    }
});

// Methods
const onPageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    emit('page-change', page);
};
</script>