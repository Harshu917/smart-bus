@echo off
setlocal
set PATH=C:\Program Files\nodejs;%PATH%

echo ==========================================================
echo        SMART BUS TRANSIT SYSTEM - LAUNCHER
echo ==========================================================
echo  [1/2] Starting Node.js Backend Server on http://localhost:5000
start "SmartBus Backend (Port 5000)" cmd /k "cd backend && npm run dev"

echo  [2/2] Starting React + Tailwind Frontend on http://localhost:5173
start "SmartBus Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo  ==========================================================
echo   Both services are launching in separate console windows!
echo   Open your browser at: http://localhost:5173
echo  ==========================================================
echo.
pause
