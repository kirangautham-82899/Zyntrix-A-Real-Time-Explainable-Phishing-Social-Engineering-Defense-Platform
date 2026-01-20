#!/bin/bash

# Zyntrix Backend Startup Script
echo "🚀 Starting Zyntrix Backend Server..."

# Navigate to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Activate virtual environment
if [ -d "venv" ]; then
    echo "✅ Activating virtual environment..."
    . venv/bin/activate
else
    echo "❌ Virtual environment not found!"
    echo "Please create one with: python3 -m venv venv"
    echo "Then install dependencies: pip install -r requirements.txt"
    exit 1
fi

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "❌ Dependencies not installed!"
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the server
echo "🌐 Starting server on http://0.0.0.0:8000"
echo "📚 API Documentation: http://localhost:8000/api/docs"
echo ""

# Set library path for zbar (needed for QR code scanning)
export DYLD_LIBRARY_PATH=/opt/homebrew/opt/zbar/lib:$DYLD_LIBRARY_PATH

python -m uvicorn main:app --host 0.0.0.0 --port 8000
