import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import styles from './TestDriveModal.module.css';

const TestDriveModal = ({ car, onClose, onBookingSuccess }) => {
  const [requestedDate, setRequestedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!requestedDate) errors.requestedDate = 'Дата обязательна';
    else if (new Date(requestedDate) < new Date(new Date().toDateString())) errors.requestedDate = 'Дата не может быть в прошлом';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!token) {
      toast.error('Для записи на тест-драйв необходимо войти в аккаунт.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: car._id,
          requestedDate,
          notes,
        }),
      });

      if (response.ok) {
        toast.success('Ваша заявка на тест-драйв успешно отправлена!');
        onBookingSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось отправить заявку.');
      }
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка при отправке заявки.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Запись на тест-драйв</h2>
        <h3>{car.brand} {car.model}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Выберите желаемую дату</label>
            <input
              type="date"
              id="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />
            {formErrors.requestedDate && <span className={styles['error-message']}>{formErrors.requestedDate}</span>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestDriveModal; 