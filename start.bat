@echo off
echo ===================================
echo    ChronoMap Launcher
echo ===================================
echo.
echo Starting MongoDB, Server and Client...
echo.
echo Press Ctrl+C to stop all services.
echo.

start cmd /k "cd server && npm run dev"
timeout /t 5
start cmd /k "cd client && npm run dev"

echo.
echo All services started!
echo.
echo Access the application at: http://localhost:5173
echo. 