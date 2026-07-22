import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Books', 'Property', 'Jobs', 'Other'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/products/${id}`);
      setForm({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        location: data.location,
        imageUrl: data.images?.[0] || '',
        status: data.status,
      });
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        location: form.location,
        images: form.imageUrl ? [form.imageUrl] : [],
        status: form.status,
      };
      await api.put(`/products/${id}`, payload);
      navigate(`/product/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product permanently?')) return;
    await api.delete(`/products/${id}`);
    navigate('/profile');
  };

  if (!form) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Edit product</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        <input name="title" value={form.title} onChange={handleChange} required />
        <textarea name="description" value={form.description} onChange={handleChange} required rows={4} />
        <input name="price" type="number" value={form.price} onChange={handleChange} required min={0} />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="location" value={form.location} onChange={handleChange} />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <button type="submit">Save changes</button>
        <button type="button" className="danger" onClick={handleDelete}>Delete product</button>
      </form>
    </div>
  );
};

export default EditProduct;