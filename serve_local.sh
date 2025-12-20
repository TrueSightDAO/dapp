#!/bin/bash

# Local server script for serving the dapp
# This allows Google Places API to work (requires http:// not file://)

PORT=${1:-8000}

# Function to check if port is in use
check_port() {
    if command -v lsof &> /dev/null; then
        lsof -i :$1 > /dev/null 2>&1
        return $?
    elif command -v netstat &> /dev/null; then
        netstat -an | grep -q ":$1.*LISTEN"
        return $?
    else
        # If we can't check, just try and let Python handle the error
        return 1
    fi
}

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    local max_attempts=10
    
    for i in $(seq 0 $max_attempts); do
        if ! check_port $port; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done
    
    echo ""
    return 1
}

# Check if the requested port is available
if check_port $PORT; then
    echo "Port $PORT is already in use."
    echo "Attempting to find an available port..."
    AVAILABLE_PORT=$(find_available_port $PORT)
    
    if [ -z "$AVAILABLE_PORT" ]; then
        echo "Error: Could not find an available port. Please stop the process using port $PORT or try a different port."
        echo ""
        echo "To find what's using port $PORT, run:"
        if command -v lsof &> /dev/null; then
            echo "  lsof -i :$PORT"
        else
            echo "  netstat -an | grep $PORT"
        fi
        exit 1
    else
        echo "Using port $AVAILABLE_PORT instead."
        PORT=$AVAILABLE_PORT
    fi
fi

echo "Starting local server on port $PORT..."
echo "Opening browser to: http://127.0.0.1:$PORT/shipping_planner.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Function to open browser
open_browser() {
    local url="http://127.0.0.1:$1/shipping_planner.html"
    
    # Wait a moment for server to start
    sleep 1
    
    # Try to open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$url"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            xdg-open "$url"
        elif command -v gnome-open &> /dev/null; then
            gnome-open "$url"
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "$url"
    fi
}

# Open browser in background
open_browser $PORT &

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "Error: Python is not installed. Please install Python to use this script."
    exit 1
fi

