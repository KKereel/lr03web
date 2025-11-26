<template>
  <div class="favorites-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Избранное
        </h1>
        <p class="page-description">
          Вы добавили {{ store.favoriteProducts.length }} {{ productWord }} в избранное
        </p>
      </div>

      <div v-if="store.favoriteProducts.length > 0" class="favorites-grid">
        <ProductCard
          v-for="product in store.favoriteProducts"
          :key="product.id"
          :product="product"
          @openPreview="openProductPreview"
        />
      </div>

      <div v-else class="empty-favorites">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <h2>Избранное пусто</h2>
        <p>Добавьте товары в избранное, чтобы не потерять их</p>
        <router-link to="/" class="browse-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>Перейти к каталогу</span>
        </router-link>
      </div>
    </div>

    <ProductModal
      :isOpen="isModalOpen"
      :product="selectedProduct"
      @close="closeProductPreview"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductsStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';
import ProductModal from '@/components/ProductModal.vue';

const store = useProductsStore();

const isModalOpen = ref(false);
const selectedProduct = ref(null);

const productWord = computed(() => {
  const count = store.favoriteProducts.length;
  if (count === 1) return 'товар';
  if (count >= 2 && count <= 4) return 'товара';
  return 'товаров';
});

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
</script>

<style scoped>
.favorites-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.title-icon {
  width: 40px;
  height: 40px;
  color: #ef4444;
  stroke-width: 2;
}

.page-description {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.empty-icon {
  width: 100px;
  height: 100px;
  color: #cbd5e1;
  stroke-width: 1.5;
  margin-bottom: 24px;
}

.empty-favorites h2 {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-favorites p {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.browse-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .page-title {
    font-size: 28px;
  }
}
</style>