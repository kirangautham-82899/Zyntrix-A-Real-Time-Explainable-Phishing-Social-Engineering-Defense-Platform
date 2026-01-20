from datetime import datetime, timedelta
from typing import Dict, List, Optional
from database import database
from ml_behavioral_model import behavioral_model
from models import BehavioralProfile
from bson import ObjectId

class BehavioralAnalyzer:
    """
    Orchestrates behavioral analysis for users.
    Collects data, feeds it to ML model, and updates profiles.
    """
    
    async def analyze_user_event(self, user_id: str, event_type: str, context: Dict = None):
        """
        Trigger an analysis update upon a user event (login, scan, etc.)
        """
        if not database.db:
            return None # Offline mode
            
        # 1. Fetch current profile or create new
        profile_data = await database.db.behavioral_profiles.find_one({"user_id": user_id})
        
        if not profile_data:
            profile = BehavioralProfile(
                user_id=user_id,
                risk_score=0,
                last_updated=datetime.utcnow(),
                anomalies_detected=0,
                behavior_vectors={}
            )
        else:
            profile = BehavioralProfile(**profile_data)
        
        # 2. Gather recent activity metrics for Feature Extraction
        activity_metrics = await self._gather_metrics(user_id)
        
        # 3. Add context (current event info)
        current_activity = {
            **activity_metrics,
            "hour_of_day": datetime.utcnow().hour
        }
        
        # 4. Predict Anomaly Score using ML Model
        anomaly_score = behavioral_model.predict_anomaly(current_activity)
        
        # 5. Update Profile
        new_risk_score = round(anomaly_score * 100)
        
        # Smooth the score update (Exponential Moving Average) to avoid jumping too fast
        profile.risk_score = int((profile.risk_score * 0.7) + (new_risk_score * 0.3))
        profile.last_updated = datetime.utcnow()
        
        if new_risk_score > 70:
            profile.anomalies_detected += 1
            # Log specific anomaly warning
            await database.save_threat_report({
                "type": "Behavioral Anomaly",
                "risk_level": "High",
                "details": f"Unusual user behavior detected. Risk score: {new_risk_score}",
                "user_id": user_id,
                "timestamp": datetime.utcnow(),
                "status": "pending",
                "source": "BehavioralEngine"
            })
            
        # Save updated profile
        await database.db.behavioral_profiles.update_one(
            {"user_id": user_id},
            {"$set": profile.dict(exclude={'id'})},
            upsert=True
        )
        
        return profile

    async def _gather_metrics(self, user_id: str) -> Dict:
        """
        Gather aggregate metrics for the user from DB.
        """
        # In a real system, this would aggregate logs.
        # Here we mock/approximate based on what accessible quickly or implement simple counters.
        
        # Get recent scans count
        # (This is expensive to count every time, but okay for prototype)
        scan_count = await database.db.scan_history.count_documents({"user_id": user_id})
        
        # Get avg risk score
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {"_id": None, "avg_risk": {"$avg": "$risk_score"}}}
        ]
        # execute aggregation... (skipping full impl for brevity, assuming simple mock or cached value)
        
        # Simplified metrics for now
        return {
            "scan_count": scan_count,
            "avg_risk_score": 10, # placeholder
            "failed_logins": 0,    # placeholder
            "login_frequency": 1
        }

behavioral_analyzer = BehavioralAnalyzer()
