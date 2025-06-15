import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import styles from './Management.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить пользователей');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error('Не удалось обновить роль');
      }
      setUsers(users.map(user => (user._id === userId ? { ...user, role } : user)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Загрузка пользователей...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>Управление Пользователями</h2>
      <table className={styles['management-table']}>
        <thead>
          <tr>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="user">Пользователь</option>
                  <option value="manager">Менеджер</option>
                  <option value="admin">Администратор</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement; 