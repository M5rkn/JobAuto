import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
    return (
        <div className="hero-banner">
            <div className="hero-main-content">
                <div className="hero-content">
                    <h1>CarLoft</h1>
                    <p>Откройте для себя автомобили будущего. Исключительный дизайн и производительность.</p>
                </div>
                <div className="hero-actions">
                    <Link to="/catalog" className="hero-button primary">Каталог</Link>
                    <Link to="/test-drive" className="hero-button secondary">Тест-драйв</Link>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner; 