@echo off
cd /d %~dp0
rem Copy PWA icons from the workspace _dom folder into this site root.
rem Run this once before publishing (double-click).
copy /Y "..\_dom\icon-192.png" "icon-192.png"
copy /Y "..\_dom\icon-512.png" "icon-512.png"
copy /Y "..\_dom\icon-maskable-512.png" "icon-maskable-512.png"
echo.
echo Done. 3 icons copied to this folder:
echo   icon-192.png / icon-512.png / icon-maskable-512.png
echo.
echo Next: double-click start bat to preview on localhost,
echo or run the GitHub publish bat to push the site online.
pause
