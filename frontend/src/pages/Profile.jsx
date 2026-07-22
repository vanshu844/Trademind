import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/Authcontext';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const { user, updateUserInStorage } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [myProducts, setMyProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/profile');
      setForm({ name: data.name, phone: data.phone || '', location: data.location || '' });
      const productsRes = await api.get('/products/user/mine');
      setMyProducts(productsRes.data);
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/profile', form);
    updateUserInStorage({ ...user, name: data.name });
    setMessage('Profile updated.');
  };

  return (
    <div className="page">
      <h1>My profile</h1>
      <form onSubmit={handleSubmit} className="form">
        {message && <p className="success">{message}</p>}
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />
        <button type="submit">Save profile</button>
      </form>

      <h2>My Trades</h2>
      {myProducts.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        <div className="product-grid">
          {myProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Profile;