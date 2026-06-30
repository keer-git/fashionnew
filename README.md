# VogueVision – Fashion Trend Analytics Platform

> Transforming Fashion Data into Trend Insights

## Project Structure

```text
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
```

Create a `.env` file inside the `backend` folder with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
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
