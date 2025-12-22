#!/bin/bash

# Development startup script for NHL Stats Tracker
# This script starts both the Python backend and React frontend

set -e

echo "🏒 NHL Stats Tracker - Development Setup"
echo "========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.12 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 20 or higher"
    exit 1
fi

echo ""
echo "📦 Setting up Python backend..."
cd backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "🚀 Starting Python backend on port 8000..."
python main.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

cd ..

# Wait for backend to start
echo "Waiting for backend to be ready..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start. Check logs/backend.log"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "📦 Setting up React frontend..."

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install --legacy-peer-deps
fi

echo ""
echo "🚀 Starting React frontend on port 5173..."
echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Backend logs: logs/backend.log"
echo ""
echo "To stop the backend: kill $BACKEND_PID"
echo "Press Ctrl+C to stop the frontend"
echo ""

# Start frontend (this will block)
npm run dev
