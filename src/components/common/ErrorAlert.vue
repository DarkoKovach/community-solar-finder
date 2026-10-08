<template>
    <div class="alert alert-danger d-flex align-items-center"
         role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
            <strong v-if="title">{{ title }}:</strong>
            {{ message }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    }
});
</script>