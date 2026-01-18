from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
from dotenv import load_dotenv
from url_analyzer import url_analyzer
from email_analyzer import email_analyzer
from sms_analyzer import sms_analyzer
from ml_models import ml_classifier
from database import database
from cache import cache

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="ZYNTRIX API",
    description="Real-Time Cyber Safety Platform - AI-powered phishing and social engineering detection",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

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
        "version": "1.0.0",
        "description": "Real-Time Cyber Safety Platform",
        "endpoints": {
            "health": "/api/health",
            "docs": "/api/docs",
            "redoc": "/api/redoc",
            "analyze_url": "/api/analyze/url"
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
            "mongodb": "connected" if database.db else "disconnected",
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
@app.post("/api/analyze/url", response_model=URLAnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    """
    Analyze URL for phishing and malicious patterns
    
    Returns:
    - risk_score: 0-100 (0=safe, 100=dangerous)
    - risk_level: safe, suspicious, or dangerous
    - factors: List of detection factors
    - detailed analysis results
    """
    try:
        # Check cache first
        cache_key = cache.generate_cache_key('url', request.url)
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
        result = url_analyzer.analyze(request.url)
        
        if not result['valid']:
            raise HTTPException(status_code=400, detail=result.get('error', 'Invalid URL'))
        
        # Format response
        return URLAnalysisResponse(
            success=True,
            data={
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
            },
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
async def analyze_email(request: EmailAnalysisRequest):
    """
    Analyze email content for phishing and social engineering
    
    Returns:
    - risk_score: 0-100 (0=safe, 100=dangerous)
    - risk_level: safe, suspicious, or dangerous
    - factors: List of detection factors
    - keyword analysis and sender verification
    """
    try:
        # Analyze the email
        result = email_analyzer.analyze(
            email_content=request.email_content,
            sender_email=request.sender_email
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
async def analyze_sms(request: SMSAnalysisRequest):
    """
    Analyze SMS/text message for scams and social engineering
    
    Returns:
    - risk_score: 0-100 (0=safe, 100=dangerous)
    - risk_level: safe, suspicious, or dangerous
    - factors: List of detection factors
    - keyword analysis and pattern detection
    """
    try:
        # Analyze the SMS
        result = sms_analyzer.analyze(
            sms_content=request.sms_content,
            sender_number=request.sender_number
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
