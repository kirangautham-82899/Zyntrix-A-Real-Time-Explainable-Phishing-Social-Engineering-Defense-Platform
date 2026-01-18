"""
Database Connection and Operations
MongoDB connection management and CRUD operations
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

class Database:
    """MongoDB database connection and operations"""
    
    client: Optional[AsyncIOMotorClient] = None
    db = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        try:
            mongodb_url = os.getenv("MONGODB_URL")
            if not mongodb_url:
                print("Warning: MONGODB_URL not configured")
                return
            
            cls.client = AsyncIOMotorClient(
                mongodb_url,
                tlsAllowInvalidCertificates=True  # For development
            )
            cls.db = cls.client.zyntrix
            
            # Create indexes
            await cls._create_indexes()
            
            print("✅ Connected to MongoDB")
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    async def _create_indexes(cls):
        """Create database indexes for better performance"""
        try:
            # Scan history indexes
            await cls.db.scan_history.create_index("timestamp")
            await cls.db.scan_history.create_index("scan_type")
            await cls.db.scan_history.create_index("risk_level")
            await cls.db.scan_history.create_index([("timestamp", -1)])
            
            # Threat reports indexes
            await cls.db.threat_reports.create_index("timestamp")
            await cls.db.threat_reports.create_index("status")
            await cls.db.threat_reports.create_index("severity")
            
            # Users indexes
            await cls.db.users.create_index("email", unique=True)
            await cls.db.users.create_index("username", unique=True)
            
            # Analytics indexes
            await cls.db.analytics.create_index("timestamp")
            await cls.db.analytics.create_index("event_type")
            
            print("✅ Database indexes created")
        except Exception as e:
            print(f"Warning: Could not create indexes: {e}")
    
    # Scan History Operations
    @classmethod
    async def save_scan(cls, scan_data: Dict) -> Optional[str]:
        """Save scan history to database"""
        try:
            if not cls.db:
                return None
            
            result = await cls.db.scan_history.insert_one(scan_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving scan: {e}")
            return None
    
    @classmethod
    async def get_recent_scans(cls, limit: int = 10, scan_type: str = None) -> List[Dict]:
        """Get recent scans"""
        try:
            if not cls.db:
                return []
            
            query = {}
            if scan_type:
                query['scan_type'] = scan_type
            
            cursor = cls.db.scan_history.find(query).sort("timestamp", -1).limit(limit)
            scans = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string
            for scan in scans:
                scan['_id'] = str(scan['_id'])
            
            return scans
        except Exception as e:
            print(f"Error getting scans: {e}")
            return []
    
    @classmethod
    async def get_scan_stats(cls) -> Dict:
        """Get scan statistics"""
        try:
            if not cls.db:
                return {}
            
            # Total scans
            total = await cls.db.scan_history.count_documents({})
            
            # Scans by type
            url_count = await cls.db.scan_history.count_documents({"scan_type": "url"})
            email_count = await cls.db.scan_history.count_documents({"scan_type": "email"})
            sms_count = await cls.db.scan_history.count_documents({"scan_type": "sms"})
            
            # Scans by risk level
            safe_count = await cls.db.scan_history.count_documents({"risk_level": "safe"})
            suspicious_count = await cls.db.scan_history.count_documents({"risk_level": "suspicious"})
            dangerous_count = await cls.db.scan_history.count_documents({"risk_level": "dangerous"})
            
            # Recent scans (last 24 hours)
            yesterday = datetime.utcnow() - timedelta(days=1)
            recent_count = await cls.db.scan_history.count_documents({
                "timestamp": {"$gte": yesterday}
            })
            
            return {
                "total_scans": total,
                "by_type": {
                    "url": url_count,
                    "email": email_count,
                    "sms": sms_count
                },
                "by_risk_level": {
                    "safe": safe_count,
                    "suspicious": suspicious_count,
                    "dangerous": dangerous_count
                },
                "last_24_hours": recent_count
            }
        except Exception as e:
            print(f"Error getting stats: {e}")
            return {}
    
    # Threat Report Operations
    @classmethod
    async def save_threat_report(cls, report_data: Dict) -> Optional[str]:
        """Save threat report"""
        try:
            if not cls.db:
                return None
            
            result = await cls.db.threat_reports.insert_one(report_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving report: {e}")
            return None
    
    @classmethod
    async def get_threat_reports(cls, status: str = None, limit: int = 10) -> List[Dict]:
        """Get threat reports"""
        try:
            if not cls.db:
                return []
            
            query = {}
            if status:
                query['status'] = status
            
            cursor = cls.db.threat_reports.find(query).sort("timestamp", -1).limit(limit)
            reports = await cursor.to_list(length=limit)
            
            for report in reports:
                report['_id'] = str(report['_id'])
            
            return reports
        except Exception as e:
            print(f"Error getting reports: {e}")
            return []
    
    # Analytics Operations
    @classmethod
    async def log_event(cls, event_data: Dict) -> Optional[str]:
        """Log analytics event"""
        try:
            if not cls.db:
                return None
            
            result = await cls.db.analytics.insert_one(event_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error logging event: {e}")
            return None

# Create database instance
database = Database()
