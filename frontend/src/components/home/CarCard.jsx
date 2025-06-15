import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car, onAddToCart, buttonText }) => {
  return (
    <Link to={`/car/${car._id}`} className="car-card">
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
                        e.preventDefault(); // Prevent navigation when clicking the button
                        console.log(`Adding car to cart: ${car._id}`);
                        onAddToCart(car._id);
                    }} 
                    disabled={car.status !== 'available'}
                    className="add-to-cart-btn"
                >
                    {car.status === 'available' ? (buttonText || 'В корзину') : 'В резерве'}
                </button>
            </div>
        </div>
    </Link>
  );
};

export default CarCard; 