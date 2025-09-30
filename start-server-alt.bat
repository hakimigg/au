@echo off
echo Starting alternative local development server on port 3000...
echo.
echo Your website will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 3000
pause
