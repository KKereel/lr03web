
<template>
  <div class="product-view">
    <div v-if="product" class="container">
      <!-- Хлебные крошки -->
      <div class="breadcrumbs">
        <router-link to="/">Главная</router-link>
        <span class="separator">/</span>
        <span class="current">{{ product.name }}</span>
      </div>

      <!-- Основной контент -->
      <div class="product-content">
        <!-- Галерея -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <button
            @click="toggleFavorite"
            class="favorite-btn-large"
            :class="{ active: isFavorite }"
          >
            <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
          </button>
        </div>

        <!-- Информация -->
        <div class="product-details">
          <span class="product-category-badge">{{ product.category }}</span>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="price-block">
            <span class="product-price">{{ formattedPrice }} ₽</span>
            <span class="price-label">Цена указана с учетом всех скидок</span>
          </div>

          <!-- Характеристики -->
          <div class="specs-block">
            <h3 class="block-title">Основные характеристики</h3>
            <div class="specs-grid">
              <div v-for="spec in product.specs" :key="spec" class="spec-item">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ spec }}</span>
              </div>
            </div>
          </div>

          <!-- Описание -->
          <div class="description-block">
            <h3 class="block-title">Описание</h3>
            <p class="product-description">{{ product.description }}</p>
          </div>

          <!-- Действия -->
          <div class="actions-block">
            <button class="btn-back" @click="$router.back()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Назад к каталогу</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Похожие товары -->
      <div v-if="similarProducts.length > 0" class="similar-section">
        <h2 class="section-title">Похожие товары</h2>
        <div class="similar-grid">
          <ProductCard
            v-for="similar in similarProducts"
            :key="similar.id"
            :product="similar"
            @openPreview="openPreview"
          />
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="not-found">
      <svg class="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2>Товар не найден</h2>
      <p>К сожалению, запрашиваемый товар не существует</p>
      <router-link to="/" class="btn-home">Вернуться на главную</router-link>
    </div>

    <!-- Модалка для похожих -->
    <ProductModal
      :isOpen="isModalOpen"
      :product="selectedProduct"
      @close="closePreview"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';
import ProductModal from '@/components/ProductModal.vue';

const route = useRoute();
const router = useRouter();
const store = useProductsStore();

const isModalOpen = ref(false);
const selectedProduct = ref(null);

const product = computed(() => {
  const id = parseInt(route.params.id);
  return store.products.find(p => p.id === id);
});

const isFavorite = computed(() => {
  return product.value ? store.isFavorite(product.value.id) : false;
});

const formattedPrice = computed(() => {
  return product.value ? product.value.price.toLocaleString('ru-RU') : '';
});

const similarProducts = computed(() => {
  if (!product.value) return [];
  
  return store.products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 3);
});

const toggleFavorite = () => {
  if (product.value) {
    store.toggleFavorite(product.value.id);
  }
};

const openPreview = (prod) => {
  selectedProduct.value = prod;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closePreview = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
  document.body.style.overflow = '';
};

// Обновление title
watch(product, (newProduct) => {
  if (newProduct) {
    document.title = `${newProduct.name} | TechStore`;
  } else {
    document.title = 'Товар не найден | TechStore';
  }
}, { immediate: true });

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
.product-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumbs a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumbs a:hover {
  color: #5568d3;
}

.separator {
  color: #cbd5e1;
}

.current {
  color: #1e293b;
  font-weight: 500;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

.product-gallery {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn-large:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.favorite-btn-large.active {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.favorite-btn-large svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-category-badge {
  display: inline-block;
  width: fit-content;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-title {
  font-size: 40px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.product-price {
  font-size: 48px;
  font-weight: 700;
}

.price-label {
  font-size: 14px;
  opacity: 0.9;
}

.block-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.specs-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: #667eea;
  stroke-width: 3;
  flex-shrink: 0;
}

.description-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-description {
  font-size: 16px;
  line-height: 1.8;
  color: #64748b;
  margin: 0;
}

.actions-block {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f1f5f9;
}

.btn-back svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.similar-section {
  padding-top: 60px;
  border-top: 2px solid #e2e8f0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 32px 0;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  stroke-width: 1.5;
  margin-bottom: 24px;
}

.not-found h2 {
  font-size: 32px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.not-found p {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
}

.btn-home {
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

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

@media (max-width: 968px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .product-gallery {
    position: relative;
    top: 0;
  }

  .product-title {
    font-size: 28px;
  }

  .product-price {
    font-size: 36px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .similar-grid {
    grid-template-columns: 1fr;
  }
}
</style>