import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (!email.trim()) errors.email = 'Email обязателен';
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Некорректный email';
        if (!password) errors.password = 'Пароль обязателен';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        setLoading(true);
        setError('');
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Произошла ошибка при входе.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Вход</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <p className="auth-switch">
                    Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage; 