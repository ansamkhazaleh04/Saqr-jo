@echo off
echo Starting Saqr-JO...

start "Saqr API" cmd /k "cd /d C:\Users\Ansam Alkhazaleh\OneDrive\Desktop\Saqr-JO\source\backend\app && uvicorn api:app --reload --port 8000"

timeout /t 3 /nobreak >nul

start "Saqr Live Monitor" cmd /k "cd /d C:\Users\Ansam Alkhazaleh\OneDrive\Desktop\Saqr-JO\source\backend\app && python saqr_live.py"

timeout /t 3 /nobreak >nul

start "Saqr Frontend" cmd /k "cd /d C:\Users\Ansam Alkhazaleh\OneDrive\Desktop\Saqr-JO\frontend && npm run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173

echo All Saqr services started!
