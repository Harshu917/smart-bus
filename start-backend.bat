@echo off
setlocal
set PATH=C:\Program Files\nodejs;%PATH%
echo ==============================================
echo  Starting SmartBus Node.js Backend Server...
echo ==============================================
cd backend
npm run dev
pause
