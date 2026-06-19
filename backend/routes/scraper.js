const express        = require('express');
const router         = express.Router();
const { execFile }   = require('child_process');
const path           = require('path');
const FashionProduct = require('../models/FashionProduct');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// POST /api/scraper/run  – triggers the Python scraper
router.post('/run', async (req, res) => {
  const scraperPath = path.join(__dirname, '../../scraper/scraper.py');

  execFile('python', [scraperPath], { timeout: 120000 }, async (err, stdout, stderr) => {
    if (err) {
      console.error('Scraper error:', stderr);
      return res.status(500).json({
        message: 'Scraper failed',
        error: stderr
      });
    }

    try {
      const results = JSON.parse(stdout);

      // Save products to MongoDB
      let addedCount = 0;

      for (const product of results) {
        const exists = await FashionProduct.findOne({
          productName: product.productName
        });

        if (!exists) {
          await FashionProduct.create(product);
          addedCount++;
        }
      }

      res.json({
        message: 'Scraping complete',
        scraped: results.length,
        added: addedCount
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Failed to process scraper output'
      });
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
