import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const loadProduct = async () => {
    const { data } = await api.get(`/products/${id}`);
    setProduct(data);
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/wishlist');
      setInWishlist(data.some((p) => p._id === id));
    } catch {
      // not logged in or error, ignore
    }
  };

  useEffect(() => {
    loadProduct();
    checkWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleWishlist = async () => {
    if (!user) return;
    if (inWishlist) {
      await api.delete(`/wishlist/${id}`);
      setInWishlist(false);
    } else {
      await api.post(`/wishlist/${id}`);
      setInWishlist(true);
    }
  };

  if (!product) return <div className="page"><p>Loading...</p></div>;

  const isOwner = user && product.seller && (product.seller._id === user.id);
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="page product-detail">
      <div className="detail-layout">
        <div className="detail-image-col">
          {images.length > 0 ? (
            <>
              <img className="detail-image" src={images[activeImage]} alt={product.title} />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px',
                        cursor: 'pointer', border: activeImage === i ? '2px solid var(--accent)' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="detail-image-placeholder">No image</div>
          )}
        </div>

        <div className="detail-info-col">
          <h1>{product.title}</h1>
          <p className="price">₹{product.price}</p>
          <p className="meta">{product.category} • {product.location} • {product.status}</p>
          <p>{product.description}</p>
          <p className="seller">Seller: {product.seller?.name} ({product.seller?.email})</p>

          <div className="actions">
            {user && (
              <button onClick={toggleWishlist}>
                {inWishlist ? '♥ Remove from wishlist' : '♡ Add to wishlist'}
              </button>
            )}
            {isOwner && (
              <Link to={`/edit/${product._id}`}><button>Edit / Delete</button></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;