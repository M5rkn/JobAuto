import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import styles from './Management.module.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить заказы');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
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
      setOrders(orders.map(order => (order._id === orderId ? { ...order, status } : order)));
      toast.success('Статус заказа обновлен');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const confirmDelete = (orderId) => {
    toast((t) => (
      <span>
        Вы уверены, что хотите удалить этот заказ?
        <button
          className={styles['edit-btn']}
          style={{ marginLeft: '10px' }}
          onClick={() => {
            handleDeleteOrder(orderId);
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

  const handleDeleteOrder = async (orderId) => {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error('Не удалось удалить заказ');
        }
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success('Заказ успешно удален');
    } catch (err) {
        setError(err.message);
        toast.error('Не удалось удалить заказ');
    }
  };

  if (loading) return <p>Загрузка заказов...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>Управление Заказами</h2>
      <table className={styles['management-table']}>
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Автомобиль</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user?.username || 'Н/Д'}</td>
              <td>
                {order.carDetails
                  ? `${order.carDetails.brand} ${order.carDetails.model}`
                  : (order.car ? `${order.car.brand} ${order.car.model}` : 'Н/Д')}
              </td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'Cancelled' ? (
                    <>
                        <button onClick={() => handleStatusChange(order._id, 'Confirmed')} className={styles['edit-btn']}>Подтвердить</button>
                        <button onClick={() => handleStatusChange(order._id, 'Cancelled')} className={styles['delete-btn']}>Отменить</button>
                    </>
                ) : (
                    <button onClick={() => confirmDelete(order._id)} className={styles['delete-btn']}>Удалить</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement; 