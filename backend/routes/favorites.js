const express  = require('express');
const router   = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/favorites  – current user's favourites
router.get('/', async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.user._id }).populate('productId');
    res.json(favs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/favorites
router.post('/', async (req, res) => {
  try {
    const fav = await Favorite.create({ userId: req.user._id, productId: req.body.productId });
    res.status(201).json(fav);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already saved' });
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favorites/:productId
router.delete('/:productId', async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.user._id, productId: req.params.productId });
    res.json({ message: 'Removed from favourites' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
