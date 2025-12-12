@echo off
echo ===================================================
echo   SG-Rubber-Duck Development Starter
echo ===================================================

echo [1/2] Starting Backend (Port 8002)...
start "Backend API" cmd /k "python -m uvicorn backend.main:app --reload --port 8002"

echo [2/2] Starting Frontend...
cd frontend
start "Frontend App" cmd /k "npm run dev"
cd ..

echo.
echo ===================================================
echo   Startup initiated!
echo   - Backend: http://localhost:8002
echo   - Frontend: http://localhost:5173
echo ===================================================
echo.
