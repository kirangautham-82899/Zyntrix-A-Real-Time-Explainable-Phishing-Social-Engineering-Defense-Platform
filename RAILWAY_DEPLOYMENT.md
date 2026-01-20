# 🚂 Railway Deployment Guide for ZYNTRIX Backend

## ✅ Fixed Configuration Files

The following files have been updated for successful Railway deployment:

### 1. `nixpacks.toml`
- ✅ Added `zbar` system library (for QR scanning)
- ✅ Removed virtual environment (uses system Python)
- ✅ Simplified install commands
- ✅ Correct start command with PORT variable

### 2. `Procfile`
- ✅ Simplified to use system Python
- ✅ Correct backend directory path

### 3. `railway.json`
- ✅ Removed custom build commands
- ✅ Uses nixpacks defaults
- ✅ Correct start command

## 🚀 Deployment Steps

### Step 1: Push Changes to GitHub

```bash
git add nixpacks.toml Procfile railway.json
git commit -m "fix: Railway deployment configuration"
git push
```

### Step 2: Set Environment Variables in Railway

Go to your Railway project → Variables tab and add:

**Required:**
```
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
PORT=8000
```

**Optional (if using external services):**
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/zyntrix
REDIS_URL=redis://default:password@host:port
THREAT_INTEL_ENABLED=false
```

**For CORS (add your Vercel URL):**
```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

### Step 3: Add MongoDB & Redis (Optional)

**Option A: Use Railway's Built-in Databases**
1. In Railway dashboard, click "+ New"
2. Select "Database" → "MongoDB" or "Redis"
3. Railway will auto-set environment variables

**Option B: Use External Services**
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Redis Cloud: https://redis.com/try-free/

### Step 4: Deploy

Railway will automatically deploy when you push to GitHub!

## 🔍 Common Issues & Solutions

### Issue 1: "Module not found"
**Solution**: Make sure `backend/requirements.txt` includes all dependencies

### Issue 2: "Port already in use"
**Solution**: Railway sets `$PORT` automatically - don't hardcode port 8000

### Issue 3: "zbar library not found"
**Solution**: Already fixed in `nixpacks.toml` - zbar is now included

### Issue 4: "Database connection failed"
**Solution**: 
- Check `MONGODB_URL` is set correctly
- Or remove it to run in offline mode

### Issue 5: "Build timeout"
**Solution**: 
- Reduce dependencies if possible
- Or upgrade Railway plan

## 📊 Verify Deployment

Once deployed, test these endpoints:

**Health Check:**
```bash
curl https://your-app.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "ZYNTRIX API is running successfully",
  "version": "1.0.0",
  "services": {
    "mongodb": "connected",
    "redis": "connected",
    "ml_engine": "ready"
  }
}
```

**API Docs:**
```
https://your-app.railway.app/api/docs
```

## 🔗 Connect Frontend to Backend

Update your Vercel environment variable:

```
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

## ✅ Deployment Checklist

Before deploying:

- [ ] Push fixed config files to GitHub
- [ ] Set `JWT_SECRET_KEY` in Railway
- [ ] Add database URLs (or leave empty for offline mode)
- [ ] Set `ALLOWED_ORIGINS` with your Vercel URL
- [ ] Test health endpoint after deployment
- [ ] Update frontend `NEXT_PUBLIC_API_URL`
- [ ] Test end-to-end functionality

## 🎯 Expected Behavior

After successful deployment:

✅ Railway build completes without errors  
✅ Health endpoint returns 200 OK  
✅ API docs accessible  
✅ WebSocket connections work  
✅ All analysis endpoints functional  

## 📞 Still Having Issues?

Check Railway logs:
1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click latest deployment
5. View logs

**Common log errors:**
- `ModuleNotFoundError`: Missing dependency in requirements.txt
- `Address already in use`: PORT variable not set
- `Connection refused`: Database URL incorrect

---

**Your deployment should now work!** 🎉

Push the changes and Railway will automatically redeploy.
