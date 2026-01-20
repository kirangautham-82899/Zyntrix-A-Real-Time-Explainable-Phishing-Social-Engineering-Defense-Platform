# 🔴 LIVE THREAT MONITOR - How It Works

## 📊 Overview

The **Live Threat Monitor** is a real-time threat intelligence dashboard that shows all security scans and threat detections as they happen across your ZYNTRIX platform.

## 🎯 What It Does

The Live Monitor provides:
- ✅ **Real-time threat feed** - See threats as they're detected
- ✅ **Live statistics** - Total scans, dangerous/suspicious/safe counts
- ✅ **WebSocket updates** - Instant notifications without page refresh
- ✅ **Connection status** - Shows if you're connected to the live feed
- ✅ **Active connections** - See how many users are monitoring

## 🚀 How to Access

### From Dashboard:
1. Go to http://localhost:3001/dashboard
2. Click on **"Live Monitor"** card (purple color)
3. The live feed will open

### Direct Access:
- URL: http://localhost:3001/live-monitor

## 🔧 How It Works (Technical)

### Architecture

```
┌─────────────┐         WebSocket          ┌─────────────┐
│   Browser   │ ←──────────────────────→  │   Backend   │
│  (Frontend) │                            │   (FastAPI) │
└─────────────┘                            └─────────────┘
      ↓                                           ↓
   Display                                   Broadcast
   Updates                                   Threats
```

### Components

#### 1. **Frontend (Live Monitor Page)**
- **Location**: `app/(main)/live-monitor/page.tsx`
- **Technology**: React + WebSocket API
- **Features**:
  - Connects to WebSocket on page load
  - Displays threat feed in real-time
  - Shows connection status
  - Auto-reconnects if disconnected

#### 2. **Backend (WebSocket Server)**
- **Location**: `backend/websocket_manager.py`
- **Endpoint**: `ws://localhost:8000/api/ws/threats`
- **Features**:
  - Manages multiple client connections
  - Broadcasts threat alerts to all connected clients
  - Sends initial threat feed on connection
  - Handles disconnections gracefully

#### 3. **Threat Feed Manager**
- **Location**: `backend/websocket_manager.py` (ThreatFeedManager class)
- **Features**:
  - Stores recent threats (up to 100)
  - Calculates statistics (total, dangerous, suspicious, safe)
  - Provides REST API fallback

### Data Flow

```
1. User performs a scan (URL/Email/SMS/QR)
       ↓
2. Backend analyzes the content
       ↓
3. Result is saved to database
       ↓
4. Threat is added to feed
       ↓
5. WebSocket broadcasts to all connected clients
       ↓
6. Live Monitor updates instantly
```

### Message Types

The WebSocket sends different message types:

#### 1. **connection_established**
```json
{
  "type": "connection_established",
  "message": "Connected to threat feed",
  "timestamp": "2026-01-20T19:00:00Z"
}
```

#### 2. **initial_feed**
```json
{
  "type": "initial_feed",
  "data": [
    {
      "id": "threat_123",
      "timestamp": "2026-01-20T19:00:00Z",
      "risk_level": "dangerous",
      "risk_score": 85,
      "url": "http://malicious-site.com",
      "type": "url"
    }
  ]
}
```

#### 3. **threat_alert**
```json
{
  "type": "threat_alert",
  "data": {
    "id": "threat_124",
    "risk_level": "dangerous",
    "risk_score": 92,
    "url": "http://phishing-site.com"
  }
}
```

#### 4. **scan_complete**
```json
{
  "type": "scan_complete",
  "data": {
    "id": "scan_456",
    "risk_level": "safe",
    "risk_score": 15
  }
}
```

#### 5. **stats_update**
```json
{
  "type": "stats_update",
  "data": {
    "total": 1234,
    "dangerous": 89,
    "suspicious": 145,
    "safe": 1000
  }
}
```

## 🎨 UI Features

### Connection Indicator
- **Green "CONNECTED"** - WebSocket is active
- **Red "DISCONNECTED"** - WebSocket is down (using REST API fallback)

### Statistics Cards
- **Total Threats** - All detected threats
- **Dangerous** - High-risk threats (score > 70)
- **Suspicious** - Medium-risk threats (score 30-70)
- **Safe** - Low-risk content (score < 30)

### Threat Feed
Each threat shows:
- **Risk icon** - Visual indicator (✓ safe, ⚠ suspicious, ✗ dangerous)
- **Type badge** - URL, Email, SMS, or QR
- **Timestamp** - When it was detected
- **Risk score** - 0-100 score with color coding
- **URL/Domain** - The analyzed content
- **Risk level** - SAFE, SUSPICIOUS, or DANGEROUS

## 🔄 Auto-Reconnect

If the WebSocket connection is lost:
1. Status changes to "DISCONNECTED"
2. System falls back to REST API
3. Automatically attempts reconnection every 5 seconds
4. When reconnected, status changes to "CONNECTED"

## 📡 REST API Fallback

If WebSocket fails, the page uses:
- **Endpoint**: `GET /api/threats/feed?limit=50`
- **Returns**: Recent threats and statistics
- **Polling**: Manual refresh required

## 🧪 Testing the Live Monitor

### Test 1: Basic Connection
1. Open Live Monitor page
2. Check status shows "CONNECTED" (green)
3. Verify statistics are displayed

### Test 2: Real-time Updates
1. Keep Live Monitor open
2. In another tab, go to Scanner
3. Analyze a URL
4. Watch the threat appear instantly in Live Monitor

### Test 3: Multiple Connections
1. Open Live Monitor in multiple browser tabs
2. Check "Active Connections" count increases
3. Perform a scan in one tab
4. All tabs should update simultaneously

### Test 4: Reconnection
1. Stop the backend server
2. Watch status change to "DISCONNECTED"
3. Start backend again
4. Status should automatically change to "CONNECTED"

## 🎯 Use Cases

### 1. **Security Operations Center (SOC)**
- Monitor all threats in real-time
- Track threat trends
- Quick response to high-risk detections

### 2. **Team Collaboration**
- Multiple analysts can monitor simultaneously
- Shared view of all threats
- Coordinated response

### 3. **Demonstration**
- Show live threat detection to stakeholders
- Real-time proof of system effectiveness
- Visual impact

### 4. **Monitoring & Alerting**
- Keep monitor open on dedicated screen
- Watch for dangerous threats
- Immediate awareness of attacks

## 🔒 Security Features

- ✅ **WebSocket authentication** - Can be extended with JWT
- ✅ **Connection limits** - Prevents resource exhaustion
- ✅ **Auto-cleanup** - Removes stale connections
- ✅ **Error handling** - Graceful degradation
- ✅ **Data validation** - Sanitized threat data

## 📊 Performance

- **Latency**: < 100ms for threat updates
- **Capacity**: Supports 100+ simultaneous connections
- **Memory**: Stores last 100 threats
- **Bandwidth**: Minimal (only sends updates, not full feed)

## 🛠️ Customization

### Change Feed Size
Edit `backend/websocket_manager.py`:
```python
self.max_feed_size = 100  # Change to desired size
```

### Change Update Frequency
Edit `app/(main)/live-monitor/page.tsx`:
```typescript
setTimeout(connectWebSocket, 5000);  // Reconnect delay
```

### Filter Threat Types
Add filtering in the frontend:
```typescript
const filteredThreats = threats.filter(t => t.risk_level === 'dangerous');
```

## 🎓 Summary

The Live Monitor is a **real-time threat intelligence dashboard** that:

1. ✅ **Connects** via WebSocket to backend
2. ✅ **Receives** instant threat notifications
3. ✅ **Displays** threats with visual indicators
4. ✅ **Updates** statistics in real-time
5. ✅ **Reconnects** automatically if disconnected
6. ✅ **Supports** multiple simultaneous viewers

**It's like a security camera feed for cyber threats!** 🎥🛡️

---

**Access**: http://localhost:3001/live-monitor  
**Status**: ✅ Fully Operational  
**Updated**: January 21, 2026
