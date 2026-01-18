"""
Test MongoDB Atlas Connection
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mongodb():
    try:
        # Get MongoDB URL from environment
        mongodb_url = os.getenv("MONGODB_URL")
        
        if not mongodb_url:
            print("❌ MONGODB_URL not found in .env file")
            return False
        
        print("🔄 Connecting to MongoDB Atlas...")
        
        # Create MongoDB client with SSL certificate handling for Mac
        client = MongoClient(
            mongodb_url,
            serverSelectionTimeoutMS=5000,
            tlsAllowInvalidCertificates=True  # For development only
        )
        
        # Test connection
        client.admin.command('ping')
        
        print("✅ MongoDB connection successful!")
        print(f"📊 Available databases: {client.list_database_names()}")
        
        # Test creating a collection
        db = client[os.getenv("MONGODB_DB_NAME", "zyntrix")]
        print(f"📁 Using database: {db.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed!")
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("ZYNTRIX - MongoDB Connection Test")
    print("=" * 50)
    test_mongodb()
