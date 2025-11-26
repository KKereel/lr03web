<!-- src/components/SearchBar.vue -->
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
        @focus="showDropdown = true"
        @keyup.enter="handleEnter"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
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

    <!-- Выпадающий список -->
    <div v-if="showDropdown && (suggestions.length > 0 || store.searchHistory.length > 0)" class="search-dropdown">
      
      <!-- Подсказки -->
      <div v-if="suggestions.length > 0" class="dropdown-section">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>Подсказки</span>
        </div>
        <div
          v-for="(suggestion, index) in suggestions"
          :key="'suggestion-' + suggestion.id"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
          class="dropdown-item"
          :class="{ active: selectedIndex === index }"
        >
          <div class="suggestion-content">
            <span class="suggestion-name" v-html="highlightMatch(suggestion.name)"></span>
            <span class="suggestion-category">{{ suggestion.category }}</span>
          </div>
          <span class="suggestion-price">{{ formatPrice(suggestion.price) }} ₽</span>
        </div>
      </div>

      <!-- История поиска -->
      <div v-if="store.searchHistory.length > 0 && !searchQuery.trim()" class="dropdown-section">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Недавние поиски</span>
          <button @click.stop="store.clearSearchHistory" class="clear-history-btn">
            Очистить
          </button>
        </div>
        <div
          v-for="(item, index) in store.searchHistory"
          :key="'history-' + item"
          @click="selectFromHistory(item)"
          @mouseenter="selectedIndex = suggestions.length + index"
          class="dropdown-item"
          :class="{ active: selectedIndex === suggestions.length + index }"
        >
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useProductsStore } from '@/stores/products';

const store = useProductsStore();
const searchQuery = ref(store.currentSearch);
const showDropdown = ref(false);
const selectedIndex = ref(0);

// Подсказки с приоритетом по началу слова
const suggestions = computed(() => {
  if (!searchQuery.value.trim()) {
    return [];
  }
  
  const search = searchQuery.value.toLowerCase();
  
  // Разделяем на группы приоритета
  const startsWithName = [];
  const startsWithCategory = [];
  const containsInName = [];
  const containsInDescription = [];
  
  store.products.forEach(product => {
    const nameLower = product.name.toLowerCase();
    const categoryLower = product.category.toLowerCase();
    const descriptionLower = product.description.toLowerCase();
    
    // Приоритет 1: Название начинается с поиска
    if (nameLower.startsWith(search)) {
      startsWithName.push(product);
    }
    // Приоритет 2: Категория начинается с поиска
    else if (categoryLower.startsWith(search)) {
      startsWithCategory.push(product);
    }
    // Приоритет 3: Поиск содержится в названии
    else if (nameLower.includes(search)) {
      containsInName.push(product);
    }
    // Приоритет 4: Поиск содержится в описании
    else if (descriptionLower.includes(search)) {
      containsInDescription.push(product);
    }
  });
  
  // Объединяем по приоритету и берем первые 5
  return [
    ...startsWithName,
    ...startsWithCategory,
    ...containsInName,
    ...containsInDescription
  ].slice(0, 5);
});

// Подсветка совпадения
const highlightMatch = (text) => {
  if (!searchQuery.value.trim()) return text;
  
  const search = searchQuery.value;
  const regex = new RegExp(`(${search})`, 'gi');
  
  return text.replace(regex, '<strong>$1</strong>');
};

// Форматирование цены
const formatPrice = (price) => {
  return price.toLocaleString('ru-RU');
};

// Просто вводим текст - НЕ сохраняем в историю
const handleInput = () => {
  store.searchProducts(searchQuery.value);
  showDropdown.value = true;
  selectedIndex.value = 0;
};

// Enter - сохраняем в историю
const handleEnter = () => {
  if (suggestions.value.length > 0 && selectedIndex.value < suggestions.value.length) {
    // Выбран товар из подсказок
    selectSuggestion(suggestions.value[selectedIndex.value]);
  } else if (searchQuery.value.trim()) {
    // Обычный поиск
    store.confirmSearch(searchQuery.value);
    showDropdown.value = false;
  }
};

// Навигация стрелками
const navigateDown = () => {
  const maxIndex = suggestions.value.length + store.searchHistory.length - 1;
  if (selectedIndex.value < maxIndex) {
    selectedIndex.value++;
  }
};

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

// Выбор подсказки
const selectSuggestion = (product) => {
  searchQuery.value = product.name;
  store.searchProducts(product.name);
  store.confirmSearch(product.name);
  showDropdown.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
  store.clearSearch();
  showDropdown.value = false;
};

// Клик по истории
const selectFromHistory = (item) => {
  searchQuery.value = item;
  store.searchProducts(item);
  showDropdown.value = false;
};

// Закрытие при клике вне компонента
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-wrapper')) {
    showDropdown.value = false;
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

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-section {
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.section-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  flex-shrink: 0;
}

.clear-history-btn {
  margin-left: auto;
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

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dropdown-item:hover,
.dropdown-item.active {
  background: #f8fafc;
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.suggestion-name {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.suggestion-name :deep(strong) {
  color: #667eea;
  font-weight: 700;
}

.suggestion-category {
  font-size: 12px;
  color: #94a3b8;
}

.suggestion-price {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  margin-left: 12px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .search-wrapper {
    order: 3;
    width: 100%;
    max-width: none;
  }
}
</style>
