import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const image = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        {image ? (
          <img src={image} alt={product.title} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="price">₹{product.price}</p>
        <p className="meta">{product.category} • {product.location}</p>
      </div>
    </Link>
  );
};

export default ProductCard;