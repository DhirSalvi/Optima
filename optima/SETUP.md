# Quick Setup Guide

## First Time Setup

### 1. Backend Server Setup
```bash
cd optima/budget-backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB connection string
npm start
```

### 2. Frontend Setup
```bash
cd optima
npm install
cp .env.example .env.local
# Edit .env.local and add your API keys
npm run dev
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Server port (default: 5000)

### Frontend (.env.local)
- `GEMINI_API_KEY` - Google Gemini API key (server-side only)
- `MONGODB_URI` - MongoDB connection string (for Vercel deployment)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

## Important Notes

⚠️ **NEVER commit `.env` or `.env.local` files to Git**

✅ The following files are safe to commit:
- `.env.example`
- `.env.local.example`

## Running the Application

### Development
1. Start backend: `cd optima/budget-backend && npm start`
2. Start frontend: `cd optima && npm run dev`
3. Open http://localhost:3000

### Production (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Security Features

✅ Rate limiting (100 requests per 15 minutes)
✅ Input validation on all endpoints
✅ Environment variable protection
✅ Error message sanitization
✅ MongoDB injection prevention

## Troubleshooting

**MongoDB connection error?**
- Check your `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

**Rate limit errors?**
- Wait 15 minutes or adjust limits in server.js
- Check if you're making too many requests

**Validation errors?**
- Check API request format matches validation rules
- Ensure all required fields are provided
- Verify data types (numbers, strings)
