const express        = require('express');
const router         = express.Router();
const FashionProduct = require('../models/FashionProduct');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/products  (all roles)
router.get('/', async (req, res) => {
  try {
    const { search, category, color, material, season } = req.query;
    const query = {};
    if (search)   query.productName = new RegExp(search, 'i');
    if (category && category !== 'All') query.category = category;
    if (color    && color    !== 'All') query.color    = color;
    if (material && material !== 'All') query.material = material;
    if (season   && season   !== 'All') query.season   = season;
    const products = await FashionProduct.find(query).sort('-createdAt');
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/analytics  – summary counts for charts
router.get('/analytics', async (req, res) => {
  try {
    const [byCat, byColor, byMaterial, bySeason] = await Promise.all([
      FashionProduct.aggregate([{ $group: { _id: '$category',  count: { $sum: 1 } } }]),
      FashionProduct.aggregate([{ $group: { _id: '$color',     count: { $sum: 1 } } }]),
      FashionProduct.aggregate([{ $group: { _id: '$material',  count: { $sum: 1 } } }]),
      FashionProduct.aggregate([{ $group: { _id: '$season',    count: { $sum: 1 } } }]),
    ]);
    res.json({ byCat, byColor, byMaterial, bySeason });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products  (admin only)
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const product = await FashionProduct.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/products/:id  (admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const product = await FashionProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/products/:id  (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await FashionProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
