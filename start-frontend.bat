@echo off
setlocal
set PATH=C:\Program Files\nodejs;%PATH%
echo ==============================================
echo  Starting SmartBus React + Tailwind Frontend...
echo ==============================================
cd frontend
npm run dev
pause
