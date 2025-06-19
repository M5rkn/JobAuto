import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import styles from './Management.module.css';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { token } = useContext(AuthContext);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Не удалось загрузить автомобили');
      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleCreate = () => {
    setEditingCar({ brand: '', model: '', year: '', price: '', vin: '', imageUrl: '' });
    setIsCreating(true);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setIsCreating(false);
  };

  const confirmDelete = (carId) => {
    toast((t) => (
      <span>
        Вы уверены, что хотите удалить этот автомобиль?
        <button
          className={styles['edit-btn']}
          style={{ marginLeft: '10px' }}
          onClick={() => {
            handleDelete(carId);
            toast.dismiss(t.id);
          }}
        >
          Да
        </button>
        <button
          className={styles['delete-btn']}
          style={{ marginLeft: '10px' }}
          onClick={() => toast.dismiss(t.id)}
        >
          Нет
        </button>
      </span>
    ), {
      style: {
        background: '#333',
        color: '#fff',
      }
    });
  };

  const handleDelete = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Не удалось удалить автомобиль');
      setCars(cars.filter(car => car._id !== carId));
      toast.success('Автомобиль успешно удален');
    } catch (err) {
      setError(err.message);
      toast.error('Не удалось удалить автомобиль');
    }
  };

  const handleSave = async (carData) => {
    const url = isCreating ? '/api/cars' : `/api/cars/${carData._id}`;
    const method = isCreating ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
      });
      if (!response.ok) throw new Error(`Не удалось ${isCreating ? 'создать' : 'обновить'} автомобиль`);
      
      await fetchCars(); 
      setEditingCar(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Загрузка автомобилей...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>Управление Автомобилями</h2>
      <div className={styles['action-bar']}>
        <button onClick={handleCreate} className={styles['action-btn-large']}>Добавить Автомобиль</button>
      </div>
      
      {editingCar && (
        <CarForm 
          car={editingCar} 
          onSave={handleSave} 
          onCancel={() => setEditingCar(null)}
          isCreating={isCreating}
        />
      )}

      <table className={styles['management-table']}>
        <thead>
          <tr>
            <th>Бренд</th>
            <th>Модель</th>
            <th>Год</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car._id}>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>${car.price}</td>
              <td>
                <button onClick={() => handleEdit(car)} className={styles['edit-btn']}>Редактировать</button>
                <button onClick={() => confirmDelete(car._id)} className={styles['delete-btn']}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const CarForm = ({ car, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState(car);
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.brand.trim()) errors.brand = 'Бренд обязателен';
    if (!formData.model.trim()) errors.model = 'Модель обязательна';
    if (!formData.year || isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) errors.year = 'Год некорректен';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) errors.price = 'Цена некорректна';
    if (!formData.vin.trim() || formData.vin.length < 10) errors.vin = 'VIN должен быть не менее 10 символов';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSave(formData);
  };

  return (
    <div className={styles['form-container']}>
        <form onSubmit={handleSubmit}>
          <h4>{isCreating ? 'Добавить' : 'Редактировать'} автомобиль</h4>
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Бренд" required />
          {formErrors.brand && <span className={styles['error-message']}>{formErrors.brand}</span>}
          <input name="model" value={formData.model} onChange={handleChange} placeholder="Модель" required />
          {formErrors.model && <span className={styles['error-message']}>{formErrors.model}</span>}
          <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Год" required />
          {formErrors.year && <span className={styles['error-message']}>{formErrors.year}</span>}
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Цена" required />
          {formErrors.price && <span className={styles['error-message']}>{formErrors.price}</span>}
          <input name="vin" value={formData.vin} onChange={handleChange} placeholder="VIN" required />
          {formErrors.vin && <span className={styles['error-message']}>{formErrors.vin}</span>}
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL изображения" />
          <div className={styles['modal-buttons']}>
            <button type="submit" className={styles['edit-btn']}>Сохранить</button>
            <button type="button" onClick={onCancel} className={styles['delete-btn']}>Отмена</button>
          </div>
        </form>
    </div>
  );
};

export default CarManagement; 