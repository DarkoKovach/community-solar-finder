<template>
    <div class="text-center my-5">
        <div class="spinner-border text-primary"
             role="status">
            <span class="visually-hidden">{{ displayMessage }}</span>
        </div>
        <p class="mt-2">
            {{ displayMessage }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Define props without referencing local t function
const props = defineProps({
    message: {
        type: String,
        default: null
    }
});

// Use computed property to handle the default with t function
const displayMessage = computed(() =>
    props.message || t('projects.loading')
);
</script>