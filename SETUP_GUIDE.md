# 🛡️ ZYNTRIX - Real-Time Explainable Phishing & Social Engineering Defense Platform

## 📋 Project Overview

ZYNTRIX is an AI-powered cybersecurity platform that provides real-time threat detection and analysis for:
- 🔗 **URL Analysis** - Detect phishing and malicious websites
- 📧 **Email Analysis** - Identify phishing emails and social engineering attempts
- 📱 **SMS Analysis** - Detect scam messages and fraudulent texts
- 📷 **QR Code Analysis** - Scan QR codes for embedded threats

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (for backend)
- **npm** or **yarn** (package manager)

### Installation Steps

#### 1. Install Frontend Dependencies

```bash
npm install
```

#### 2. Install Backend Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

A `.env` file has been created in the root directory with default settings. The application will run in **offline mode** without MongoDB/Redis.

**Optional Services** (for enhanced features):
- **MongoDB** - For persistent storage of scan history and user data
- **Redis** - For caching and improved performance
- **Threat Intelligence APIs** - For enhanced threat detection

To enable these services, edit the `.env` file and add your credentials.

### Running the Project

#### Option 1: Run Both Services Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
./start_backend.sh
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Manual Start

**Backend:**
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Alternative API Docs**: http://localhost:8000/api/redoc

## 📁 Project Structure

```
Zyntrix/
├── app/                    # Next.js frontend pages
├── components/             # React components
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main API server
│   ├── url_analyzer.py   # URL threat detection
│   ├── email_analyzer.py # Email phishing detection
│   ├── sms_analyzer.py   # SMS scam detection
│   ├── qr_analyzer.py    # QR code analysis
│   ├── ml_models.py      # Machine learning models
│   └── requirements.txt  # Python dependencies
├── browser-extension/     # Chrome/Firefox extension
├── public/               # Static assets
├── .env                  # Environment configuration
└── package.json          # Node.js dependencies
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# JWT Authentication
JWT_SECRET_KEY=zyntrix-dev-secret-key-change-in-production-12345

# MongoDB (Optional - runs in offline mode if not configured)
# MONGODB_URL=mongodb://localhost:27017/zyntrix

# Redis (Optional - caching disabled if not configured)
# REDIS_URL=redis://localhost:6379

# Threat Intelligence APIs (Optional)
THREAT_INTEL_ENABLED=false
# VIRUSTOTAL_API_KEY=your_api_key
# GOOGLE_SAFE_BROWSING_API_KEY=your_api_key

# Backend Configuration
BACKEND_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### QR Code Scanner Not Working

The QR code scanner requires the `zbar` library. If you see a warning about pyzbar:

**macOS:**
```bash
brew install zbar
```

**Ubuntu/Debian:**
```bash
sudo apt-get install libzbar0
```

**Windows:**
Download from: http://zbar.sourceforge.net/

### Port Already in Use

If port 8000 or 3000 is already in use:

**Kill process on port 8000:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Kill process on port 3000:**
```bash
lsof -ti:3000 | xargs kill -9
```

### MongoDB/Redis Connection Issues

The application is designed to run in **offline mode** if MongoDB or Redis are not available. You'll see warnings in the console, but the app will function normally with in-memory storage.

To enable full features:
1. Install MongoDB and Redis locally, OR
2. Use cloud services (MongoDB Atlas, Redis Cloud)
3. Update the `.env` file with connection URLs

### Python Virtual Environment Issues

If you encounter permission errors with the virtual environment:

```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🌟 Features

### Core Features
- ✅ Real-time URL threat analysis
- ✅ Email phishing detection
- ✅ SMS scam identification
- ✅ QR code security scanning
- ✅ Explainable AI results
- ✅ Risk scoring (0-100)
- ✅ Detailed threat analysis

### Advanced Features
- 🔐 JWT-based authentication
- 📊 Analytics dashboard
- 📜 Scan history tracking
- 🌐 WebSocket real-time updates
- 🎯 Behavioral analysis
- 🚨 Threat intelligence integration
- 🔌 Browser extension support
- 📱 Mobile SDK ready

## 🧪 Testing

### Test Backend API

```bash
curl http://localhost:8000/api/health
```

### Test URL Analysis

```bash
curl -X POST http://localhost:8000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Demo Login Credentials (Offline Mode)

When MongoDB is not configured, use these demo credentials:
- **Email**: admin@zyntrix.com
- **Password**: admin123

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔒 Security Notes

- Change the `JWT_SECRET_KEY` in production
- Never commit `.env` files to version control
- Use HTTPS in production
- Implement rate limiting for public APIs
- Regularly update dependencies

## 📝 Development

### Frontend Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

### Backend Development
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload  # Auto-reload on changes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a hackathon submission.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are installed correctly
4. Verify the `.env` file configuration

## ✅ Current Status

- ✅ Frontend: Fully functional
- ✅ Backend: Fully functional (offline mode)
- ✅ URL Analysis: Working
- ✅ Email Analysis: Working
- ✅ SMS Analysis: Working
- ⚠️ QR Analysis: Requires zbar library installation
- ⚠️ MongoDB: Optional (offline mode enabled)
- ⚠️ Redis: Optional (caching disabled)

---

**Made with ❤️ for cybersecurity**
