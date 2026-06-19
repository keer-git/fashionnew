const express        = require('express');
const router         = express.Router();
const { execFile }   = require('child_process');
const path           = require('path');
const FashionProduct = require('../models/FashionProduct');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// POST /api/scraper/run  – triggers the Python scraper
router.post('/run', (req, res) => {
  const scraperPath = path.join(__dirname, '../../scraper/scraper.py');
  execFile('python3', [scraperPath], { timeout: 120000 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Scraper error:', stderr);
      return res.status(500).json({ message: 'Scraper failed', error: stderr });
    }
    try {
      const results = JSON.parse(stdout);
      res.json({ message: 'Scraping complete', count: results.length, data: results });
    } catch {
      res.json({ message: 'Scraper ran', output: stdout });
    }
  });
});

// GET /api/scraper/status
router.get('/status', async (req, res) => {
  try {
    const total  = await FashionProduct.countDocuments();
    const latest = await FashionProduct.findOne({ source: 'scraped' }).sort('-createdAt');
    res.json({ totalRecords: total, lastScraped: latest?.createdAt || null });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
