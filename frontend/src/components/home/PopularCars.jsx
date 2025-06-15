import React from 'react';
import CarCard from './CarCard';
import './PopularCars.css';
import { Link } from 'react-router-dom';

const popularCarsData = [
  {
    id: 1,
    brand: 'Tesla',
    model: 'Model S',
    price: 79990,
    imageUrl: 'https://quadro.burda-forward.de/ctf/97b25a1f-63b6-4554-bb1a-b00f0774b38e.9711e165-1e82-4f21-8550-ae549a73e822.jpeg?im=RegionOfInterestCrop%3D%28640%2C360%29%2CregionOfInterest%3D%28320%2C180%29&hash=e7624834e92752339a1b40576e322dce114375a3a57c2f5c20e2ceccbc588a8a',
    year: 2023
  },
  {
    id: 2,
    brand: 'Porsche',
    model: '911 Carrera',
    price: 101200,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
    year: 2024
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'RS7',
    price: 142700,
    imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2070&auto=format&fit=crop',
    year: 2023
  },
];

const PopularCars = ({ onAddToCart }) => {
  return (
    <section className="popular-cars-section">
      <div className="popular-cars-container">
        <div className="popular-cars-header">
          <h2>Популярные модели</h2>
          <p>Ознакомьтесь с нашим тщательно подобранным ассортиментом самых востребованных автомобилей.</p>
        </div>
        <div className="cars-grid">
          {popularCarsData.map((car) => (
            <CarCard key={car.id} car={car} onAddToCart={onAddToCart} />
          ))}
        </div>
        <div className="popular-cars-footer">
            <Link to="/catalog" className="view-all-button">Смотреть весь каталог</Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCars; 