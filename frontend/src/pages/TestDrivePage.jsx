import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import CarCard from '../components/home/CarCard'; // We'll adapt this later
import TestDriveModal from '../components/common/TestDriveModal'; // Import the modal
import './TestDrivePage.css';

const TestDrivePage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('/api/cars?status=available');
                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error('Failed to fetch cars:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const handleBookTestDrive = (car) => {
        if (!user) {
            toast.error('Пожалуйста, войдите в аккаунт, чтобы записаться.');
            return;
        }
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    return (
        <div className="test-drive-page">
            <div className="test-drive-header">
                <h1>Запись на Тест-Драйв</h1>
                <p>Выберите автомобиль мечты и ощутите его в деле.</p>
            </div>
            {loading ? (
                <p>Загрузка автомобилей...</p>
            ) : (
                <div className="cars-list">
                    {cars.map((car) => (
                        <CarCard 
                            key={car._id} 
                            car={car} 
                            onAddToCart={() => handleBookTestDrive(car)}
                            buttonText="Записаться на тест-драйв"
                        />
                    ))}
                </div>
            )}
            {isModalOpen && selectedCar && (
                <TestDriveModal 
                    car={selectedCar} 
                    onClose={() => setIsModalOpen(false)}
                    onBookingSuccess={() => {
                        // Optionally refresh data or give other feedback
                    }}
                />
            )}
        </div>
    );
};

export default TestDrivePage; 