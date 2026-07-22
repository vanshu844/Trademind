const CATEGORIES = ['Electronics', 'Furniture', 'Vehicles', 'Clothes', 'Bags', 'Stationery', 'Other'];

const SearchFilter = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleCategoryClick = (cat) => {
    const newFilters = { ...filters, category: cat };
    setFilters(newFilters);

    // Directly trigger search with the new filters
    // If your onSearch function fetches data based on the 'filters' state, 
    // you may need to pass the newFilters object directly to it.
    onSearch(newFilters);
  };

  return (
    <form className="search-filter" onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder="Search products..."
        value={filters.search}
        onChange={handleChange}
      />
      <div className="category-tabs">
        <button
          type="button"
          className={filters.category === '' ? 'tab active' : 'tab'}
          onClick={() => setFilters({ ...filters, category: '' })}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            className={filters.category === cat ? 'tab active' : 'tab'}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <input
        type="number"
        name="minPrice"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <button type="submit">Apply</button>
    </form>
  );
};

export default SearchFilter;