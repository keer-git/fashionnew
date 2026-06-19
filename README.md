# VogueVision – Fashion Trend Analytics Platform

> Transforming Fashion Data into Trend Insights

## Project Structure

```
voguevision/
├── frontend/          # React.js application
├── backend/           # Node.js + Express API
└── scraper/           # Python Vogue scraper
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB URI & JWT secret
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Scraper
```bash
cd scraper
pip install -r requirements.txt
python scraper.py
```

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@voguevision.com | admin123 |
| Designer | designer@voguevision.com | design123 |
| Retail | retail@voguevision.com | retail123 |
