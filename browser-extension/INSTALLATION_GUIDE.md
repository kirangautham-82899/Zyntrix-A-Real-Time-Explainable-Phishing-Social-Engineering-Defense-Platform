# 🛡️ ZYNTRIX Browser Extension - Installation & Testing Guide

## 📋 Overview

The ZYNTRIX Real-Time Shield is a browser extension that provides real-time protection against phishing and malicious websites. It monitors every URL you visit and blocks dangerous sites before they can harm you.

## ✨ Features

- ✅ **Real-time URL Scanning** - Every page is checked against ZYNTRIX's threat detection engine
- ✅ **Instant Blocking** - Dangerous sites are blocked with a full-screen warning
- ✅ **Risk Scoring** - Each URL gets a risk score (0-100)
- ✅ **Toggle Protection** - Easy on/off switch in the popup
- ✅ **Beautiful UI** - Modern, cybersecurity-themed interface
- ✅ **Lightweight** - Minimal performance impact

## 🚀 Installation Instructions

### For Google Chrome

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions
   ```
   Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `browser-extension` folder:
     ```
     /Users/kirangautham82899/Zyntrix-A-Real-Time-Explainable-Phishing-Social-Engineering-Defense-Platform/browser-extension
     ```

4. **Verify Installation**
   - You should see "ZYNTRIX Real-Time Shield" in your extensions list
   - The ZYNTRIX icon should appear in your toolbar

### For Microsoft Edge

1. **Open Edge Extensions Page**
   ```
   edge://extensions
   ```
   Or: Menu → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the left sidebar or bottom-left

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder

4. **Verify Installation**
   - Extension should appear in your toolbar

### For Firefox (Temporary Installation)

1. **Open Firefox Add-ons Debug Page**
   ```
   about:debugging#/runtime/this-firefox
   ```

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on"
   - Navigate to the `browser-extension` folder
   - Select the `manifest.json` file

**Note**: Firefox requires Manifest V2 for permanent installation. The current extension uses Manifest V3 (Chrome/Edge compatible).

## 🔧 Configuration

### Backend Connection

The extension is pre-configured to connect to:
```
http://localhost:8000/api/analyze/url
```

**Important**: Make sure your ZYNTRIX backend is running before using the extension!

To start the backend:
```bash
cd backend
./start_backend.sh
```

### Changing the API URL

If your backend is running on a different port or server, edit `background.js`:

```javascript
const API_URL = 'http://your-server:port/api/analyze/url';
```

Then reload the extension in your browser.

## 🧪 Testing the Extension

### Test 1: Verify Extension is Active

1. Click the ZYNTRIX icon in your toolbar
2. You should see the popup with:
   - ZYNTRIX logo
   - "Protection Active" status
   - "Real-time Monitoring" toggle (should be ON)

### Test 2: Check Backend Connection

1. Open your browser's Developer Console (F12)
2. Go to the "Console" tab
3. Visit any website
4. You should see: `ZYNTRIX Shield Active`
5. Check the Network tab for requests to `localhost:8000`

### Test 3: Test with Safe URL

1. Visit a known safe website (e.g., https://google.com)
2. The page should load normally
3. No warning should appear

### Test 4: Test with Suspicious URL

The extension blocks sites with a risk score > 60. To test:

1. **Option A**: Visit a URL with suspicious patterns:
   - URLs with IP addresses
   - URLs with many subdomains
   - URLs with suspicious keywords

2. **Option B**: Temporarily modify the threshold in `background.js`:
   ```javascript
   // Change line 60 from:
   if (data.data && data.data.risk_score > 60) {
   // To:
   if (data.data && data.data.risk_score > 0) {
   ```
   This will block almost any URL for testing purposes.

3. **Expected Result**: You should see a full-screen warning overlay with:
   - ⚠️ Warning icon
   - "ZYNTRIX BLOCKED THIS SITE" message
   - Risk score display
   - "Back to Safety" button
   - "Proceed Anyway (Unsafe)" button

### Test 5: Toggle Protection

1. Click the ZYNTRIX icon
2. Toggle "Real-time Monitoring" OFF
3. Visit any website - it should load without checks
4. Toggle it back ON
5. Protection should resume

## 📊 How It Works

### Architecture

```
Browser → Content Script → Background Worker → ZYNTRIX API → Response
                ↓
         Warning Overlay (if dangerous)
```

### Components

1. **manifest.json** - Extension configuration and permissions
2. **background.js** - Service worker that handles URL checks
3. **content.js** - Injected into pages to show warnings
4. **content.css** - Styles for the warning overlay
5. **popup.html/js** - Extension popup interface
6. **icons/** - Extension icons (16px, 48px, 128px)

### Risk Thresholds

- **Safe**: Risk score 0-30
- **Suspicious**: Risk score 31-60
- **Dangerous**: Risk score 61-100 (BLOCKED)

You can adjust the threshold in `background.js` line 60.

## 🐛 Troubleshooting

### Extension Not Working

**Problem**: Extension icon appears but doesn't work

**Solutions**:
1. Check if backend is running: `curl http://localhost:8000/api/health`
2. Open Developer Tools (F12) → Console tab
3. Look for error messages
4. Reload the extension: Go to extensions page → Click reload icon

### "API Error" in Console

**Problem**: Extension can't connect to backend

**Solutions**:
1. Verify backend is running on port 8000
2. Check `background.js` has correct API_URL
3. Check browser console for CORS errors
4. Ensure backend CORS allows `chrome-extension://` origins

### Warning Not Showing

**Problem**: Dangerous sites load without warning

**Solutions**:
1. Check if "Real-time Monitoring" is ON in popup
2. Verify the URL's risk score is > 60
3. Check browser console for errors
4. Reload the page

### Extension Disappeared After Browser Restart

**Problem**: Extension not showing after closing browser

**Solutions**:
- **Chrome/Edge**: Extensions loaded via "Load unpacked" persist
- **Firefox**: Temporary add-ons are removed on restart
  - You need to reload it each time
  - Or package it as an XPI for permanent installation

## 🔒 Security & Privacy

### What Data is Collected?

- ✅ URLs you visit (sent to local backend only)
- ✅ Risk scores and analysis results
- ❌ NO personal information
- ❌ NO browsing history stored
- ❌ NO data sent to external servers (unless you configure external APIs)

### Permissions Explained

- **tabs**: To monitor URL changes
- **scripting**: To inject warning overlays
- **storage**: To save your protection on/off preference
- **host_permissions**: To analyze all URLs and connect to backend

## 📝 Customization

### Change Warning Threshold

Edit `background.js` line 60:
```javascript
if (data.data && data.data.risk_score > YOUR_THRESHOLD) {
```

### Customize Warning UI

Edit `content.css` to change colors, fonts, animations

### Add Whitelist

Add to `background.js`:
```javascript
const whitelist = ['google.com', 'github.com'];
if (whitelist.some(domain => url.includes(domain))) {
    sendResponse({ status: 'safe', score: 0 });
    return;
}
```

### Skip Localhost

Already implemented! The extension skips:
- `chrome://` and `edge://` pages
- `about:` pages
- `localhost:3000` (frontend)

## 📦 Distribution

### For Personal Use
- Keep using "Load unpacked" method
- Extension will persist in Chrome/Edge

### For Team/Organization
1. Package the extension as a ZIP file
2. Share with team members
3. They can load it using "Load unpacked"

### For Public Release
1. Create a developer account:
   - Chrome Web Store: https://chrome.google.com/webstore/devconsole
   - Edge Add-ons: https://partner.microsoft.com/dashboard
2. Package and submit for review
3. Wait for approval (usually 1-3 days)

## ✅ Extension Status

- ✅ **Manifest V3** - Latest standard
- ✅ **Chrome Compatible** - Fully tested
- ✅ **Edge Compatible** - Fully tested
- ⚠️ **Firefox** - Requires Manifest V2 conversion
- ✅ **Icons** - All sizes included
- ✅ **Backend Integration** - Working
- ✅ **Real-time Protection** - Active
- ✅ **UI/UX** - Polished and professional

## 🎯 Next Steps

1. **Install the extension** using instructions above
2. **Start the backend** server
3. **Test** with various URLs
4. **Customize** thresholds if needed
5. **Share** with your team

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify backend is running and accessible
4. Check `background.js` configuration

---

**Made with ❤️ for cybersecurity**

**Extension Version**: 1.0  
**Last Updated**: January 21, 2026
