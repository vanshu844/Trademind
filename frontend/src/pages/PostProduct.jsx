import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Furniture', 'Vehicles', 'Clothes', 'Bags', 'Stationery', 'Other'];

const PostProduct = () => {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Other', location: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [urlImages, setUrlImages] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (!e.target.files) return;

    // 1. Convert the new files into a standard JavaScript array
    const newFiles = Array.from(e.target.files);

    // 2. Append new files to existing ones, capping the total at 5
    const updatedFiles = [...imageFiles, ...newFiles].slice(0, 5);

    // 3. Clean up old preview URLs from browser memory to prevent leaks
    previews.forEach((url) => URL.revokeObjectURL(url));

    // 4. Update states with the combined collections
    setImageFiles(updatedFiles);
    setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));

    // 5. CRITICAL: Clear the input value so selecting the same file again works
    e.target.value = '';
  };


  const addUrlImage = () => {
    if (urlInput.trim() && urlImages.length < 5) {
      setUrlImages([...urlImages, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeUrlImage = (index) => {
    setUrlImages(urlImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    try {
      let uploadedUrls = [];

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('images', file));
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedUrls = uploadRes.data.imageUrls;
      }

      const allImages = [...uploadedUrls, ...urlImages];

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        location: form.location,
        images: allImages,
      };
      const { data } = await api.post('/products', payload);
      navigate(`/product/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page">
      <h1>Post a product</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={4} />
        <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required min={0} />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="location" placeholder="Location (city/area)" value={form.location} onChange={handleChange} />

        <label>Upload Images from computer (up to 5)</label>
        <input type="file" accept="image/*" multiple={true} onChange={handleFileChange}/>
        
        {previews.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    {previews.map((src, i) => (
      <div key={i} style={{ position: 'relative' }}>
        <img src={src} alt={`preview-${i}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
        <button
          type="button"
          onClick={() => {
            setImageFiles(imageFiles.filter((_, idx) => idx !== i));
            setPreviews(previews.filter((_, idx) => idx !== i));
          }}
          style={{
            position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)',
            color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
            cursor: 'pointer', fontSize: '12px', padding: 0,
          }}
        >×</button>
      </div>
    ))}
  </div>
)}
        <label>Or paste image URL (from Google, etc.)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Paste image URL here"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={addUrlImage}>Add</button>
        </div>
        {urlImages.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {urlImages.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt={`url-${i}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <button
                  type="button"
                  onClick={() => removeUrlImage(i)}
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)',
                    color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                    cursor: 'pointer', fontSize: '12px', padding: 0,
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Posting...' : 'Post product'}
        </button>
      </form>
    </div>
  );
};

export default PostProduct;