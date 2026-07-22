import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="hero">  
       <img className="hero-img top-left" src="./electronics.jpg" alt="" />
        <img className="hero-img top-right" src="./furniture.jpg"alt="" />
        <img className="hero-img bottom-left" src="./clothes.jpg" alt="" />
        <img className="hero-img bottom-right" src="./stationery.jpg" alt="" />

        <div className="hero-center">

        
          <h1 className="hero-title">TradeMind</h1>
          <p className="hero-tagline">Buy, sell, and discover — right in your neighborhood</p>
        </div>
      </div>

      <div className="page">
        <SearchFilter filters={filters} setFilters={setFilters} onSearch={fetchProducts} />
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found. Try a different search or filter.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;