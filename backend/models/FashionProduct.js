const mongoose = require('mongoose');

const fashionProductSchema = new mongoose.Schema({
  productName:     { type: String, required: true, trim: true },
  category:        { type: String, required: true },
  description:     { type: String, default: '' },
  color:           { type: String, default: '' },
  material:        { type: String, default: '' },
  season:          { type: String, default: '' },
  imageUrl:        { type: String, default: '' },
  articleUrl:      { type: String, default: '' },
  publicationDate: { type: Date },
  source:          { type: String, default: 'manual' }, // 'scraped' | 'manual'
}, { timestamps: true });

module.exports = mongoose.model('FashionProduct', fashionProductSchema);
