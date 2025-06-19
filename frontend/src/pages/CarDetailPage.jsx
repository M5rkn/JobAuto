import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './CarDetailPage.css';
import TestDriveModal from '../components/common/TestDriveModal';
import AuthContext from '../context/AuthContext';

const StarRating = ({ value, onChange, disabled }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'inline-flex', gap: 4, fontSize: 28, verticalAlign: 'middle' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: disabled ? 'default' : 'pointer',
            color:
              (hovered || value) >= star
                ? 'var(--color-primary)'
                : 'var(--color-border)',
            transition: 'color 0.2s',
            userSelect: 'none',
          }}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(star)}
          role="button"
          aria-label={`Оценка ${star}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const CarDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editError, setEditError] = useState('');
  const editInputRef = useRef();
  const [deleteModal, setDeleteModal] = useState({ open: false, reviewId: null });

  const isValidObjectId = (str) => typeof str === 'string' && str.length === 24 && /^[a-fA-F0-9]+$/.test(str);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id || id === 'undefined') {
        setError('Некорректный ID автомобиля.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          throw new Error('Автомобиль не найден');
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(`/api/reviews/car/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки отзывов');
        const data = await response.json();
        setReviews(data);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setReviewError('Комментарий должен содержать минимум 10 символов.');
      return;
    }
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      setReviewError('Пожалуйста, выберите оценку от 1 до 5.');
      return;
    }
    if (!isValidObjectId(id)) {
      setReviewError('Некорректный идентификатор автомобиля.');
      return;
    }
    setReviewSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/car/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при добавлении отзыва');
      }
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.text);
    setEditRating(review.rating);
    setEditError('');
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const handleEditCancel = () => {
    setEditingReviewId(null);
    setEditText('');
    setEditRating(5);
    setEditError('');
  };

  const handleEditSave = async (reviewId) => {
    setEditError('');
    if (!editText.trim() || editText.trim().length < 10) {
      setEditError('Комментарий должен содержать минимум 10 символов.');
      return;
    }
    if (!editRating || editRating < 1 || editRating > 5) {
      setEditError('Пожалуйста, выберите оценку от 1 до 5.');
      return;
    }
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText, rating: editRating }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при редактировании отзыва');
      }
      const updated = await response.json();
      setReviews(reviews.map(r => r._id === reviewId ? updated : r));
      handleEditCancel();
    } catch (err) {
      setEditError(err.message);
    }
  };

  const openDeleteModal = (reviewId) => setDeleteModal({ open: true, reviewId });
  const closeDeleteModal = () => setDeleteModal({ open: false, reviewId: null });

  const handleDelete = async () => {
    const reviewId = deleteModal.reviewId;
    if (!reviewId) return;
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при удалении отзыва');
      }
      setReviews(reviews.filter(r => r._id !== reviewId));
      closeDeleteModal();
    } catch (err) {
      alert(err.message);
      closeDeleteModal();
    }
  };

  if (loading) return <p>Загрузка данных об автомобиле...</p>;
  if (error) return <p style={{color:'var(--color-error)'}}>Ошибка: {error}</p>;
  if (!car) return <p>Нет данных для отображения.</p>;

  return (
    <div className="car-detail-page">
      <div className="car-detail-card">
        <img src={car.imageUrl || 'https://via.placeholder.com/600x400'} alt={`${car.brand} ${car.model}`} className="car-detail-image" />
        <div className="car-detail-info">
          <h1>{car.brand} {car.model}</h1>
          <p className="car-year">Год выпуска: {car.year}</p>
          <p className="car-price">{car.price ? `${car.price.toLocaleString()} ₽` : 'Цена не указана'}</p>
          <p className="car-vin">VIN: {car.vin || '—'}</p>
          <p className="car-status">Статус: <strong>{car.status === 'available' ? 'в наличии' : car.status === 'reserved' ? 'в резерве' : car.status === 'sold' ? 'продан' : car.status}</strong></p>
          <button
            className="book-button"
            disabled={car.status !== 'available'}
            onClick={() => setIsModalOpen(true)}
          >
            {car.status === 'available' ? 'Записаться на тест-драйв' : 'Недоступно'}
          </button>
        </div>
      </div>
      <div className="reviews-section">
        <h2>Отзывы</h2>
        {reviewsLoading ? (
          <p>Загрузка отзывов...</p>
        ) : reviews.length === 0 ? (
          <p>Пока нет отзывов.</p>
        ) : (
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {reviews.map((review, idx) => (
              <li key={review._id} style={{marginBottom:'1.2rem', borderBottom:'1px solid var(--color-border)', paddingBottom:'1rem', '--i': idx}}>
                <div style={{fontWeight:600, color:'var(--color-primary)'}}>Оценка: {review.rating} / 5</div>
                <div style={{color:'var(--color-text-secondary)', fontSize:'0.95rem', marginBottom:'0.3rem'}}>Автор: {review.user?.username || 'Пользователь'}</div>
                {editingReviewId === review._id ? (
                  <div style={{marginTop:8}}>
                    <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
                      <StarRating value={editRating} onChange={setEditRating} disabled={false} />
                      <input
                        ref={editInputRef}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        style={{flex:1, minWidth:180, maxWidth:400, borderRadius:6, padding:'0.5rem', fontSize:'1rem', border:'1.5px solid var(--color-border)', background:'#222', color:'var(--color-text-primary)'}}
                        maxLength={500}
                      />
                    </div>
                    {editError && <div style={{color:'var(--color-error)', marginBottom:8}}>{editError}</div>}
                    <button onClick={() => handleEditSave(review._id)} className="book-button" style={{marginRight:10}}>Сохранить</button>
                    <button onClick={handleEditCancel} className="book-button" style={{background:'#333', color:'#fff'}}>Отмена</button>
                  </div>
                ) : (
                  <>
                    <div>{review.text}</div>
                    {user && review.user && (review.user._id === user.id || user.role === 'admin' || user.role === 'manager') && (
                      <div style={{marginTop:8, display:'flex', gap:8}}>
                        {review.user._id === user.id && (
                          <button onClick={() => handleEditClick(review)} className="book-button" style={{padding:'0.3rem 1.1rem', fontSize:'0.95rem'}}>Редактировать</button>
                        )}
                        <button onClick={() => openDeleteModal(review._id)} className="book-button" style={{background:'#333', color:'#fff', padding:'0.3rem 1.1rem', fontSize:'0.95rem'}}>Удалить</button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <div style={{marginTop:'2rem'}}>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <label className="review-form-label">Ваша оценка:</label>
              <div className="review-form-stars">
                <StarRating value={reviewRating} onChange={setReviewRating} disabled={reviewSubmitting} />
              </div>
              <label className="review-form-label" htmlFor="review-text">Комментарий:</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={3}
                placeholder="Ваш отзыв..."
                disabled={reviewSubmitting}
              />
              {reviewError && <div style={{color:'var(--color-error)', marginBottom:'0.5rem'}}>{reviewError}</div>}
              <button type="submit" className="book-button" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Отправка...' : 'Оставить отзыв'}
              </button>
            </form>
          ) : (
            <div style={{color:'var(--color-text-secondary)', fontStyle:'italic'}}>Войдите, чтобы оставить отзыв.</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <TestDriveModal car={car} onClose={() => setIsModalOpen(false)} onBookingSuccess={() => {}} />
      )}
      {deleteModal.open && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Удалить отзыв?</h3>
            <p style={{color:'var(--color-text-secondary)', marginBottom:18}}>Это действие необратимо.</p>
            <div style={{display:'flex', gap:16, justifyContent:'flex-end'}}>
              <button onClick={handleDelete} className="book-button delete-modal-btn" style={{background:'var(--color-primary)', color:'#fff'}}>Удалить</button>
              <button onClick={closeDeleteModal} className="book-button delete-modal-btn" style={{background:'#333', color:'#fff'}}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage; 