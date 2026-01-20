"""
WebSocket Manager
Handles real-time threat notifications and live monitoring
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
from datetime import datetime
import json
import asyncio

class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.user_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str = None):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(websocket)
        
        print(f"✅ WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, user_id: str = None):
        """Remove WebSocket connection"""
        self.active_connections.discard(websocket)
        
        if user_id and user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        print(f"❌ WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending message: {e}")
    
    async def send_to_user(self, message: dict, user_id: str):
        """Send message to all connections of a specific user"""
        if user_id in self.user_connections:
            disconnected = set()
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.add(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                self.disconnect(conn, user_id)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.disconnect(conn)
    
    async def broadcast_threat_alert(self, threat_data: dict):
        """Broadcast high-risk threat detection to all clients"""
        alert = {
            "type": "threat_alert",
            "timestamp": datetime.utcnow().isoformat(),
            "data": threat_data
        }
        await self.broadcast(alert)
    
    async def send_scan_update(self, scan_data: dict, user_id: str = None):
        """Send scan completion update"""
        update = {
            "type": "scan_complete",
            "timestamp": datetime.utcnow().isoformat(),
            "data": scan_data
        }
        
        if user_id:
            await self.send_to_user(update, user_id)
        else:
            await self.broadcast(update)
    
    async def send_stats_update(self, stats: dict):
        """Send statistics update to all clients"""
        update = {
            "type": "stats_update",
            "timestamp": datetime.utcnow().isoformat(),
            "data": stats
        }
        await self.broadcast(update)
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.active_connections)

# Create singleton instance
manager = ConnectionManager()


class ThreatFeedManager:
    """Manages live threat feed updates"""
    
    def __init__(self):
        self.recent_threats: List[dict] = []
        self.max_feed_size = 100
    
    def add_threat(self, threat_data: dict):
        """Add threat to feed"""
        threat_entry = {
            "id": f"threat_{datetime.utcnow().timestamp()}",
            "timestamp": datetime.utcnow().isoformat(),
            **threat_data
        }
        
        self.recent_threats.insert(0, threat_entry)
        
        # Keep only recent threats
        if len(self.recent_threats) > self.max_feed_size:
            self.recent_threats = self.recent_threats[:self.max_feed_size]
        
        return threat_entry
    
    def get_recent_threats(self, limit: int = 50) -> List[dict]:
        """Get recent threats from feed"""
        return self.recent_threats[:limit]
    
    def get_threat_stats(self) -> dict:
        """Get statistics from recent threats"""
        if not self.recent_threats:
            return {
                "total": 0,
                "dangerous": 0,
                "suspicious": 0,
                "safe": 0
            }
        
        stats = {
            "total": len(self.recent_threats),
            "dangerous": sum(1 for t in self.recent_threats if t.get("risk_level") == "dangerous"),
            "suspicious": sum(1 for t in self.recent_threats if t.get("risk_level") == "suspicious"),
            "safe": sum(1 for t in self.recent_threats if t.get("risk_level") == "safe")
        }
        
        return stats

# Create singleton instance
threat_feed = ThreatFeedManager()
