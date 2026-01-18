"""
Redis Cache Manager
Handles caching of analysis results for faster responses
"""

import os
import json
import redis
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv()

class RedisCache:
    """Redis cache manager for analysis results"""
    
    def __init__(self):
        self.client = None
        self.connected = False
        self._connect()
    
    def _connect(self):
        """Connect to Redis"""
        try:
            redis_url = os.getenv("REDIS_URL")
            if not redis_url:
                print("Warning: REDIS_URL not configured")
                return
            
            self.client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5
            )
            
            # Test connection
            self.client.ping()
            self.connected = True
            print("✅ Connected to Redis")
        except Exception as e:
            print(f"⚠️  Redis connection failed: {e}")
            print("Continuing without cache...")
            self.connected = False
    
    def get(self, key: str) -> Optional[Dict]:
        """Get cached result"""
        if not self.connected or not self.client:
            return None
        
        try:
            cached = self.client.get(key)
            if cached:
                return json.loads(cached)
            return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None
    
    def set(self, key: str, value: Dict, ttl: int = 3600):
        """
        Cache a result
        
        Args:
            key: Cache key
            value: Data to cache
            ttl: Time to live in seconds (default: 1 hour)
        """
        if not self.connected or not self.client:
            return False
        
        try:
            self.client.setex(
                key,
                ttl,
                json.dumps(value)
            )
            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    def delete(self, key: str):
        """Delete cached result"""
        if not self.connected or not self.client:
            return False
        
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False
    
    def clear_all(self):
        """Clear all cached results"""
        if not self.connected or not self.client:
            return False
        
        try:
            self.client.flushdb()
            return True
        except Exception as e:
            print(f"Redis clear error: {e}")
            return False
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        if not self.connected or not self.client:
            return {
                'connected': False,
                'keys': 0,
                'memory_used': '0 MB'
            }
        
        try:
            info = self.client.info('stats')
            memory = self.client.info('memory')
            
            return {
                'connected': True,
                'keys': self.client.dbsize(),
                'hits': info.get('keyspace_hits', 0),
                'misses': info.get('keyspace_misses', 0),
                'memory_used': f"{memory.get('used_memory_human', '0')}",
            }
        except Exception as e:
            print(f"Redis stats error: {e}")
            return {
                'connected': False,
                'error': str(e)
            }
    
    def generate_cache_key(self, prefix: str, content: str) -> str:
        """
        Generate a cache key
        
        Args:
            prefix: Key prefix (e.g., 'url', 'email', 'sms')
            content: Content to hash
        
        Returns:
            Cache key string
        """
        import hashlib
        content_hash = hashlib.md5(content.encode()).hexdigest()
        return f"zyntrix:{prefix}:{content_hash}"

# Create singleton instance
cache = RedisCache()
