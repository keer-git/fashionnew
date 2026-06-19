const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType:  { type: String, enum: ['PDF', 'Excel'], required: true },
  status:      { type: String, enum: ['ready', 'generating'], default: 'ready' },
  data:        { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
