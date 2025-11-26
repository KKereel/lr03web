<template>
  <div class="product-card">
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.name" class="product-image" />
      
      <button
        @click.stop="toggleFavorite"
        class="favorite-btn"
        :class="{ active: isFavorite }"
        :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
      >
        <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <button @click="openPreview" class="quick-view-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>Быстрый просмотр</span>
      </button>
    </div>

    <div class="product-info">
      <span class="product-category">{{ product.category }}</span>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ truncatedDescription }}</p>
      
      <div class="product-specs">
        <span v-for="spec in product.specs" :key="spec" class="spec-tag">
          {{ spec }}
        </span>
      </div>

      <div class="product-footer">
        <span class="product-price">{{ formattedPrice }} ₽</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProductsStore } from '@/stores/products';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['openPreview']);

const store = useProductsStore();

const isFavorite = computed(() => store.isFavorite(props.product.id));

const formattedPrice = computed(() => {
  return props.product.price.toLocaleString('ru-RU');
});

const truncatedDescription = computed(() => {
  const maxLength = 80;
  if (props.product.description.length <= maxLength) {
    return props.product.description;
  }
  return props.product.description.substring(0, maxLength) + '...';
});

const toggleFavorite = () => {
  store.toggleFavorite(props.product.id);
};

const openPreview = () => {
  emit('openPreview', props.product);
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f8fafc;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.favorite-btn:hover {
  transform: scale(1.1);
  color: #ef4444;
}

.favorite-btn.active {
  color: #ef4444;
  background: #fee2e2;
}

.favorite-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.quick-view-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.product-card:hover .quick-view-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-view-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.product-category {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.product-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.product-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.spec-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-weight: 500;
}

.product-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}
</style>