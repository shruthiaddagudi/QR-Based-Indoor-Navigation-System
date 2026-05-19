@echo off
echo ======================================================
echo Shutting down existing processes (Node, Ngrok)...
echo ======================================================
taskkill /f /im node.exe 2>nul
taskkill /f /im ngrok.exe 2>nul
echo Done!
echo.

echo ======================================================
echo Starting Next.js Dev Server...
echo ======================================================
start "Next.js Server" cmd /k npm run dev
echo Server launched in new window. Waiting 5 seconds for initialization...
timeout /t 5 >nul
echo.

echo ======================================================
echo Starting Ngrok Tunnel...
echo ======================================================
start "Ngrok Tunnel" cmd /k ngrok http 3000
echo Ngrok launched in new window.
echo.

echo ======================================================
echo Startup Complete!
echo ======================================================
echo You should see two terminal windows now:
echo 1. One running Next.js Server
echo 2. One running Ngrok (showing your mobile HTTPS link)
echo.
pause
