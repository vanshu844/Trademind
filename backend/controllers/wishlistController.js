const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const productId = req.params.productId;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const productId = req.params.productId;

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };