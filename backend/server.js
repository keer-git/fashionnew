const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/favorites',  require('./routes/favorites'));
app.use('/api/reports',    require('./routes/reports'));
app.use('/api/scraper',    require('./routes/scraper'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'VogueVision API running' }));

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://keerthana112131:leoshark@cluster0.elrzhih.mongodb.net/voguevision?retryWrites=true&w=majority&appName=Cluster0"
)

  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
