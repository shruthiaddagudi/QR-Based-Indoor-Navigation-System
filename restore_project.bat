@echo off
echo ======================================================
echo SRIX Pathfinder Project File Restore Script
echo ======================================================
echo.
echo Source: C:\Users\Lenovo\Desktop\qr based indoor navigation system\SRIX_Pathfinder_Phase4_Complete\project
echo Destination: C:\Users\Lenovo\Desktop\SRIX_Pathfinder_Complete\SRIX_Pathfinder_Phase4_Complete\SRIX_Pathfinder_Phase4_Complete\project
echo.
echo Restoring src folder...
xcopy /E /I /Y "C:\Users\Lenovo\Desktop\qr based indoor navigation system\SRIX_Pathfinder_Phase4_Complete\project\src" "C:\Users\Lenovo\Desktop\SRIX_Pathfinder_Complete\SRIX_Pathfinder_Phase4_Complete\SRIX_Pathfinder_Phase4_Complete\project\src"
echo.
echo Restoring public folder...
xcopy /E /I /Y "C:\Users\Lenovo\Desktop\qr based indoor navigation system\SRIX_Pathfinder_Phase4_Complete\project\public" "C:\Users\Lenovo\Desktop\SRIX_Pathfinder_Complete\SRIX_Pathfinder_Phase4_Complete\SRIX_Pathfinder_Phase4_Complete\project\public"
echo.
echo Restoring next-pwa.d.ts file...
copy /Y "C:\Users\Lenovo\Desktop\qr based indoor navigation system\SRIX_Pathfinder_Phase4_Complete\project\next-pwa.d.ts" "C:\Users\Lenovo\Desktop\SRIX_Pathfinder_Complete\SRIX_Pathfinder_Phase4_Complete\SRIX_Pathfinder_Phase4_Complete\project\next-pwa.d.ts"
echo.
echo Clearing old Next.js build cache (.next)...
if exist .next (
    rmdir /s /q .next
    echo Cache successfully cleared!
) else (
    echo No old cache found.
)
echo.
echo ======================================================
echo Restore Complete!
echo ======================================================
echo.
echo Please try running 'npm run dev' in your terminal now.
echo.
pause
