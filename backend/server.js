require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://trademind-blond.vercel.app"
  ]
})); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('OLX Mini API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;