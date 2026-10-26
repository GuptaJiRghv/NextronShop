@echo off
echo ========================================================
echo        Starting Nextron E-Commerce Shop
echo ========================================================
echo.
echo Starting Backend (Express on port 5000)...
start "Nextron Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend (Vite on port 5173)...
start "Nextron Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Both servers launched!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo.
echo  Admin Login:
echo    Email:    admin@nextron.com
echo    Password: admin
echo ========================================================
