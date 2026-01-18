"""
Database Models and Schemas
MongoDB models for storing scan history, users, and threat reports
"""

from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ScanHistory(BaseModel):
    """Model for storing scan history"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    scan_type: str  # 'url', 'email', 'sms'
    content: str  # The scanned content
    sender: Optional[str] = None  # Sender email/number if applicable
    risk_score: int  # 0-100
    risk_level: str  # 'safe', 'suspicious', 'dangerous'
    classification: str
    explanation: str
    factors: List[Dict]
    recommendations: List[str]
    ml_prediction: Optional[Dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = None  # For future user tracking
    ip_address: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ThreatReport(BaseModel):
    """Model for storing reported threats"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    content: str
    content_type: str  # 'url', 'email', 'sms'
    reported_by: Optional[str] = None
    reason: str
    severity: str  # 'low', 'medium', 'high', 'critical'
    status: str = 'pending'  # 'pending', 'verified', 'false_positive'
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    verified_at: Optional[datetime] = None
    notes: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class User(BaseModel):
    """Model for user accounts (future feature)"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: str
    username: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    scan_count: int = 0
    subscription_tier: str = 'free'  # 'free', 'pro', 'enterprise'
    is_active: bool = True
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AnalyticsEvent(BaseModel):
    """Model for analytics and usage tracking"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    event_type: str  # 'scan', 'report', 'api_call'
    scan_type: Optional[str] = None  # 'url', 'email', 'sms'
    risk_level: Optional[str] = None
    user_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
