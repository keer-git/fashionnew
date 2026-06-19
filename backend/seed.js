require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Category = require('./models/Category');
const FashionProduct = require('./models/FashionProduct');

const categories = [
  { name: 'Streetwear',        description: 'Urban contemporary fashion and street-style trends' },
  { name: 'Luxury Fashion',    description: 'High-end couture and luxury designer collections' },
  { name: 'Casual Wear',       description: 'Everyday comfortable and relaxed clothing styles' },
  { name: 'Summer Collection', description: 'Warm-weather seasonal fashion trends' },
  { name: 'Winter Collection', description: 'Cold-weather and layering fashion trends' },
  { name: 'Accessories',       description: 'Bags, shoes, jewellery and fashion accessories' },
];

const users = [
  { name: 'Alexandra Stone',  email: 'admin@voguevision.com',    password: 'admin123',  role: 'admin'    },
  { name: 'Isabella Reeves',  email: 'designer@voguevision.com', password: 'design123', role: 'designer' },
  { name: 'Marcus Cole',      email: 'retail@voguevision.com',   password: 'retail123', role: 'retail'   },
];

const products = [
  { productName: 'Ivory Silk Blazer',      category: 'Luxury Fashion',    color: 'Ivory',      material: 'Silk',     season: 'Spring/Summer', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=400&q=80', description: 'An impeccably tailored ivory silk blazer from the latest Parisian runway.', source: 'scraped' },
  { productName: 'Oversized Denim Jacket', category: 'Streetwear',        color: 'Blue',       material: 'Denim',    season: 'Autumn/Winter', imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80', description: 'A statement oversized denim jacket with distressed detailing.', source: 'scraped' },
  { productName: 'Linen Wide-Leg Trousers',category: 'Casual Wear',       color: 'Beige',      material: 'Linen',    season: 'Spring/Summer', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', description: 'Relaxed wide-leg linen trousers in a neutral beige tone.', source: 'scraped' },
  { productName: 'Camel Wool Coat',        category: 'Winter Collection', color: 'Camel',      material: 'Wool',     season: 'Autumn/Winter', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80', description: 'A timeless camel wool overcoat with structured shoulders.', source: 'scraped' },
  { productName: 'Gold Chain Necklace',    category: 'Accessories',       color: 'Gold',       material: 'Metal',    season: 'All Season',    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', description: 'A chunky gold-tone chain necklace that elevates any outfit.', source: 'scraped' },
  { productName: 'Floral Sundress',        category: 'Summer Collection', color: 'Multicolor', material: 'Cotton',   season: 'Spring/Summer', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', description: 'A lightweight floral cotton sundress with adjustable straps.', source: 'scraped' },
  { productName: 'Leather Mini Skirt',     category: 'Streetwear',        color: 'Black',      material: 'Leather',  season: 'Autumn/Winter', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5218e4e9ed?w=400&q=80', description: 'An edgy black leather mini skirt with asymmetric hemline.', source: 'scraped' },
  { productName: 'Cashmere Turtleneck',    category: 'Luxury Fashion',    color: 'Cream',      material: 'Cashmere', season: 'Autumn/Winter', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', description: 'Ultra-soft cashmere turtleneck in a luxurious cream shade.', source: 'scraped' },
];

async function seed() {
  await mongoose.connect("mongodb+srv://keerthana112131:leoshark@cluster0.elrzhih.mongodb.net/voguevision?retryWrites=true&w=majority&appName=Cluster0");
  console.log('Connected to MongoDB');

  await User.deleteMany();
  await Category.deleteMany();
  await FashionProduct.deleteMany();

  await Category.insertMany(categories);
  console.log('✅ Categories seeded');

  for (const u of users) await User.create(u);
  console.log('✅ Users seeded');

  await FashionProduct.insertMany(products);
  console.log('✅ Products seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('Login: admin@voguevision.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
