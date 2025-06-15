import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import styles from './Management.module.css';

const TestDriveManagement = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        // Используем эндпоинт, который мы создали ранее
        const response = await fetch('/api/test-drives/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить заявки на тест-драйв');
        }
        const data = await response.json();
        setTestDrives(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTestDrives();
    }
  }, [token]);

  const handleStatusChange = async (driveId, status) => {
    try {
      const response = await fetch(`/api/test-drives/${driveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Не удалось обновить статус');
      }
      setTestDrives(testDrives.map(drive => (drive._id === driveId ? { ...drive, status } : drive)));
      toast.success('Статус обновлен!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) return <p>Загрузка заявок на тест-драйв...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>Управление Тест-Драйвами</h2>
      <table className={styles['management-table']}>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Автомобиль</th>
            <th>Желаемая дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {testDrives.map(drive => (
            <tr key={drive._id}>
              <td>{drive.user?.username || 'Н/Д'}</td>
              <td>{drive.carDetails ? `${drive.carDetails.brand} ${drive.carDetails.model}` : 'Н/Д'}</td>
              <td>{new Date(drive.requestedDate).toLocaleDateString()}</td>
              <td>{drive.status}</td>
              <td>
                <button onClick={() => handleStatusChange(drive._id, 'Confirmed')} className={styles['edit-btn']}>Подтвердить</button>
                <button onClick={() => handleStatusChange(drive._id, 'Completed')} className={styles['edit-btn']}>Завершен</button>
                <button onClick={() => handleStatusChange(drive._id, 'Cancelled')} className={styles['delete-btn']}>Отменить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestDriveManagement; 