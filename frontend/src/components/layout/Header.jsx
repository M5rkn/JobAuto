import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={handleLinkClick}>CarLoft</Link>
        </div>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <NavLink to="/catalog" onClick={handleLinkClick}>Каталог</NavLink>
          <NavLink to="/about" onClick={handleLinkClick}>О нас</NavLink>
          <NavLink to="/test-drive" onClick={handleLinkClick}>Тест-драйв</NavLink>
          <NavLink to="/contact" onClick={handleLinkClick}>Контакты</NavLink>
          {user ? (
            <>
              <NavLink to="/cart" onClick={handleLinkClick}><FaShoppingCart /> Корзина</NavLink>
              {(user.role === 'admin' || user.role === 'manager') && (
                <NavLink to="/admin" onClick={handleLinkClick}>Панель управления</NavLink>
              )}
              <NavLink to="/profile" onClick={handleLinkClick}><FaUser /> Профиль</NavLink>
              <button onClick={handleLogout} className="logout-button"><FaSignOutAlt/> Выйти</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={handleLinkClick}><FaSignInAlt /> Войти</NavLink>
              <NavLink to="/register" onClick={handleLinkClick}><FaUserPlus /> Регистрация</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 