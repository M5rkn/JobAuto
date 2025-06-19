import React from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import PopularCars from '../components/home/PopularCars';
import './HomePage.css';

const HomePage = () => {
    
  const handleAddToCart = (carId) => {
  };

  return (
    <div className="home-page">
      <HeroBanner />
      
      <section className="welcome-section">
        <div className="container">
          <h2>Добро пожаловать в CarLoft</h2>
          <p>Ваше путешествие в мир премиальных автомобилей начинается здесь. Мы предлагаем лучший выбор и сервис.</p>
          <Link to="/catalog" className="cta-button">Смотреть каталог</Link>
        </div>
      </section>

      <PopularCars onAddToCart={handleAddToCart} />

      <section className="news-section">
        <div className="container">
          <h2>Последние новости</h2>
          <div className="news-items">
            <div className="news-item">
              <h4>Новое поступление: BMW M5 2024</h4>
              <p>Невероятная мощность и стиль уже доступны в нашем салоне. Узнайте больше!</p>
              <span className="news-date">15 июня 2024</span>
            </div>
            <div className="news-item">
              <h4>Летняя акция: -10% на все внедорожники</h4>
              <p>Только до конца августа! Не упустите свой шанс приобрести автомобиль мечты по выгодной цене.</p>
              <span className="news-date">10 июня 2024</span>
            </div>
             <div className="news-item">
              <h4>Мы открылись в новом городе</h4>
              <p>Рады сообщить, что теперь наш салон доступен в вашем городе. Ждем вас!</p>
              <span className="news-date">5 июня 2024</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 