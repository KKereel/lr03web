<template>
  <div class="search-wrapper">
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      
      <input
        v-model="searchQuery"
        @input="handleInput"
        @focus="showHistory = true"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Поиск товаров..."
        class="search-input"
      />
      
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-btn"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- История поиска -->
    <div v-if="showHistory && store.searchHistory.length > 0" class="search-history">
      <div class="history-header">
        <span>Недавние поиски</span>
        <button @click="store.clearSearchHistory" class="clear-history-btn">
          Очистить
        </button>
      </div>
      <div
        v-for="item in store.searchHistory"
        :key="item"
        @click="selectFromHistory(item)"
        class="history-item"
      >
        <svg class="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useProductsStore } from '@/stores/products';

const store = useProductsStore();
const searchQuery = ref(store.currentSearch);
const showHistory = ref(false);

const handleInput = () => {
  store.searchProducts(searchQuery.value);
};

const handleSearch = () => {
  store.searchProducts(searchQuery.value);
  showHistory.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
  store.clearSearch();
  showHistory.value = false;
};

const selectFromHistory = (item) => {
  searchQuery.value = item;
  store.searchProducts(item);
  showHistory.value = false;
};

// Закрытие истории при клике вне компонента
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-wrapper')) {
    showHistory.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(() => store.currentSearch, (newVal) => {
  searchQuery.value = newVal;
});
</script>

<style scoped>
.search-wrapper {
  flex: 1;
  position: relative;
  max-width: 500px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  stroke-width: 2;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #64748b;
}

.clear-btn svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.search-history {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.clear-history-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.clear-history-btn:hover {
  background: #e2e8f0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.history-item:hover {
  background: #f8fafc;
}

.history-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
  stroke-width: 2;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .search-wrapper {
    order: 3;
    width: 100%;
    max-width: none;
  }
}
</style>