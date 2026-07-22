const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct, getMyProducts,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/user/mine', protect, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;