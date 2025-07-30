import { useSelector } from 'react-redux';

const Filter = ({ selectedCategory, onCategoryChange, selectedDate, onDateChange }) => {
  const categoriesFromStore = useSelector((state) => state.category.list);
  const categories = ['All', ...categoriesFromStore];

  return (
    <div className="filter-container">
      <div>
        {/* <label htmlFor="category">Category:</label> */}
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        {/* <label htmlFor="date" >Date:</label> */}
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filter;
