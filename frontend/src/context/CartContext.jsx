import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user, token]);

  const addToCart = async (carId) => {
    console.log('addToCart called in CartContext. Token:', token, 'Car ID:', carId);
    if (!token) {
      return { success: false, message: 'Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину.' };
    }
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ carId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
        return { success: true, message: 'Машина добавлена в корзину!' };
      } else {
        return { success: false, message: data.msg || 'Не удалось добавить машину.' };
      }
    } catch (error) {
      return { success: false, message: 'Ошибка сети.' };
    }
  };

  const removeFromCart = async (carId) => {
    try {
      const response = await fetch(`/api/cart/remove/${carId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
        return { success: true, message: 'Машина удалена из корзины.' };
      }
    } catch (error) {
      return { success: false, message: 'Ошибка сети.' };
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        fetchCart(); // Refresh cart (should be empty now)
        return { success: true, message: 'Заказ успешно оформлен!' };
      } else {
        return { success: false, message: data.msg || 'Не удалось оформить заказ.' };
      }
    } catch (error) {
      return { success: false, message: 'Ошибка сети.' };
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 