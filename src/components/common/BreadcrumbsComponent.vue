<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li v-for="(crumb, index) in breadcrumbs" 
                :key="index" 
                class="breadcrumb-item" 
                :class="{ 'active': index === breadcrumbs.length - 1 }">
                <router-link v-if="index < breadcrumbs.length - 1"
                             :to="crumb.path">
                    {{ crumb.text }}
                </router-link>
                <span v-else>{{ crumb.text }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
    // Each item should have { text: 'Label', path: '/path' }
  }
});
</script>

<style scoped>
.breadcrumb {
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  background-color: transparent;
}
</style>