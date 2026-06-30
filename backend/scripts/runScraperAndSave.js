const { spawn } = require('child_process');
const path = require('path');
const mongoose = require('mongoose');

const FashionProduct = require('../models/FashionProduct');

const MONGO_URI = "mongodb+srv://keerthana112131:leoshark@cluster0.elrzhih.mongodb.net/voguevision?retryWrites=true&w=majority&appName=Cluster0";

function runScraper() {
  return new Promise((resolve, reject) => {
    const scraperPath = path.join(__dirname, '../../scraper/scraper.js');
    const child = spawn(process.execPath, [scraperPath], { cwd: path.join(__dirname, '../..') });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (c) => { stdout += c.toString(); });
    child.stderr.on('data', (c) => { stderr += c.toString(); });

    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || `Scraper exited ${code}`));
      try { resolve(JSON.parse(stdout)); }
      catch (e) { reject(e); }
    });
  });
}

async function saveProducts(products) {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let added = 0;
  for (const p of products) {
    const exists = await FashionProduct.findOne({ productName: p.productName });
    if (!exists) {
      await FashionProduct.create(p);
      added++;
    }
  }

  console.log(`Inserted ${added} new products (out of ${products.length})`);
  await mongoose.disconnect();
}

(async () => {
  try {
    console.log('Running scraper...');
    const products = await runScraper();
    console.log(`Scraper returned ${products.length} products`);
    await saveProducts(products);
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
