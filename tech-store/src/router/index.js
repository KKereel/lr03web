import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import ProductView from '../views/ProductView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Каталог товаров'
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: {
        title: 'Избранное'
      }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductView,
      meta: {
        title: 'Товар'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Обновление title при навигации
router.beforeEach((to, from, next) => {
  const baseTitle = 'TechStore';
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  next();
});

export default router;