import React, { useContext } from 'react';
import styles from './AdminPage.module.css';
import AuthContext from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import OrderManagement from '../components/admin/OrderManagement';
import CarManagement from '../components/admin/CarManagement';
import TestDriveManagement from '../components/admin/TestDriveManagement';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading or not authorized...</p>;
  }

  const isManager = user.role === 'manager';
  const isAdmin = user.role === 'admin';

  return (
    <div className={styles['admin-page']}>
      <h1>Панель управления</h1>
      
      {(isAdmin || isManager) && (
        <div className={styles['management-section']}>
          <TestDriveManagement />
        </div>
      )}
      
      {(isAdmin || isManager) && (
        <div className={styles['management-section']}>
          <OrderManagement />
        </div>
      )}
      
      {(isAdmin || isManager) && (
        <div className={styles['management-section']}>
          <CarManagement />
        </div>
      )}

      {isAdmin && (
        <div className={styles['management-section']}>
          <UserManagement />
        </div>
      )}
    </div>
  );
};

export default AdminPage; 