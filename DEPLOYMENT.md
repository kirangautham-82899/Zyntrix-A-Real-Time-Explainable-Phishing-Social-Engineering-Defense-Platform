# Zyntrx Deployment Guide

## Quick Start

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)

### Step 1: Push to GitHub
```bash
# Make executable
chmod +x deploy.sh

# Run deployment helper
./deploy.sh
```

Or manually:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Backend to Railway
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Zyntrx repository
4. Add environment variables (optional):
   - `MONGODB_URL` - Your MongoDB connection string
   - `REDIS_URL` - Your Redis connection string
   - `JWT_SECRET_KEY` - A secure random string
5. Copy the Railway URL (e.g., `https://zyntrx-backend.up.railway.app`)

### Step 3: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your Zyntrx repository
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your Railway backend URL
5. Click "Deploy"

### Step 4: Verify
- Visit your Vercel URL
- Test the scanner functionality
- Check that API calls work

## Detailed Instructions
See [implementation_plan.md](file:///.gemini/antigravity/brain/1ae2641c-62d7-42fc-ad66-bee1307d4899/implementation_plan.md) for complete deployment guide.

## Environment Variables
See [.env.example](file:///Users/kirangautham82899/Zyntrx/.env.example) for all available environment variables.
