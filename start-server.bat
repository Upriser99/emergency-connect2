@echo off
echo ========================================
echo   Emergency Connect - Local Server
echo ========================================
echo.
echo Starting server on port 8000...
echo.
echo Once started, access the app at:
echo   - On this computer: http://localhost:8000
echo   - On mobile (same WiFi): http://YOUR_IP:8000
echo.
echo To find your IP address, open another PowerShell and run: ipconfig
echo Look for "IPv4 Address" (e.g., 192.168.1.5)
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    python -m http.server 8000
) else (
    echo Python not found. Please install Python or use:
    echo   npm install -g http-server
    echo   http-server -p 8000
    pause
)
