import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/wishlist');
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page">
      <h1>My wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>Your wishlist is empty. Go add some products you like!</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;