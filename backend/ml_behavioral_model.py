import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os
from typing import List, Dict, Any

class BehavioralModel:
    """
    Machine Learning model for detecting anomalous user behavior.
    Uses Isolation Forest to identify outliers in user activity patterns.
    """
    
    def __init__(self, model_path: str = "behavioral_model.pkl"):
        self.model_path = model_path
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        self._load_model()

    def _load_model(self):
        """Load pretrained model if exists"""
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                    self.is_trained = True
                print("✅ Behavioral Model loaded")
            except Exception as e:
                print(f"⚠️ Failed to load model: {e}")

    def save_model(self):
        """Save trained model"""
        try:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            print("✅ Behavioral Model saved")
        except Exception as e:
            print(f"❌ Failed to save model: {e}")

    def feature_extraction(self, user_activity: Dict[str, Any]) -> List[float]:
        """
        Convert user activity dict to feature vector.
        Features:
        1. Hour of day (0-23)
        2. Login frequency (last 24h)
        3. Scan count (last 24h)
        4. Average risk score of scans
        5. Failed login attempts
        """
        features = [
            user_activity.get("hour_of_day", 12),
            user_activity.get("login_frequency", 1),
            user_activity.get("scan_count", 0),
            user_activity.get("avg_risk_score", 0),
            user_activity.get("failed_logins", 0)
        ]
        return features

    def train(self, historical_data: List[Dict[str, Any]]):
        """Train the Isolation Forest model on historical user data"""
        if not historical_data:
            print("⚠️ No data to train on")
            return
        
        X = [self.feature_extraction(item) for item in historical_data]
        self.model.fit(X)
        self.is_trained = True
        self.save_model()

    def predict_anomaly(self, current_activity: Dict[str, Any]) -> float:
        """
        Predict if current activity is anomalous.
        Returns anomaly score: -1 (anomaly) to 1 (normal).
        We convert this to a risk probability (0.0 to 1.0).
        """
        if not self.is_trained:
            # Fallback heuristic if not trained
            return self._heuristic_check(current_activity)

        features = [self.feature_extraction(current_activity)]
        
        # decision_function returns score. Negative is anomaly.
        score = self.model.decision_function(features)[0]
        
        # Convert to risk probability (inverted/normalized)
        # Score is typically around -0.5 to 0.5. 
        # Lower score = more anomalous.
        
        # Map: -0.2 (or lower) -> 1.0 (High Risk)
        #       0.2 (or higher) -> 0.0 (Low Risk)
        
        risk_prob = 1.0 / (1.0 + np.exp(10 * score)) # Sigmoid-ish
        return min(max(risk_prob, 0.0), 1.0)

    def _heuristic_check(self, activity: Dict[str, Any]) -> float:
        """Simple rule-based check when ML model isn't ready"""
        risk = 0.0
        
        if activity.get("failed_logins", 0) > 3:
            risk += 0.4
        
        if activity.get("avg_risk_score", 0) > 70:
            risk += 0.3
            
        if activity.get("scan_count", 0) > 50: # Unusual burst
            risk += 0.3
            
        # Night time usage check (e.g., 2 AM - 5 AM) could be suspicious depending on context
        hour = activity.get("hour_of_day", 12)
        if 2 <= hour <= 5:
            risk += 0.1
            
        return min(risk, 1.0)

# Singleton instance
behavioral_model = BehavioralModel()
