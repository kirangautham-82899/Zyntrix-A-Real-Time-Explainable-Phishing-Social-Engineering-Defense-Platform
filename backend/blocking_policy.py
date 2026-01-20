"""
Blocking Policy Module
Defines and enforces threat blocking policies
"""

from typing import Dict, Optional
from datetime import datetime
from database import database

class BlockingPolicy:
    """Manages threat blocking policies and enforcement"""
    
    # Default risk thresholds
    BLOCK_THRESHOLD = 70  # Block if risk score >= 70
    WARN_THRESHOLD = 40   # Warn if risk score >= 40
    
    def __init__(self):
        self.policies = {
            "default": {
                "block_threshold": self.BLOCK_THRESHOLD,
                "warn_threshold": self.WARN_THRESHOLD,
                "auto_block_dangerous": True,
                "require_confirmation_suspicious": True,
                "allow_override": True
            }
        }
    
    def should_block(self, risk_score: int, risk_level: str, policy_name: str = "default") -> Dict:
        """
        Determine if content should be blocked based on policy
        
        Returns:
            Dict with action, reason, and allow_override flag
        """
        policy = self.policies.get(policy_name, self.policies["default"])
        
        # Dangerous content - block by default
        if risk_level == "dangerous" and policy["auto_block_dangerous"]:
            return {
                "action": "block",
                "reason": f"High risk detected (score: {risk_score}/100)",
                "allow_override": policy["allow_override"],
                "risk_level": risk_level,
                "risk_score": risk_score
            }
        
        # Suspicious content - require confirmation
        if risk_level == "suspicious" and policy["require_confirmation_suspicious"]:
            return {
                "action": "warn",
                "reason": f"Suspicious content detected (score: {risk_score}/100)",
                "allow_override": True,
                "risk_level": risk_level,
                "risk_score": risk_score
            }
        
        # Safe content - allow
        return {
            "action": "allow",
            "reason": "Content appears safe",
            "allow_override": False,
            "risk_level": risk_level,
            "risk_score": risk_score
        }
    
    def get_blocking_action(self, analysis_result: dict, policy_name: str = "default") -> Dict:
        """
        Get blocking action based on analysis result
        
        Args:
            analysis_result: Result from URL/Email/SMS/QR analyzer
            policy_name: Name of policy to apply
            
        Returns:
            Action dictionary with recommended action
        """
        risk_score = analysis_result.get("risk_score", 0)
        risk_level = analysis_result.get("risk_level", "safe")
        
        action = self.should_block(risk_score, risk_level, policy_name)
        
        # Add context from analysis
        action["url"] = analysis_result.get("url") or analysis_result.get("extracted_url")
        action["domain"] = analysis_result.get("domain")
        action["factors"] = analysis_result.get("factors", [])
        action["recommendations"] = analysis_result.get("recommendations", [])
        
        return action
    
    async def log_override(self, user_id: str, content: str, risk_score: int, reason: str = None):
        """
        Log when user overrides a blocking decision
        
        Args:
            user_id: User who made the override
            content: Content that was allowed despite warning/block
            risk_score: Risk score of the content
            reason: Optional reason for override
        """
        override_log = {
            "user_id": user_id,
            "content": content[:200],  # Truncate for privacy
            "risk_score": risk_score,
            "reason": reason,
            "timestamp": datetime.utcnow(),
            "event_type": "policy_override"
        }
        
        # Log to database if available
        if database.db:
            await database.log_event(override_log)
        
        return override_log
    
    async def log_block(self, user_id: str, content: str, risk_score: int, risk_level: str):
        """
        Log when content is blocked
        
        Args:
            user_id: User who attempted access
            content: Content that was blocked
            risk_score: Risk score of the content
            risk_level: Risk level classification
        """
        block_log = {
            "user_id": user_id,
            "content": content[:200],  # Truncate for privacy
            "risk_score": risk_score,
            "risk_level": risk_level,
            "timestamp": datetime.utcnow(),
            "event_type": "content_blocked"
        }
        
        # Log to database if available
        if database.db:
            await database.log_event(block_log)
        
        return block_log
    
    def create_policy(self, name: str, config: dict):
        """
        Create custom blocking policy
        
        Args:
            name: Policy name
            config: Policy configuration
        """
        self.policies[name] = {
            "block_threshold": config.get("block_threshold", self.BLOCK_THRESHOLD),
            "warn_threshold": config.get("warn_threshold", self.WARN_THRESHOLD),
            "auto_block_dangerous": config.get("auto_block_dangerous", True),
            "require_confirmation_suspicious": config.get("require_confirmation_suspicious", True),
            "allow_override": config.get("allow_override", True)
        }
        
        return self.policies[name]
    
    def get_policy(self, name: str = "default") -> dict:
        """Get policy configuration"""
        return self.policies.get(name, self.policies["default"])
    
    def list_policies(self) -> list:
        """List all available policies"""
        return list(self.policies.keys())

# Create singleton instance
blocking_policy = BlockingPolicy()
