<template>
    <div class="dropdown position-relative"
         ref="dropdownContainer">
        <button 
            class="btn btn-sm btn-outline-secondary dropdown-toggle"
            type="button"
            ref="dropdownButton"
            @click="toggleDropdown">
            {{ currentLanguageDisplay }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" 
            :class="{'show': isOpen}" 
            ref="dropdownMenu"
            :style="dropdownMenuStyle">
            <li v-for="(lang, code) in availableLanguages"
                :key="code">
                <button 
                    class="dropdown-item" 
                    :class="{ 'active': currentLocale === code }"
                    @click="changeLanguage(code)">
                    {{ lang }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const dropdownContainer = ref(null);
const dropdownButton = ref(null);
const dropdownMenu = ref(null);
const isOpen = ref(false);
const dropdownMenuStyle = reactive({
  right: 'auto',
  left: 'auto'
});

const availableLanguages = {
  en: 'English',
  es: 'Español'
};

const currentLocale = computed(() => locale.value);
const currentLanguageDisplay = computed(() => availableLanguages[locale.value]);

const adjustDropdownPosition = () => {
  if (!dropdownMenu.value || !dropdownButton.value) return;
  
  // Reset position
  dropdownMenuStyle.right = 'auto';
  dropdownMenuStyle.left = 'auto';
  
  // Get button position
  const buttonRect = dropdownButton.value.getBoundingClientRect();
  const menuWidth = dropdownMenu.value.offsetWidth;
  
  // Check if dropdown would go off screen to the right
  if (buttonRect.right - menuWidth < 0) {
    // Align to left edge of button
    dropdownMenuStyle.left = '0';
  } else if (buttonRect.left + menuWidth > window.innerWidth) {
    // Align to right edge of button
    dropdownMenuStyle.right = '0';
  } else {
    // Default Bootstrap dropdown-menu-end behavior
    dropdownMenuStyle.right = '0';
  }
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // We need to wait for the dropdown to be visible before measuring
    setTimeout(adjustDropdownPosition, 0);
  }
};

const changeLanguage = (langCode) => {
  locale.value = langCode;
  localStorage.setItem('preferredLanguage', langCode);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleOutsideClick = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Adjust position when window is resized
const handleResize = () => {
  if (isOpen.value) {
    adjustDropdownPosition();
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('resize', handleResize);
});

// Watch for dropdown state changes
watch(isOpen, (newValue) => {
  if (newValue) {
    setTimeout(adjustDropdownPosition, 0);
  }
});
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu.show {
  display: block;
}
</style>