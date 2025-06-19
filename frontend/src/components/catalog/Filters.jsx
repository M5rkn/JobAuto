import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ filters, setFilters }) => {
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'minPrice' || name === 'maxPrice') {
      val = value === '' ? null : Number(value);
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: val,
    }));
    // Валидация
    if ((name === 'minPrice' || name === 'maxPrice') && value) {
      if (isNaN(value) || Number(value) < 0) {
        setFormErrors((prev) => ({ ...prev, [name]: 'Цена должна быть положительным числом' }));
      } else {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
    if (name === 'minPrice' && filters.maxPrice && Number(value) > Number(filters.maxPrice)) {
      setFormErrors((prev) => ({ ...prev, minPrice: 'Минимальная цена не может быть больше максимальной' }));
    }
    if (name === 'maxPrice' && filters.minPrice && Number(value) < Number(filters.minPrice)) {
      setFormErrors((prev) => ({ ...prev, maxPrice: 'Максимальная цена не может быть меньше минимальной' }));
    }
  };

  return (
    <aside className="filters-sidebar">
      <h3>Фильтры</h3>
      <div className="filter-group">
        <label>Бренд</label>
        <input
          type="text"
          name="brand"
          placeholder="Например, Tesla"
          value={filters.brand}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-group">
        <label>Статус</label>
        <select name="status" value={filters.status} onChange={handleInputChange}>
          <option value="">Любой</option>
          <option value="available">В наличии</option>
          <option value="sold">Продан</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Цена</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            placeholder="От"
            value={filters.minPrice ?? ''}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="До"
            value={filters.maxPrice ?? ''}
            onChange={handleInputChange}
          />
        </div>
        {formErrors.minPrice && <span style={{color: 'var(--color-error)'}}>{formErrors.minPrice}</span>}
        {formErrors.maxPrice && <span style={{color: 'var(--color-error)'}}>{formErrors.maxPrice}</span>}
      </div>
    </aside>
  );
};

export default Filters;
