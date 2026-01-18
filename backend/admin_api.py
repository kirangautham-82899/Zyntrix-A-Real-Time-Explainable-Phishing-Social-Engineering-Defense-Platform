"""
Admin API Endpoints
Enterprise admin features including user management, analytics, and threat intelligence
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from datetime import datetime, timedelta
from backend.auth import (
    get_current_user, require_admin, require_admin_or_user,
    TokenData, UserCreate, UserResponse, get_password_hash
)
from backend.models import User, Organization, Policy, AuditLog
from backend.database import database
from backend.analytics_engine import get_analytics_engine
from bson import ObjectId

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ============================================================================
# ANALYTICS ENDPOINTS
# ============================================================================

@router.get("/analytics/overview")
async def get_analytics_overview(
    organization_id: Optional[str] = None,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Get analytics overview dashboard"""
    # If user is not admin, force their organization
    if current_user.role != "admin":
        organization_id = current_user.organization_id
    
    analytics = get_analytics_engine(database)
    overview = await analytics.get_overview_stats(organization_id)
    
    return {
        "success": True,
        "data": overview
    }

@router.get("/analytics/trends")
async def get_analytics_trends(
    days: int = Query(30, ge=1, le=365),
    organization_id: Optional[str] = None,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Get trend analysis over time"""
    if current_user.role != "admin":
        organization_id = current_user.organization_id
    
    analytics = get_analytics_engine(database)
    trends = await analytics.get_trends(days, organization_id)
    
    return {
        "success": True,
        "data": trends
    }

@router.get("/analytics/attack-patterns")
async def get_attack_patterns(
    organization_id: Optional[str] = None,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Get attack pattern analysis"""
    if current_user.role != "admin":
        organization_id = current_user.organization_id
    
    analytics = get_analytics_engine(database)
    patterns = await analytics.get_attack_patterns(organization_id)
    
    return {
        "success": True,
        "data": patterns
    }

@router.get("/analytics/user-risks")
async def get_user_risk_scores(
    organization_id: str,
    current_user: TokenData = Depends(require_admin)
):
    """Get risk scores for users in organization"""
    analytics = get_analytics_engine(database)
    user_risks = await analytics.get_user_risk_scores(organization_id)
    
    return {
        "success": True,
        "data": user_risks
    }

@router.get("/analytics/comparative")
async def get_comparative_analytics(
    period1_days: int = Query(7, ge=1),
    period2_days: int = Query(7, ge=1),
    organization_id: Optional[str] = None,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Compare two time periods"""
    if current_user.role != "admin":
        organization_id = current_user.organization_id
    
    analytics = get_analytics_engine(database)
    comparison = await analytics.get_comparative_analytics(
        period1_days, period2_days, organization_id
    )
    
    return {
        "success": True,
        "data": comparison
    }

# ============================================================================
# USER MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/users")
async def list_users(
    organization_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: TokenData = Depends(require_admin)
):
    """List all users (admin only)"""
    query = {}
    if organization_id:
        query['organization_id'] = organization_id
    
    cursor = database.db.users.find(query).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    # Remove password hashes
    for user in users:
        user['_id'] = str(user['_id'])
        user.pop('password_hash', None)
    
    total = await database.db.users.count_documents(query)
    
    return {
        "success": True,
        "data": {
            "users": users,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    }

@router.post("/users")
async def create_user(
    user_data: UserCreate,
    current_user: TokenData = Depends(require_admin)
):
    """Create a new user (admin only)"""
    # Check if user already exists
    existing = await database.db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
    
    # Log audit event
    await database.log_event({
        "event_type": "user_create",
        "user_id": current_user.user_id,
        "details": {"created_user_id": str(result.inserted_id)}
    })
    
    return {
        "success": True,
        "data": {
            "user_id": str(result.inserted_id),
            "email": user_data.email
        }
    }

@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    current_user: TokenData = Depends(require_admin)
):
    """Get user details"""
    user = await database.db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user['_id'] = str(user['_id'])
    user.pop('password_hash', None)
    
    return {
        "success": True,
        "data": user
    }

@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    updates: dict,
    current_user: TokenData = Depends(require_admin)
):
    """Update user details"""
    # Don't allow password updates through this endpoint
    updates.pop('password_hash', None)
    updates.pop('password', None)
    
    result = await database.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Log audit event
    await database.log_event({
        "event_type": "user_update",
        "user_id": current_user.user_id,
        "details": {"updated_user_id": user_id, "updates": updates}
    })
    
    return {
        "success": True,
        "message": "User updated successfully"
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: TokenData = Depends(require_admin)
):
    """Delete a user"""
    result = await database.db.users.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Log audit event
    await database.log_event({
        "event_type": "user_delete",
        "user_id": current_user.user_id,
        "details": {"deleted_user_id": user_id}
    })
    
    return {
        "success": True,
        "message": "User deleted successfully"
    }

# ============================================================================
# ORGANIZATION MANAGEMENT
# ============================================================================

@router.get("/organizations")
async def list_organizations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: TokenData = Depends(require_admin)
):
    """List all organizations"""
    cursor = database.db.organizations.find({}).skip(skip).limit(limit)
    orgs = await cursor.to_list(length=limit)
    
    for org in orgs:
        org['_id'] = str(org['_id'])
    
    total = await database.db.organizations.count_documents({})
    
    return {
        "success": True,
        "data": {
            "organizations": orgs,
            "total": total
        }
    }

@router.post("/organizations")
async def create_organization(
    org_data: dict,
    current_user: TokenData = Depends(require_admin)
):
    """Create a new organization"""
    org = Organization(
        name=org_data['name'],
        plan=org_data.get('plan', 'free'),
        owner_id=org_data['owner_id']
    )
    
    result = await database.db.organizations.insert_one(org.dict(by_alias=True))
    
    return {
        "success": True,
        "data": {
            "organization_id": str(result.inserted_id)
        }
    }

# ============================================================================
# POLICY MANAGEMENT
# ============================================================================

@router.get("/policies")
async def list_policies(
    organization_id: str,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """List policies for an organization"""
    policies = await database.db.policies.find(
        {"organization_id": organization_id}
    ).to_list(length=None)
    
    for policy in policies:
        policy['_id'] = str(policy['_id'])
    
    return {
        "success": True,
        "data": policies
    }

@router.post("/policies")
async def create_policy(
    policy_data: dict,
    current_user: TokenData = Depends(require_admin)
):
    """Create a new security policy"""
    policy = Policy(
        organization_id=policy_data['organization_id'],
        name=policy_data['name'],
        description=policy_data.get('description'),
        policy_type=policy_data['policy_type'],
        rules=policy_data['rules'],
        created_by=current_user.user_id
    )
    
    result = await database.db.policies.insert_one(policy.dict(by_alias=True))
    
    return {
        "success": True,
        "data": {
            "policy_id": str(result.inserted_id)
        }
    }

# ============================================================================
# THREAT INTELLIGENCE
# ============================================================================

@router.get("/threats/intelligence")
async def get_threat_intelligence(
    threat_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Get threat intelligence feed"""
    query = {"is_active": True}
    
    if threat_type:
        query['threat_type'] = threat_type
    if risk_level:
        query['risk_level'] = risk_level
    
    cursor = database.db.threat_intelligence.find(query).sort(
        "last_seen", -1
    ).limit(limit)
    
    threats = await cursor.to_list(length=limit)
    
    for threat in threats:
        threat['_id'] = str(threat['_id'])
    
    return {
        "success": True,
        "data": {
            "threats": threats,
            "count": len(threats)
        }
    }

@router.post("/threats/report")
async def submit_threat_report(
    threat_data: dict,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Submit a new threat to intelligence database"""
    from backend.models import ThreatIntelligence
    
    threat = ThreatIntelligence(
        threat_type=threat_data['threat_type'],
        value=threat_data['value'],
        risk_level=threat_data.get('risk_level', 'medium'),
        source='user_report',
        metadata=threat_data.get('metadata')
    )
    
    result = await database.db.threat_intelligence.insert_one(threat.dict(by_alias=True))
    
    return {
        "success": True,
        "data": {
            "threat_id": str(result.inserted_id)
        }
    }

# ============================================================================
# AUDIT LOGS
# ============================================================================

@router.get("/audit-logs")
async def get_audit_logs(
    organization_id: Optional[str] = None,
    action: Optional[str] = None,
    user_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: TokenData = Depends(require_admin)
):
    """Get audit logs"""
    query = {}
    
    if organization_id:
        query['organization_id'] = organization_id
    if action:
        query['action'] = action
    if user_id:
        query['user_id'] = user_id
    
    cursor = database.db.audit_logs.find(query).sort(
        "timestamp", -1
    ).skip(skip).limit(limit)
    
    logs = await cursor.to_list(length=limit)
    
    for log in logs:
        log['_id'] = str(log['_id'])
    
    total = await database.db.audit_logs.count_documents(query)
    
    return {
        "success": True,
        "data": {
            "logs": logs,
            "total": total
        }
    }

# ============================================================================
# EXPORT & REPORTING
# ============================================================================

@router.get("/reports/export")
async def export_report(
    start_date: str,
    end_date: str,
    format: str = Query("json", regex="^(json|csv|pdf)$"),
    organization_id: Optional[str] = None,
    current_user: TokenData = Depends(require_admin_or_user)
):
    """Export analytics report"""
    if current_user.role != "admin":
        organization_id = current_user.organization_id
    
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    
    analytics = get_analytics_engine(database)
    report = await analytics.export_report(start, end, organization_id, format)
    
    return {
        "success": True,
        "data": report
    }
