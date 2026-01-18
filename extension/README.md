# 🛡️ ZYNTRIX Browser Extension

**Real-Time Cyber Safety Shield** - AI-powered protection against phishing, scams, and social engineering attacks.

## ✨ Features

### 🚫 Real-Time Threat Blocking
- **Pre-Navigation Analysis**: URLs are analyzed BEFORE you visit them
- **Automatic Blocking**: Dangerous sites are blocked instantly
- **Smart Warnings**: Suspicious sites trigger contextual warnings
- **Override Options**: You can proceed with confirmation if needed

### 🔗 Link Click Protection
- Monitors all external link clicks
- Analyzes links before navigation
- Shows inline warnings for suspicious links
- Prevents accidental clicks on dangerous URLs

### 📝 Form Submission Monitoring
- Intercepts form submissions before data is sent
- Warns about suspicious forms
- Prevents credential harvesting
- Requires confirmation for high-risk submissions

### 📷 QR Code Detection
- Automatically detects QR codes on pages
- Visual indicators for potential QR codes
- Click-to-scan functionality
- Analyzes extracted URLs

### 💬 Fake Support Chat Detection
- Monitors chat widgets for suspicious patterns
- Detects urgency tactics
- Warns about potential impersonation
- Identifies social engineering attempts

### 📊 Statistics & Analytics
- Track threats blocked today/week/total
- View scan history
- Monitor protection effectiveness
- Export reports

### ⚙️ Customizable Settings
- Adjustable risk thresholds
- Whitelist/blacklist management
- Auto-block toggle
- Protection sensitivity control

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle the switch in the top-right corner

3. **Load Extension**
   - Click "Load unpacked"
   - Navigate to the `extension` folder in your ZYNTRIX project
   - Select the folder

4. **Verify Installation**
   - You should see the ZYNTRIX shield icon in your toolbar
   - Click it to see the protection status

### Method 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store soon!

## 📖 Usage

### Basic Protection

1. **Automatic Protection**
   - The extension automatically protects you while browsing
   - No configuration needed for basic protection
   - Badge shows current page risk level:
     - ✓ (Green) = Safe
     - ⚠ (Yellow) = Suspicious
     - ✗ (Red) = Dangerous

2. **Manual Scan**
   - Click the extension icon
   - Click "Rescan Page" to re-analyze current site
   - Or press `Ctrl+Shift+S` (Cmd+Shift+S on Mac)

### Managing Whitelist/Blacklist

1. **Add to Whitelist**
   - Visit a site you trust
   - Click the extension icon
   - Click "Trust This Site"
   - Site will never be blocked again

2. **Add to Blacklist**
   - Visit a site you want to block
   - Click the extension icon
   - Click "Block This Site"
   - Site will always be blocked

3. **View/Edit Lists**
   - Click extension icon
   - Click "Settings" button
   - Scroll to whitelist/blacklist section
   - Remove entries as needed

### Adjusting Protection Level

1. **Open Settings**
   - Click extension icon
   - Click "Settings" button

2. **Configure Thresholds**
   - **Block Threshold**: Sites with risk score ≥ this value are blocked (default: 70)
   - **Warn Threshold**: Sites with risk score ≥ this value show warnings (default: 40)
   - **Auto-Block**: Toggle automatic blocking on/off

3. **Save Settings**
   - Click "Save Settings"
   - Changes take effect immediately

## 🎯 How It Works

### 1. Pre-Navigation Analysis
```
User clicks link → Extension intercepts → Analyzes URL → Decision
                                                          ↓
                                            Block / Warn / Allow
```

### 2. Multi-Layer Detection
- **URL Structure Analysis**: Checks for suspicious patterns
- **Domain Reputation**: Verifies domain trustworthiness
- **Content Inspection**: Analyzes page content
- **Behavioral Patterns**: Detects social engineering tactics
- **Threat Intelligence**: Cross-references known threats

### 3. Smart Caching
- Results are cached for 1 hour
- Reduces API calls
- Faster subsequent visits
- Automatic cache expiry

## 🔧 Configuration

### Backend Connection

The extension connects to the ZYNTRIX backend API at:
```
http://localhost:8000
```

Make sure the backend is running:
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload
```

### Permissions Explained

The extension requires these permissions:

- **activeTab**: Access current tab information
- **storage**: Save settings and cache
- **tabs**: Monitor tab navigation
- **webRequest**: Intercept network requests
- **webNavigation**: Monitor navigation events
- **notifications**: Show threat alerts
- **declarativeNetRequest**: Block dangerous requests
- **<all_urls>**: Analyze any website

## 🎨 UI Components

### Warning Overlays

1. **Full-Page Block**
   - Shown for dangerous sites (risk ≥ 70)
   - Cannot be dismissed easily
   - Requires explicit confirmation to proceed
   - Shows detailed threat information

2. **Inline Warnings**
   - Shown for suspicious links
   - Non-intrusive
   - Click for details
   - Can be dismissed

3. **Form Warnings**
   - Shown before form submission
   - Asks for confirmation
   - Shows form details
   - Allows cancel or proceed

### Popup Interface

- **Status Card**: Current page risk level
- **Statistics**: Today's protection stats
- **Quick Actions**: Rescan, whitelist, blacklist
- **Quick Links**: Dashboard, settings, history
- **Settings Panel**: Configure protection

## 🔍 Keyboard Shortcuts

- **Ctrl+Shift+S** (Cmd+Shift+S): Scan current page
- More shortcuts coming soon!

## 🐛 Troubleshooting

### Extension Not Working

1. **Check Backend**
   - Ensure backend is running on port 8000
   - Test: `curl http://localhost:8000/api/health`

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click reload icon on ZYNTRIX extension

3. **Check Console**
   - Right-click extension icon → Inspect popup
   - Check for errors in console

### False Positives

If a safe site is being blocked:

1. **Add to Whitelist**
   - Click extension icon
   - Click "Trust This Site"

2. **Adjust Threshold**
   - Open settings
   - Increase block threshold
   - Save settings

3. **Report Issue**
   - Use the feedback form in dashboard
   - Help improve detection accuracy

### Performance Issues

If the extension is slow:

1. **Clear Cache**
   - Open settings
   - Click "Clear Cache"

2. **Reduce Sensitivity**
   - Lower the warn threshold
   - Fewer warnings = faster browsing

3. **Check Network**
   - Ensure stable connection to backend
   - Check backend response times

## 📊 Statistics

View detailed statistics in the main dashboard:
- Total threats blocked
- Threats by type (phishing, malware, scam)
- Trends over time
- Most targeted sites
- Protection effectiveness

## 🔐 Privacy

- **No Data Collection**: We don't collect your browsing history
- **Local Processing**: Most analysis happens locally
- **Secure Communication**: All API calls use HTTPS (in production)
- **No Tracking**: No analytics or tracking scripts
- **Your Data**: You control whitelist/blacklist data

## 🤝 Contributing

Found a bug or have a feature request?
1. Open an issue in the main ZYNTRIX repository
2. Submit a pull request
3. Contact the development team

## 📝 Version History

### v2.0.0 (Current)
- ✅ Real-time threat interception
- ✅ Form submission monitoring
- ✅ Link click protection
- ✅ QR code detection
- ✅ Fake support chat detection
- ✅ Enhanced popup with statistics
- ✅ Customizable settings
- ✅ Whitelist/blacklist management

### v1.0.0
- Basic URL scanning
- Simple notifications
- Badge indicators

## 📞 Support

- **Dashboard**: http://localhost:3000/dashboard
- **Documentation**: See main ZYNTRIX README
- **Issues**: GitHub Issues
- **Email**: support@zyntrix.com (coming soon)

## ⚖️ License

Part of the ZYNTRIX Cyber Safety Platform
See main project LICENSE file

---

**🛡️ Stay Safe Online with ZYNTRIX!**
