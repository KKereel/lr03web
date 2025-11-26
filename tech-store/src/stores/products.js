import { defineStore } from 'pinia';
import { products as productsData } from '@/data/products';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: productsData,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    currentSearch: '',
    selectedCategory: 'Все категории'
  }),

  getters: {
    // Получить все категории
    categories: (state) => {
      const cats = ['Все категории', ...new Set(state.products.map(p => p.category))];
      return cats;
    },

    // Фильтрованные товары
    filteredProducts: (state) => {
      let filtered = state.products;

      // Фильтр по категории
      if (state.selectedCategory !== 'Все категории') {
        filtered = filtered.filter(p => p.category === state.selectedCategory);
      }

      // Фильтр по поиску
      if (state.currentSearch.trim()) {
        const search = state.currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
        );
      }

      return filtered;
    },

    // Товары в избранном
    favoriteProducts: (state) => {
      return state.products.filter(p => state.favorites.includes(p.id));
    },

    // Проверка, есть ли товар в избранном
    isFavorite: (state) => {
      return (productId) => state.favorites.includes(productId);
    }
  },

  actions: {
    // Поиск товаров
    searchProducts(query) {
      this.currentSearch = query;
      
      // Добавляем в историю поиска
      if (query.trim() && !this.searchHistory.includes(query)) {
        this.searchHistory.unshift(query);
        // Оставляем только 5 последних
        if (this.searchHistory.length > 5) {
          this.searchHistory = this.searchHistory.slice(0, 5);
        }
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
      }
    },

    // Очистить поиск
    clearSearch() {
      this.currentSearch = '';
    },

    // Установить категорию
    setCategory(category) {
      this.selectedCategory = category;
    },

    // Добавить в избранное
    addToFavorites(productId) {
      if (!this.favorites.includes(productId)) {
        this.favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      }
    },

    // Удалить из избранного
    removeFromFavorites(productId) {
      this.favorites = this.favorites.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    // Переключить избранное
    toggleFavorite(productId) {
      if (this.isFavorite(productId)) {
        this.removeFromFavorites(productId);
      } else {
        this.addToFavorites(productId);
      }
    },

    // Очистить историю поиска
    clearSearchHistory() {
      this.searchHistory = [];
      localStorage.removeItem('searchHistory');
    }
  }
});