import React from 'react';
import './Filters.css';

const Filters = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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
          <option value="reserved">В резерве</option>
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
            value={filters.minPrice}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="До"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </aside>
  );
};

export default Filters;
