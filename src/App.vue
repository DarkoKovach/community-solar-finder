<template>
    <div class="app-container">
        <!-- Enhanced Header -->
        <header class="mb-4 border-bottom">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <router-link class="navbar-brand"
                                 to="/">
                        <span class="text-primary">{{ t('app.title') }}</span>
                    </router-link>
          
                    <LanguageSelector />
          
                </div>
            </nav>
        </header>
    
        <!-- Main Content -->
        <main class="container py-3">
            <router-view />
        </main>
    
        <!-- Footer if needed -->
        <footer class="py-3 bg-light mt-5 border-top">
            <div class="container">
                <p class="text-center text-muted mb-0">
                    {{ t('app.footer') }}
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import LanguageSelector from '@/components/i18n/LanguageSelector.vue';

const { t } = useI18n();
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

.navbar-brand:hover {
  text-decoration: none;
}
</style>