#!/bin/bash
# Master Startup Script for Sweet Home Bakery
# Starts both backend and frontend servers in separate terminal tabs

echo "========================================"
echo "Sweet Home Bakery - Local Development"
echo "========================================"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first:"
    echo "  Linux: sudo systemctl start mongod"
    echo "  macOS: brew services start mongodb-community"
    echo "  Manual: mongod --dbpath /data/db"
    echo ""
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "Starting servers..."
echo ""

# Detect terminal emulator and start servers
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use Terminal
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/backend' && ./start-backend.sh\""
    sleep 2
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR/frontend' && ./start-frontend.sh\""
elif command -v gnome-terminal &> /dev/null; then
    # Linux with GNOME Terminal
    gnome-terminal --tab --title="Backend" --command="bash -c 'cd $ROOT_DIR/backend && ./start-backend.sh; exec bash'"
    sleep 2
    gnome-terminal --tab --title="Frontend" --command="bash -c 'cd $ROOT_DIR/frontend && ./start-frontend.sh; exec bash'"
else
    # Fallback - use background processes with tmux if available
    if command -v tmux &> /dev/null; then
        tmux new-session -d -s bakery-backend "cd $ROOT_DIR/backend && ./start-backend.sh"
        tmux new-session -d -s bakery-frontend "cd $ROOT_DIR/frontend && ./start-frontend.sh"
        echo "Servers started in tmux sessions:"
        echo "  Backend:  tmux attach -t bakery-backend"
        echo "  Frontend: tmux attach -t bakery-frontend"
    else
        echo "Running in background mode..."
        cd "$ROOT_DIR/backend"
        ./start-backend.sh > /tmp/bakery-backend.log 2>&1 &
        BACKEND_PID=$!
        
        cd "$ROOT_DIR/frontend"
        ./start-frontend.sh > /tmp/bakery-frontend.log 2>&1 &
        FRONTEND_PID=$!
        
        echo "Backend PID: $BACKEND_PID"
        echo "Frontend PID: $FRONTEND_PID"
        echo "Logs: /tmp/bakery-backend.log and /tmp/bakery-frontend.log"
        echo ""
        echo "To stop servers:"
        echo "  kill $BACKEND_PID $FRONTEND_PID"
    fi
fi

echo ""
echo "========================================"
echo "Servers are starting..."
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo ""
