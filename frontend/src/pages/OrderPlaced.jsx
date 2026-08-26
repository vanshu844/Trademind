import { Link, useLocation } from 'react-router-dom';

const OrderPlaced = () => {
  const { state } = useLocation();
  const product = state?.product;

  const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="page order-placed">
      <div className="order-success-icon">✅</div>
      <h1>Order Placed Successfully!</h1>
      <p className="order-id">Order ID: <strong>{orderId}</strong></p>

      {product && (
        <div className="order-summary">
          <h3>{product.title}</h3>
          <p className="price">₹{product.price}</p>
          <p className="meta">{product.category} • {product.location}</p>
        </div>
      )}

      <p className="order-note">
        This is a demo order confirmation — no real payment was made.
      </p>

      <Link to="/">
        <button>Continue Browsing</button>
      </Link>
    </div>
  );
};

export default OrderPlaced;