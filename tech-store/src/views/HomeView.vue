<template>
  <div class="home-view">
    <div class="container">
      <!-- Фильтры -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Категория:</label>
          <div class="category-buttons">
            <button
              v-for="category in store.categories"
              :key="category"
              @click="store.setCategory(category)"
              class="category-btn"
              :class="{ active: store.selectedCategory === category }"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="results-info">
          <span class="results-count">
            Найдено товаров: <strong>{{ paginatedProducts.totalItems }}</strong>
          </span>
        </div>
      </div>

      <!-- Сетка товаров -->
      <div v-if="paginatedProducts.items.length > 0" class="products-grid">
        <ProductCard
          v-for="product in paginatedProducts.items"
          :key="product.id"
          :product="product"
          @openPreview="openProductPreview"
        />
      </div>

      <!-- Пустое состояние -->
      <div v-else class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить параметры поиска или категорию</p>
        <button @click="resetFilters" class="reset-btn">Сбросить фильтры</button>
      </div>

      <!-- Пагинация -->
      <div v-if="paginatedProducts.totalPages > 1" class="pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          class="pagination-btn"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === paginatedProducts.totalPages"
          class="pagination-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Модальное окно -->
    <ProductModal
      :isOpen="isModalOpen"
      :product="selectedProduct"
      @close="closeProductPreview"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useProductsStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';
import ProductModal from '@/components/ProductModal.vue';

const store = useProductsStore();

const currentPage = ref(1);
const itemsPerPage = 6;
const isModalOpen = ref(false);
const selectedProduct = ref(null);

const paginatedProducts = computed(() => {
  const filtered = store.filteredProducts;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages
  };
});

const visiblePages = computed(() => {
  const total = paginatedProducts.value.totalPages;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= paginatedProducts.value.totalPages) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const openProductPreview = (product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeProductPreview = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
  document.body.style.overflow = '';
};

const resetFilters = () => {
  store.clearSearch();
  store.setCategory('Все категории');
  currentPage.value = 1;
};

watch(() => [store.currentSearch, store.selectedCategory], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filters-section {
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  padding: 8px 16px;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.category-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.results-count {
  font-size: 14px;
  color: #64748b;
}

.results-count strong {
  color: #1e293b;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  stroke-width: 1.5;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.reset-btn {
  padding: 12px 24px;
  background: #667eea;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: #f1f5f9;
}

.pagination-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .category-buttons {
    flex-direction: column;
  }

  .category-btn {
    width: 100%;
    text-align: center;
  }
}
</style>