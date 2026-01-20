#!/bin/bash
# Startup script for ZYNTRIX backend with QR code support

# Set library path for zbar (required for QR code scanning)
export DYLD_LIBRARY_PATH=/opt/homebrew/lib:$DYLD_LIBRARY_PATH

# Start uvicorn server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
