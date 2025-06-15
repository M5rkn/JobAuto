import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CartContext from '../context/CartContext';
import './CartPage.css';

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const CartPage = () => {
  const { cart, loading, removeFromCart, placeOrder } = useContext(CartContext);

  if (loading) {
    return <div className="cart-page"><h1>Загрузка корзины...</h1></div>;
  }

  const cartItems = cart?.items || [];
  const total = cartItems.reduce((sum, item) => sum + item.car.price, 0);
  
  const handleRemove = async (carId) => {
    const result = await removeFromCart(carId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePlaceOrder = async () => {
    const result = await placeOrder();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <div className="cart-page-header">
            <h1>Корзина</h1>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Ваша корзина пуста.</p>
            <Link to="/catalog" className="cta-button">Начать покупки</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.car._id} className="cart-item">
                  <img src={item.car.imageUrl} alt={`${item.car.brand} ${item.car.model}`} />
                  <div className="cart-item-info">
                    <h3>{item.car.brand} {item.car.model}</h3>
                    <p>Год: {item.car.year}</p>
                    <p className="price">${item.car.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleRemove(item.car._id)} className="remove-item-btn"><RemoveIcon/></button>
                </div>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Сводка</h2>
              <div className="summary-row">
                <span>Промежуточный итог</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="summary-row total">
                <span>Итог</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button onClick={handlePlaceOrder} className="checkout-button">Оформить заказ</button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 