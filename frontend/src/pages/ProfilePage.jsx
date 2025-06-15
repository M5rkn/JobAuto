import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout, token, updateUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Состояние для редактирования имени
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user ? user.name : '');

  useEffect(() => {
    if (user && user.name !== name) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          setLoading(true);
          const [ordersRes, testDrivesRes] = await Promise.all([
            fetch('/api/orders/myorders', {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
            fetch('/api/test-drives/my-drives', {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
          ]);

          if (!ordersRes.ok) throw new Error('Не удалось загрузить заказы');
          if (!testDrivesRes.ok) throw new Error('Не удалось загрузить тест-драйвы');

          const ordersData = await ordersRes.json();
          const testDrivesData = await testDrivesRes.json();

          setOrders(ordersData);
          setTestDrives(testDrivesData);
        } catch (error) {
          console.error(error);
          // Optional: Show toast notification for errors
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [token]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error('Имя не может быть пустым.');
      return;
    }
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (response.ok) {
        updateUser(data.token);
        toast.success(data.message || 'Имя успешно обновлено!');
        setIsEditingName(false);
      } else {
        throw new Error(data.message || 'Не удалось обновить имя.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}...@${domain}`;
    }
    const maskedPart = localPart.slice(0, Math.ceil(localPart.length / 2));
    return `${maskedPart}...@${domain}`;
  };

  if (!user || loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-card']}>
        <h1>Профиль пользователя</h1>
        <div className={styles['profile-info']}>
          <div className={styles['profile-field']}>
            <strong>Имя:</strong>
            {isEditingName ? (
              <div className={styles['edit-name-container']}>
                <input type="text" value={name} onChange={handleNameChange} className={styles['name-input']} />
                <button onClick={handleUpdateName} className={styles['save-btn']}>Сохранить</button>
                <button onClick={() => setIsEditingName(false)} className={styles['cancel-btn']}>Отмена</button>
              </div>
            ) : (
              <span>
                {user.name || 'Не указано'}
                <button onClick={() => setIsEditingName(true)} className={styles['edit-btn-small']}>✎</button>
              </span>
            )}
          </div>
          <p><strong>Email:</strong> {maskEmail(user.email)}</p>
          <p><strong>Роль:</strong> {user.role}</p>
        </div>
        
        <div className={styles['profile-orders']}>
          <h2>Мои заказы</h2>
          {orders.length > 0 ? (
            <table className={styles['orders-table']}>
              <thead>
                <tr>
                  <th>ID Заказа</th>
                  <th>Автомобиль</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {order.carDetails 
                        ? `${order.carDetails.brand} ${order.carDetails.model}` 
                        : (order.car ? `${order.car.brand} ${order.car.model}` : 'Информация об авто недоступна')}
                    </td>
                    <td><span className={`${styles.status} ${styles[`status-${order.status.toLowerCase()}`]}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>У вас пока нет заказов.</p>
          )}
        </div>
        
        <div className={styles['profile-test-drives']}>
          <h2>Мои записи на тест-драйв</h2>
          {testDrives.length > 0 ? (
            <table className={styles['orders-table']}>
              <thead>
                <tr>
                  <th>Автомобиль</th>
                  <th>Дата заявки</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.map(drive => (
                  <tr key={drive._id}>
                    <td>{drive.carDetails ? `${drive.carDetails.brand} ${drive.carDetails.model}` : 'Н/Д'}</td>
                    <td>{new Date(drive.requestedDate).toLocaleDateString()}</td>
                    <td><span className={`${styles.status} ${styles[`status-${drive.status.toLowerCase()}`]}`}>{drive.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>У вас пока нет записей на тест-драйв.</p>
          )}
        </div>

        <button onClick={logout} className={styles['logout-button-profile']}>Выйти из аккаунта</button>
      </div>
    </div>
  );
};

export default ProfilePage; 