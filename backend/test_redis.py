"""
Test Redis Cloud Connection
"""
import redis
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_redis():
    try:
        # Get Redis URL from environment
        redis_url = os.getenv("REDIS_URL")
        
        if not redis_url:
            print("❌ REDIS_URL not found in .env file")
            return False
        
        print("🔄 Connecting to Redis Cloud...")
        
        # Create Redis client
        r = redis.from_url(redis_url, decode_responses=True)
        
        # Test connection
        r.ping()
        
        print("✅ Redis connection successful!")
        
        # Test set/get operations
        test_key = "zyntrix_test"
        test_value = "Hello from ZYNTRIX!"
        
        r.set(test_key, test_value)
        retrieved_value = r.get(test_key)
        
        print(f"📝 Test write: '{test_value}'")
        print(f"📖 Test read: '{retrieved_value}'")
        
        if retrieved_value == test_value:
            print("✅ Read/Write operations working!")
        
        # Clean up
        r.delete(test_key)
        
        return True
        
    except Exception as e:
        print(f"❌ Redis connection failed!")
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("ZYNTRIX - Redis Connection Test")
    print("=" * 50)
    test_redis()
