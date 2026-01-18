"""
Database Models and Schemas
MongoDB models for storing scan history, users, organizations, and threat reports
"""

from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

from typing import Any
from pydantic_core import core_schema
from pydantic.json_schema import JsonSchemaValue

class PyObjectId(str):
    """Custom ObjectId type for Pydantic v2"""
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.str_schema(),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _core_schema: core_schema.CoreSchema, handler: Any
    ) -> JsonSchemaValue:
        return handler(core_schema.str_schema())

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
    user_id: Optional[str] = None  # For user tracking
    organization_id: Optional[str] = None  # For organization tracking
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
    organization_id: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class User(BaseModel):
    """Model for user accounts"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    username: str
    password_hash: str
    role: str = 'user'  # 'admin', 'user', 'viewer'
    organization_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    scan_count: int = 0
    is_active: bool = True
    settings: Optional[Dict] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Organization(BaseModel):
    """Model for organizations (multi-tenancy)"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    plan: str = 'free'  # 'free', 'pro', 'enterprise'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    owner_id: str  # User ID of organization owner
    settings: Optional[Dict] = {
        'default_policies': {},
        'threat_sharing_enabled': False,
        'sso_config': None
    }
    statistics: Optional[Dict] = {
        'total_users': 0,
        'total_scans': 0,
        'threats_blocked': 0
    }
    is_active: bool = True
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Policy(BaseModel):
    """Model for organization security policies"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    organization_id: str
    name: str
    description: Optional[str] = None
    policy_type: str  # 'blocking', 'notification', 'whitelist', 'blacklist'
    rules: Dict  # Policy-specific rules
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str  # User ID
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ThreatIntelligence(BaseModel):
    """Model for threat intelligence data"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    threat_type: str  # 'url', 'domain', 'email', 'phone', 'ip'
    value: str  # The actual threat (URL, domain, etc.)
    risk_level: str  # 'low', 'medium', 'high', 'critical'
    source: str  # 'internal', 'phishtank', 'urlhaus', 'user_report'
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    report_count: int = 1
    metadata: Optional[Dict] = None
    is_active: bool = True
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BehavioralProfile(BaseModel):
    """Model for user behavioral profiles"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    organization_id: Optional[str] = None
    profile_data: Dict = {
        'typical_hours': [],  # Hours of day user is typically active
        'common_domains': [],  # Frequently visited domains
        'interaction_patterns': {},
        'risk_tolerance': 0.5  # 0-1 scale
    }
    anomaly_score: float = 0.0  # Current anomaly score
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    training_data_count: int = 0
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AuditLog(BaseModel):
    """Model for audit trail"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = None
    organization_id: Optional[str] = None
    action: str  # 'login', 'scan', 'policy_change', 'user_create', etc.
    resource: str  # What was acted upon
    details: Optional[Dict] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    status: str = 'success'  # 'success', 'failure'
    
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
    organization_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
