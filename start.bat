@echo off
cd /d "%~dp0"

echo Starting MongoDB and Redis with Docker...
docker-compose up -d mongo redis

echo Starting Data Pipeline...
start "data-pipeline" cmd /k "cd briefai\data-pipeline && npm start"

echo Starting AI Analysis...
start "ai-analysis" cmd /k "cd ai-analysis && call venv\Scripts\activate.bat && python src\scheduler.py"

echo Starting Backend...
start "backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start "frontend" cmd /k "cd frontend && npm start"

exit /b 0
