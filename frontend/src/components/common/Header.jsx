import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, loading } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          АвтоСалон
        </Link>
        <nav className="main-nav">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
        </nav>
        <div className="auth-links">
          {loading ? null : user ? (
            <>
              { (user.role === 'admin' || user.role === 'manager') && <NavLink to="/admin">Админ</NavLink> }
              <NavLink to="/profile">Профиль</NavLink>
              <button onClick={logout} className="logout-button">Выйти</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Войти</Link>
              <NavLink to="/register">Регистрация</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 