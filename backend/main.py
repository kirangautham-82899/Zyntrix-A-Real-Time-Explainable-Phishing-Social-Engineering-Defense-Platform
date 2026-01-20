from fastapi import FastAPI, HTTPException, Request, Depends, BackgroundTasks, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from url_analyzer import url_analyzer
from email_analyzer import email_analyzer
from sms_analyzer import sms_analyzer
from qr_analyzer import qr_analyzer
from ml_models import ml_classifier
from database import database
from cache import cache
from validation import validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from auth import (
    get_current_user, create_access_token, create_refresh_token,
    verify_password, get_password_hash, decode_token,
    UserCreate, UserLogin, Token, TokenData
)
from models import User
from admin_api import router as admin_router
from bson import ObjectId
from behavioral_analyzer import behavioral_analyzer
from websocket_manager import manager as ws_manager, threat_feed
from blocking_policy import blocking_policy

# Load environment variables
load_dotenv()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="ZYNTRIX API",
    description="Real-Time Cyber Safety Platform - AI-powered phishing and social engineering detection",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Mount admin router
app.include_router(admin_router)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration for Next.js
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",  # For production deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database lifecycle events
@app.on_event("startup")
async def startup_db():
    """Connect to MongoDB on startup"""
    await database.connect_db()

@app.on_event("shutdown")
async def shutdown_db():
    """Close MongoDB connection on shutdown"""
    await database.close_db()

# Request/Response Models
class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str
    version: str
    services: dict

class APIResponse(BaseModel):
    success: bool
    message: str
    data: dict = None

class URLAnalysisRequest(BaseModel):
    url: str

class EmailAnalysisRequest(BaseModel):
    email_content: str
    sender_email: str = None

class SMSAnalysisRequest(BaseModel):
    sms_content: str
    sender_number: str = None

class URLAnalysisResponse(BaseModel):
    success: bool
    data: dict
    timestamp: str

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "ZYNTRIX API",
        "version": "2.0.0",
        "description": "Real-Time Cyber Safety Platform",
        "endpoints": {
            "health": "/api/health",
            "docs": "/api/docs",
            "redoc": "/api/redoc",
            "auth": {
                "register": "/api/auth/register",
                "login": "/api/auth/login",
                "me": "/api/auth/me"
            },
            "analysis": {
                "url": "/api/analyze/url",
                "email": "/api/analyze/email",
                "sms": "/api/analyze/sms",
                "qr": "/api/analyze/qr"
            },
            "admin": "/api/admin/*"
        }
    }

# Health check endpoint
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify API status and service connections"""
    mongodb_status = "connected" if os.getenv("MONGODB_URL") else "not configured"
    redis_status = "connected" if os.getenv("REDIS_URL") else "not configured"
    
    return HealthResponse(
        status="healthy",
        message="ZYNTRIX API is running successfully",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
        services={
            "mongodb": "connected" if database.db is not None else "disconnected",
            "redis": "connected" if cache.connected else "disconnected",
            "ml_engine": "ready"
        }
    )

# API Info endpoint
@app.get("/api/info")
async def api_info():
    """Get API information and available endpoints"""
    return {
        "api_name": "ZYNTRIX",
        "version": "1.0.0",
        "description": "AI-powered threat detection for URLs, emails, SMS, and QR codes",
        "features": [
            "URL Analysis",
            "Email Analysis", 
            "SMS Analysis",
            "QR Code Analysis",
            "Risk Scoring",
            "Explainable AI"
        ],
        "endpoints": {
            "health": "/api/health",
            "analyze_url": "/api/analyze/url",
            "analyze_email": "/api/analyze/email (coming soon)",
            "analyze_sms": "/api/analyze/sms (coming soon)"
        }
    }

# Test endpoint
@app.get("/api/test")
async def test_connection():
    """Test endpoint to verify frontend-backend connection"""
    return {
        "success": True,
        "message": "Connection successful! Frontend can communicate with backend.",
        "timestamp": datetime.utcnow().isoformat()
    }

# URL Analysis endpoint
@app.post("/api/analyze/url")
@limiter.limit("10/minute")
async def analyze_url(request: Request, url_request: URLAnalysisRequest):
    """
    Analyze URL for phishing and malicious patterns
    
    Rate Limited: 10 requests per minute per IP
    
    Returns:
    - risk_score: 0-100 (0=safe, 100=dangerous)
    - risk_level: safe, suspicious, or dangerous
    - factors: List of detection factors
    - detailed analysis results
    """
    try:
        # Validate input
        is_valid, error_msg = validator.validate_url(url_request.url)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Sanitize URL
        sanitized_url = validator.sanitize_string(url_request.url, validator.MAX_URL_LENGTH)
        
        # Check cache first
        cache_key = cache.generate_cache_key('url', sanitized_url)
        cached_result = cache.get(cache_key)
        
        if cached_result:
            # Return cached result
            return {
                "success": True,
                "data": cached_result,
                "timestamp": datetime.utcnow().isoformat(),
                "cached": True
            }
        
        # Analyze the URL
        result = url_analyzer.analyze(sanitized_url)
        
        if not result['valid']:
            raise HTTPException(status_code=400, detail=result.get('error', 'Invalid URL'))
        
        # Format response
        response_data = {
            'url': result['url'],
            'domain': result['domain'],
            'risk_score': result['risk_score'],
            'risk_level': result['risk_level'],
            'classification': result['risk_level'].upper(),
            'explanation': _generate_explanation(result),
            'factors': result['factors'],
            'recommendations': _generate_recommendations(result['risk_level']),
            'analysis_details': {
                'domain_analysis': result['domain_analysis'],
                'pattern_analysis': result['pattern_analysis'],
                'structure_analysis': result['structure_analysis']
            }
        }
        
        # Add to threat feed for live monitor
        threat_entry = threat_feed.add_threat({
            'type': 'url',
            'url': result['url'],
            'domain': result['domain'],
            'risk_score': result['risk_score'],
            'risk_level': result['risk_level']
        })
        
        # Broadcast to WebSocket clients if high risk
        if result['risk_score'] > 60:
            await ws_manager.broadcast_threat_alert(threat_entry)
        else:
            # Send scan completion update
            await ws_manager.broadcast({
                'type': 'scan_complete',
                'timestamp': datetime.utcnow().isoformat(),
                'data': threat_entry
            })
        
        return URLAnalysisResponse(
            success=True,
            data=response_data,
            timestamp=datetime.utcnow().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def _generate_explanation(result: dict) -> str:
    """Generate human-readable explanation"""
    risk_level = result['risk_level']
    score = result['risk_score']
    
    if risk_level == 'safe':
        return f"This URL appears safe with a low risk score of {score}/100. No significant malicious patterns were detected."
    elif risk_level == 'suspicious':
        return f"This URL shows suspicious characteristics with a risk score of {score}/100. Exercise caution and verify the source."
    else:
        return f"This URL is highly suspicious with a risk score of {score}/100. Multiple red flags indicate potential phishing or malicious intent."

def _generate_recommendations(risk_level: str) -> list:
    """Generate recommendations based on risk level"""
    if risk_level == 'safe':
        return [
            "URL appears safe to visit",
            "Always verify the sender if received via email or message",
            "Keep your browser and security software updated"
        ]
    elif risk_level == 'suspicious':
        return [
            "Do not enter personal or financial information",
            "Verify the URL through official channels",
            "Check for spelling errors in the domain name",
            "Look for HTTPS and valid SSL certificate"
        ]
    else:
        return [
            "DO NOT visit this URL",
            "DO NOT enter any credentials or personal information",
            "Report this URL to your IT security team",
            "Delete any messages containing this URL",
            "Run a security scan if you've already visited"
        ]

# Email Analysis endpoint
@app.post("/api/analyze/email")
@limiter.limit("10/minute")
async def analyze_email(request: Request, email_request: EmailAnalysisRequest):
    """
    Analyze email for phishing patterns
    Rate Limited: 10 requests per minute per IP
    """
    try:
        # Validate input
        is_valid, error_msg = validator.validate_email_content(email_request.email_content, email_request.sender_email)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Sanitize inputs
        sanitized_content = validator.sanitize_string(email_request.email_content, validator.MAX_EMAIL_LENGTH)
        sanitized_sender = validator.sanitize_string(email_request.sender_email, validator.MAX_SENDER_LENGTH) if email_request.sender_email else None
        
        # Analyze the email
        result = email_analyzer.analyze(
            email_content=sanitized_content,
            sender_email=sanitized_sender
        )
        
        if not result['valid']:
            raise HTTPException(status_code=400, detail="Invalid email content")
        
        # Format response
        return {
            "success": True,
            "data": {
                'sender_email': result['sender_email'],
                'risk_score': result['risk_score'],
                'risk_level': result['risk_level'],
                'classification': result['risk_level'].upper(),
                'explanation': _generate_email_explanation(result),
                'factors': result['factors'],
                'recommendations': _generate_recommendations(result['risk_level']),
                'analysis_details': {
                    'sender_analysis': result['sender_analysis'],
                    'content_analysis': result['content_analysis'],
                    'keyword_analysis': result['keyword_analysis'],
                    'url_analysis': result['url_analysis']
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def _generate_email_explanation(result: dict) -> str:
    """Generate human-readable explanation for email"""
    risk_level = result['risk_level']
    score = result['risk_score']
    keyword_count = result['keyword_analysis']['total_suspicious']
    
    if risk_level == 'safe':
        return f"This email appears safe with a low risk score of {score}/100. No significant phishing indicators were detected."
    elif risk_level == 'suspicious':
        return f"This email shows suspicious characteristics with a risk score of {score}/100. Found {keyword_count} suspicious keywords. Exercise caution before responding or clicking links."
    else:
        return f"This email is highly suspicious with a risk score of {score}/100. Multiple red flags including {keyword_count} suspicious keywords indicate potential phishing or social engineering attack."

# SMS Analysis endpoint
@app.post("/api/analyze/sms")
@limiter.limit("10/minute")
async def analyze_sms(request: Request, sms_request: SMSAnalysisRequest):
    """
    Analyze SMS for scam patterns
    Rate Limited: 10 requests per minute per IP
    """
    try:
        # Validate input
        is_valid, error_msg = validator.validate_sms_content(sms_request.sms_content, sms_request.sender_number)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Sanitize inputs
        sanitized_content = validator.sanitize_string(sms_request.sms_content, validator.MAX_SMS_LENGTH)
        sanitized_sender = validator.sanitize_string(sms_request.sender_number, validator.MAX_SENDER_LENGTH) if sms_request.sender_number else None
        
        # Analyze the SMS
        result = sms_analyzer.analyze(
            sms_content=sanitized_content,
            sender_number=sanitized_sender
        )
        
        if not result['valid']:
            raise HTTPException(status_code=400, detail="Invalid SMS content")
        
        # Format response
        return {
            "success": True,
            "data": {
                'sender_number': result['sender_number'],
                'risk_score': result['risk_score'],
                'risk_level': result['risk_level'],
                'classification': result['risk_level'].upper(),
                'explanation': _generate_sms_explanation(result),
                'factors': result['factors'],
                'recommendations': _generate_recommendations(result['risk_level']),
                'analysis_details': {
                    'sender_analysis': result['sender_analysis'],
                    'content_analysis': result['content_analysis'],
                    'keyword_analysis': result['keyword_analysis'],
                    'url_analysis': result['url_analysis'],
                    'pattern_analysis': result['pattern_analysis']
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def _generate_sms_explanation(result: dict) -> str:
    """Generate human-readable explanation for SMS"""
    risk_level = result['risk_level']
    score = result['risk_score']
    keyword_count = result['keyword_analysis']['total_suspicious']
    scam_patterns = result['pattern_analysis']['scam_pattern_count']
    
    if risk_level == 'safe':
        return f"This SMS appears safe with a low risk score of {score}/100. No significant scam indicators were detected."
    elif risk_level == 'suspicious':
        return f"This SMS shows suspicious characteristics with a risk score of {score}/100. Found {keyword_count} suspicious keywords and {scam_patterns} scam pattern(s). Exercise caution before responding or clicking links."
    else:
        return f"This SMS is highly suspicious with a risk score of {score}/100. Multiple red flags including {keyword_count} suspicious keywords and {scam_patterns} scam pattern(s) indicate potential scam or social engineering attack."

# QR Code Analysis endpoint
@app.post("/api/analyze/qr")
@limiter.limit("10/minute")
async def analyze_qr(request: Request, file: UploadFile = File(...)):
    """
    Analyze QR code image for embedded URLs and threats
    Rate Limited: 10 requests per minute per IP
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file bytes
        image_bytes = await file.read()
        
        # Validate image
        is_valid, error_msg = qr_analyzer.validate_image(image_bytes)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Analyze QR code
        result = qr_analyzer.analyze(image_bytes)
        
        if not result['valid']:
            raise HTTPException(status_code=400, detail=result.get('error', 'QR code analysis failed'))
        
        # If no URL found in QR code
        if not result.get('url_found'):
            return {
                "success": True,
                "data": {
                    'qr_detected': result['qr_detected'],
                    'qr_data': result['qr_data'],
                    'url_found': False,
                    'message': result.get('message', 'QR code contains no URL'),
                    'risk_score': 0,
                    'risk_level': 'safe',
                    'classification': 'SAFE'
                },
                "timestamp": datetime.utcnow().isoformat()
            }
        
        # Format response with URL analysis
        return {
            "success": True,
            "data": {
                'qr_detected': result['qr_detected'],
                'qr_data': result['qr_data'],
                'url_found': True,
                'extracted_url': result['extracted_url'],
                'url': result['url'],
                'domain': result['domain'],
                'risk_score': result['risk_score'],
                'risk_level': result['risk_level'],
                'classification': result['classification'],
                'explanation': _generate_qr_explanation(result),
                'factors': result['factors'],
                'recommendations': _generate_recommendations(result['risk_level']),
                'analysis_details': result['analysis_details']
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR analysis failed: {str(e)}")


def _generate_qr_explanation(result: dict) -> str:
    """Generate human-readable explanation for QR code"""
    risk_level = result['risk_level']
    score = result['risk_score']
    url = result.get('extracted_url', 'unknown')
    
    if risk_level == 'safe':
        return f"This QR code contains a URL ({url}) that appears safe with a low risk score of {score}/100. No significant malicious patterns were detected."
    elif risk_level == 'suspicious':
        return f"This QR code contains a suspicious URL ({url}) with a risk score of {score}/100. Exercise caution before visiting this link."
    else:
        return f"This QR code contains a dangerous URL ({url}) with a risk score of {score}/100. Multiple red flags indicate potential phishing or malicious intent. DO NOT scan or visit this link."


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing = await database.db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        organization_id=user_data.organization_id
    )
    
    result = await database.db.users.insert_one(user.dict(by_alias=True))
    user_id = str(result.inserted_id)
    
    # Create tokens
    access_token = create_access_token(
        data={
            "sub": user_id,
            "email": user_data.email,
            "role": user_data.role,
            "organization_id": user_data.organization_id
        }
    )
    refresh_token = create_refresh_token(
        data={"sub": user_id}
    )
    
    # Log event
    await database.log_event({
        "event_type": "user_register",
        "user_id": user_id,
        "details": {"email": user_data.email}
    })
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token
    )

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin, background_tasks: BackgroundTasks):
    """Login user and return JWT tokens"""
    # Trigger behavioral analysis
    # Note: user_id is not available until we find the user, so we'll do it after finding user
    # Logic continues below...
    # Fallback for when Database is offline (Demo Mode)
    if database.db is None:
        if credentials.email == "admin@zyntrix.com" and credentials.password == "admin123":
            user_id = "demo_admin_id"
            access_token = create_access_token(
                data={
                    "sub": user_id,
                    "email": credentials.email,
                    "role": "admin",
                    "organization_id": "demo_org"
                }
            )
            return Token(
                access_token=access_token,
                token_type="bearer",
                refresh_token="demo_refresh_token"
            )
        else:
             raise HTTPException(
                status_code=401,
                detail="Database offline. Use email: admin@zyntrix.com, password: admin123"
            )

    # Find user
    user = await database.db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    if not user.get('is_active', True):
        raise HTTPException(
            status_code=403,
            detail="User account is disabled"
        )
    
    user_id = str(user['_id'])
    
    # Update last login
    await database.db.users.update_one(
        {"_id": user['_id']},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create tokens
    access_token = create_access_token(
        data={
            "sub": user_id,
            "email": user['email'],
            "role": user.get('role', 'user'),
            "organization_id": user.get('organization_id')
        }
    )
    refresh_token = create_refresh_token(
        data={"sub": user_id}
    )
    
    # Log event
    await database.log_event({
        "event_type": "user_login",
        "user_id": user_id,
        "details": {"email": user['email']}
    })

    # Trigger behavioral analysis
    background_tasks.add_task(behavioral_analyzer.analyze_user_event, user_id, "login")
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token
    )

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token_endpoint(refresh_token: str):
    """Refresh access token using refresh token"""
    try:
        token_data = decode_token(refresh_token)
        
        # Get user
        user = await database.db.users.find_one({"_id": ObjectId(token_data.user_id)})
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Create new access token
        access_token = create_access_token(
            data={
                "sub": str(user['_id']),
                "email": user['email'],
                "role": user.get('role', 'user'),
                "organization_id": user.get('organization_id')
            }
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.get("/api/auth/me")
async def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    """Get current authenticated user information"""
    user = await database.db.users.find_one({"_id": ObjectId(current_user.user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove sensitive data
    user['_id'] = str(user['_id'])
    user.pop('password_hash', None)
    
    return {
        "success": True,
        "data": user
    }

# ============================================================================
# WEBSOCKET ENDPOINTS - REAL-TIME MONITORING
# ============================================================================

@app.websocket("/api/ws/threats")
async def websocket_threats(websocket: WebSocket):
    """
    WebSocket endpoint for real-time threat monitoring
    Broadcasts threat alerts and scan updates to connected clients
    """
    await ws_manager.connect(websocket)
    
    try:
        # Send initial connection success message
        await ws_manager.send_personal_message({
            "type": "connection_established",
            "message": "Connected to threat feed",
            "timestamp": datetime.utcnow().isoformat()
        }, websocket)
        
        # Send recent threats
        recent_threats = threat_feed.get_recent_threats(limit=10)
        await ws_manager.send_personal_message({
            "type": "initial_feed",
            "data": recent_threats,
            "timestamp": datetime.utcnow().isoformat()
        }, websocket)
        
        # Keep connection alive and listen for messages
        while True:
            try:
                data = await websocket.receive_text()
                # Echo back for heartbeat
                await ws_manager.send_personal_message({
                    "type": "heartbeat",
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
            except WebSocketDisconnect:
                break
    
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        ws_manager.disconnect(websocket)

@app.get("/api/threats/feed")
async def get_threat_feed(limit: int = 50):
    """Get recent threats from the live feed"""
    threats = threat_feed.get_recent_threats(limit=limit)
    stats = threat_feed.get_threat_stats()
    
    return {
        "success": True,
        "data": {
            "threats": threats,
            "stats": stats,
            "connections": ws_manager.get_connection_count()
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================================================
# BLOCKING POLICY ENDPOINTS
# ============================================================================

@app.post("/api/policy/check")
async def check_blocking_policy(analysis_result: dict):
    """
    Check if content should be blocked based on policy
    
    Request body should contain analysis result from any analyzer
    """
    action = blocking_policy.get_blocking_action(analysis_result)
    
    return {
        "success": True,
        "data": action,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/policy/override")
async def log_policy_override(
    user_id: str,
    content: str,
    risk_score: int,
    reason: str = None
):
    """Log when user overrides a blocking decision"""
    override_log = await blocking_policy.log_override(user_id, content, risk_score, reason)
    
    return {
        "success": True,
        "message": "Override logged successfully",
        "data": override_log,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/policy/list")
async def list_policies():
    """List all available blocking policies"""
    policies = blocking_policy.list_policies()
    
    return {
        "success": True,
        "data": {
            "policies": policies,
            "default_policy": blocking_policy.get_policy("default")
        },
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
