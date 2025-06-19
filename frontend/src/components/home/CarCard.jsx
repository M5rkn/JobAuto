import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car, onAddToCart, buttonText, clickable = true }) => {
  const CardContent = (
    <>
      <div className="car-card-image-container">
        <img src={car.imageUrl || 'https://via.placeholder.com/300x200'} alt={`${car.brand} ${car.model}`} />
      </div>
      <div className="car-card-info">
        <h3>{car.brand} {car.model}</h3>
        <p>{car.year}</p>
        <div className="car-card-details">
          <p className="price">${car.price.toLocaleString()}</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(car._id || car.id);
            }} 
            disabled={car.status !== 'available'}
            className="add-to-cart-btn"
          >
            {car.status === 'available' ? (buttonText || 'В корзину') : car.status === 'sold' ? 'Продано' : 'В резерве'}
          </button>
        </div>
      </div>
    </>
  );

  return clickable
    ? <Link to={`/car/${car._id || car.id}`} className="car-card">{CardContent}</Link>
    : <div className="car-card">{CardContent}</div>;
};

export default CarCard; 