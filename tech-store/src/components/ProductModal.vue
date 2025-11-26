<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button @click="closeModal" class="close-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-body">
          <div class="modal-image-section">
            <img :src="product.image" :alt="product.name" class="modal-image" />
          </div>

          <div class="modal-info-section">
            <span class="modal-category">{{ product.category }}</span>
            <h2 class="modal-title">{{ product.name }}</h2>
            <p class="modal-description">{{ product.description }}</p>

            <div class="modal-specs">
              <h3 class="specs-title">Характеристики:</h3>
              <div class="specs-list">
                <span v-for="spec in product.specs" :key="spec" class="spec-item">
                  {{ spec }}
                </span>
              </div>
            </div>

            <div class="modal-footer">
              <div class="price-section">
                <span class="price-label">Цена</span>
                <span class="modal-price">{{ formattedPrice }} ₽</span>
              </div>

              <button @click="toggleFavorite" class="favorite-action-btn" :class="{ active: isFavorite }">
                <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useProductsStore } from '@/stores/products';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const store = useProductsStore();

const isFavorite = computed(() => store.isFavorite(props.product.id));

const formattedPrice = computed(() => {
  return props.product.price.toLocaleString('ru-RU');
});

const closeModal = () => {
  emit('close');
};

const toggleFavorite = () => {
  store.toggleFavorite(props.product.id);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modal-image-section {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 16px;
  padding: 40px;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}

.modal-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-category {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.modal-description {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.modal-specs {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.specs-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.specs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spec-item {
  font-size: 13px;
  padding: 6px 14px;
  background: white;
  color: #475569;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.modal-price {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
}

.favorite-action-btn {
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

.favorite-action-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.favorite-action-btn.active {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.favorite-action-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-price {
    font-size: 28px;
  }

  .modal-image-section {
    padding: 20px;
  }
}
</style>