import React, { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';
import Filters from '../components/catalog/Filters';
import CarCard from '../components/home/CarCard';
import CartContext from '../context/CartContext';
import './CatalogPage.css';


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CatalogPage = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== null && val !== '' && val !== undefined) {
        params.set(key, val);
      }
    });
    if (debouncedSearchTerm) {
      params.set('searchTerm', debouncedSearchTerm);
    }
    const query = params.toString();
    try {
      const response = await fetch(`/api/cars?${query}`);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchTerm]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleAddToCart = async (carId) => {
    const result = await addToCart(carId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="catalog-page">
        <div className="catalog-page-container">
            <div className="catalog-page-header">
                <h1>Наш каталог</h1>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Поиск по бренду или модели..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="catalog-layout">
                <Filters filters={filters} setFilters={setFilters} />
                <div className="cars-list">
                {loading ? (
                    <p>Загрузка автомобилей...</p>
                ) : cars.length > 0 ? (
                    cars.map((car) => <CarCard key={car._id} car={car} onAddToCart={handleAddToCart} />)
                ) : (
                    <p>Автомобили не найдены. Попробуйте изменить фильтры.</p>
                )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CatalogPage;