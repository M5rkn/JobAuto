import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      if (!id || id === 'undefined') {
        setError('Invalid car ID.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          throw new Error('Car not found');
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <p>Loading car details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!car) return <p>No car details to display.</p>;

  return (
    <div className="car-detail-page">
      <div className="car-detail-card">
        <img src={car.imageUrl || 'https://via.placeholder.com/600x400'} alt={`${car.brand} ${car.model}`} className="car-detail-image" />
        <div className="car-detail-info">
          <h1>{car.brand} {car.model}</h1>
          <p className="car-year">{car.year}</p>
          <p className="car-price">${car.price.toLocaleString()}</p>
          <p className="car-vin">VIN: {car.vin}</p>
          <p className="car-status">Status: <strong>{car.status}</strong></p>
          <div className="car-description">
            <h4>Description</h4>
            <p>{car.description || 'No description available.'}</p>
          </div>
          <button className="book-button" disabled={car.status !== 'available'}>
            {car.status === 'available' ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>
        {/* Placeholder for reviews */}
        <p>No reviews yet.</p>
      </div>
    </div>
  );
};

export default CarDetailPage; 