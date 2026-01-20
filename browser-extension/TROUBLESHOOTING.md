# 🛡️ Browser Extension Not Blocking - Troubleshooting Guide

## 🔍 Common Reasons & Solutions

### 1. ⚠️ **Risk Threshold Too High**

**Problem**: The extension only blocks URLs with risk score **> 60**

**Check**: What risk score is your test URL getting?

**Solution**: Lower the threshold for testing

**Edit** `browser-extension/background.js` line 60:
```javascript
// Current (only blocks if score > 60):
if (data.data && data.data.risk_score > 60) {

// Change to (blocks if score > 30 for testing):
if (data.data && data.data.risk_score > 30) {
```

### 2. 🔌 **Backend Not Running**

**Check**: Is backend running on port 8000?

**Test**:
```bash
curl http://localhost:8000/api/health
```

**Expected**: Should return JSON with "status": "healthy"

**Solution**: Start backend:
```bash
cd backend
./start_backend.sh
```

### 3. 🔄 **Extension Not Loaded/Enabled**

**Check**:
1. Go to `chrome://extensions` (or `edge://extensions`)
2. Find "ZYNTRIX Real-Time Shield"
3. Make sure toggle is **ON** (blue)
4. Check "Real-time Monitoring" is enabled in popup

**Solution**: 
- Toggle extension OFF then ON
- Click extension icon → verify "Real-time Monitoring" is ON

### 4. 🌐 **Testing on Excluded URLs**

**Problem**: Extension skips these URLs:
- `chrome://` or `edge://` pages
- `about:` pages  
- `localhost:3000` or `localhost:3001` (your frontend)

**Solution**: Test on actual external URLs like:
```
http://192.168.1.1/login.php
http://suspicious-test-site.com
```

### 5. 📝 **Content Script Not Injecting**

**Check Browser Console**:
1. Press F12 on any page
2. Go to Console tab
3. Look for: `ZYNTRIX Shield Active`

**If NOT showing**:
- Extension may not be injecting content script
- Reload the extension
- Refresh the page

### 6. 🔒 **CORS Issues**

**Check Console for errors like**:
```
Access to fetch at 'http://localhost:8000' blocked by CORS
```

**Solution**: Backend should already allow CORS, but verify in `backend/main.py`:
```python
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]
```

## 🧪 Step-by-Step Testing

### Test 1: Verify Extension is Active

1. **Open any website** (e.g., google.com)
2. **Press F12** → Console tab
3. **Look for**: `ZYNTRIX Shield Active`
4. **If missing**: Extension not injecting → Reload extension

### Test 2: Check Backend Connection

1. **Open extension popup** (click icon in toolbar)
2. **Check status**: Should show protection active
3. **Open Console** (F12)
4. **Look for**: Any API errors

### Test 3: Test with Known Risky URL

**Use this test URL**:
```
http://192.168.1.1/admin/login.php?redirect=http://malicious.com
```

**Expected Behavior**:
1. Page starts loading
2. Extension checks URL with backend
3. If risk score > 60: Full-screen warning appears
4. If risk score < 60: Page loads normally

### Test 4: Lower Threshold for Testing

**Temporarily lower the blocking threshold**:

1. Open `browser-extension/background.js`
2. Find line 60:
   ```javascript
   if (data.data && data.data.risk_score > 60) {
   ```
3. Change to:
   ```javascript
   if (data.data && data.data.risk_score > 0) {
   ```
4. **Reload extension** in `chrome://extensions`
5. Try visiting **any** URL
6. Should now block almost everything (for testing)

## 🎯 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Backend is running (`curl http://localhost:8000/api/health`)
- [ ] Extension is loaded and enabled in browser
- [ ] Extension icon shows in toolbar
- [ ] "Real-time Monitoring" is ON in popup
- [ ] Testing on external URL (not chrome://, localhost, etc.)
- [ ] Browser console shows "ZYNTRIX Shield Active"
- [ ] No CORS errors in console
- [ ] Risk score of test URL is > 60 (or threshold you set)

## 🔧 Manual Test

### Test the API Directly:

```bash
curl -X POST http://localhost:8000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login.php"}'
```

**Check the risk_score** in response. If it's < 60, the extension won't block it.

## 📊 Understanding Risk Scores

The extension blocks based on these thresholds:

| Risk Score | Risk Level | Extension Action |
|------------|------------|------------------|
| 0-30 | Safe | ✅ Allow |
| 31-60 | Suspicious | ⚠️ Allow (with caution) |
| 61-100 | Dangerous | 🚫 **BLOCK** |

**To see blocking in action**, you need URLs that score **> 60**.

## 🎨 Test URLs by Risk Level

### High Risk (Should Block):
```
http://secure-paypal-verify-account-login-update.suspicious-domain.com/verify
http://192.168.1.1/admin/login.php?token=abc123&redirect=http://evil.com
```

### Medium Risk (Won't Block by Default):
```
http://192.168.1.1/login.php
http://example-test-site.com/admin
```

### Low Risk (Won't Block):
```
https://google.com
https://github.com
```

## 🔍 Debug Mode

### Enable Detailed Logging:

**Edit `background.js`**, add at line 42:
```javascript
console.log('Checking URL:', url);
console.log('API Response:', data);
console.log('Risk Score:', data.data?.risk_score);
```

**Then**:
1. Reload extension
2. Visit a URL
3. Check console for detailed logs

## ✅ Verification Steps

### 1. Check Extension Popup
- Click ZYNTRIX icon
- Should show "Protection Active"
- Toggle should be ON

### 2. Check Console on Any Page
- Press F12
- Should see "ZYNTRIX Shield Active"

### 3. Check Network Tab
- Press F12 → Network tab
- Visit a URL
- Look for POST request to `localhost:8000/api/analyze/url`
- Check response

### 4. Test Blocking
- Lower threshold to 0 (blocks everything)
- Visit google.com
- Should see warning overlay
- If yes: Extension works! Just need higher-risk URLs
- If no: Check console for errors

## 🚨 Most Common Issue

**90% of the time**: The URLs being tested have risk scores **< 60**, so they're not blocked.

**Solution**: 
- Test with higher-risk URLs
- OR lower the threshold temporarily
- OR check what score your test URLs are getting

## 📞 Still Not Working?

If none of this helps, check:

1. **Browser Console Errors**: Any red errors?
2. **Extension Console**: Right-click extension → Inspect → Check for errors
3. **Backend Logs**: Check terminal running backend for errors
4. **Manifest Permissions**: Verify all permissions are granted

---

**Quick Fix**: Lower threshold to 30 or even 0 for testing, then you'll see it block!
