#!/bin/bash
# Backend Startup Script for Linux/Mac

echo "================================"
echo "Starting Backend Server"
echo "================================"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB is not running"
    echo ""
    echo "Please start MongoDB first:"
    echo "  Option 1: Start MongoDB service"
    echo "    sudo systemctl start mongod (Linux)"
    echo "    brew services start mongodb-community (Mac)"
    echo "  Option 2: Run mongod manually"
    echo "    mongod --dbpath /data/db"
    echo ""
    exit 1
fi

echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "✗ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""
echo "Starting FastAPI server..."
echo "Backend will be available at: http://localhost:8000"
echo "API endpoints at: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8000 --reload
