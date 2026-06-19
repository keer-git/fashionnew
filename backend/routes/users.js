const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin
router.use(protect, authorize('admin'));

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/users/:id/toggle-status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ status: user.status });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
