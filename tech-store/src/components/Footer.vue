<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">TechStore</h3>
          <p class="footer-description">
            Ваш надежный магазин современной техники и электроники.
            Только оригинальные товары с гарантией.
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Информация</h4>
          <ul class="footer-links">
            <li><a href="#">О компании</a></li>
            <li><a href="#">Доставка и оплата</a></li>
            <li><a href="#">Гарантия</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Категории</h4>
          <ul class="footer-links">
            <li><a href="#">Смартфоны</a></li>
            <li><a href="#">Ноутбуки</a></li>
            <li><a href="#">Аудио</a></li>
            <li><a href="#">Аксессуары</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Контакты</h4>
          <ul class="footer-contacts">
            <li>
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+7 (800) 123-45-67</span>
            </li>
            <li>
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>info@techstore.ru</span>
            </li>
            <li>
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Кострома, студенческий проезд, 2</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 TechStore. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding: 60px 0 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.footer-description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.footer-heading {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-contacts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-contacts li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.contact-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0 30px;
  }
}
</style>