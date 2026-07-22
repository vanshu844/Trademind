const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const protect = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Multiple images (up to 5)
router.post('/', protect, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const imageUrls = req.files.map((file) => `http://localhost:5000/uploads/${file.filename}`);
  res.json({ imageUrls });
});

module.exports = router;