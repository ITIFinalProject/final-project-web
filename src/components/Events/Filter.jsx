// import { useSelector } from 'react-redux';

// const Filter = ({ selectedCategory, onCategoryChange, selectedDate, onDateChange }) => {
//   const categoriesFromStore = useSelector((state) => state.category.list);
//   const categories = ['All', ...categoriesFromStore];

//   return (
//     <div className="filter-container">
//       <div>
//         {/* <label htmlFor="category">Category:</label> */}
//         <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         {/* <label htmlFor="date" >Date:</label> */}
//         <input
//           type="date"
//           id="date"
//           value={selectedDate}
//           onChange={(e) => onDateChange(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Filter;








// import { useSelector } from 'react-redux';

// const Filter = ({ selectedCategory, onCategoryChange, selectedDate, onDateChange }) => {
//   const categoriesFromStore = useSelector((state) => state.category.list);
//   const categories = ['All', ...categoriesFromStore];

//   return (
//     <div className="filter-container">
//       <div>
//         <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => onDateChange(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Filter;






import { useSelector } from 'react-redux';

const Filter = ({ selectedCategory, onCategoryChange, selectedDate, onDateChange }) => {
  const categoriesFromStore = useSelector((state) => state.category.list);
  const categories = ['All', ...categoriesFromStore];

  const clearFilters = () => {
    onCategoryChange('All');
    onDateChange('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedDate !== '';

  return (
    <div className="filter-container">
      <div className="filter-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.25 5.5a.75.75 0 00-.75.75v.75h17v-.75a.75.75 0 00-.75-.75H4.25zM3.5 8.25h17v.75a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-.75zM3.5 11h17v6.75a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75V11z"/>
        </svg>
        <h3>Filters</h3>
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select 
          id="category"
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="date">Date</label>
        <div className="date-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Clear Filters
          </button>
        </div>
      )}

      <div className="filter-summary">
        <div className="active-filters">
          {selectedCategory !== 'All' && (
            <span className="filter-tag">
              {selectedCategory}
              <button onClick={() => onCategoryChange('All')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </span>
          )}
          {selectedDate && (
            <span className="filter-tag">
              {new Date(selectedDate).toLocaleDateString()}
              <button onClick={() => onDateChange('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
