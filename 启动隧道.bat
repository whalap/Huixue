@echo off
cd /d %~dp0
echo ================================================================
echo   Huixue Learning Site - Public https tunnel (no account / Pinggy)
echo ----------------------------------------------------------------
echo   What it does: temporarily turns your localhost:8080 into a
echo   public https link. Open that link on iPad Safari, then
echo   Share - Add to Home Screen. Works like an app (with mic).
echo   Note: the free tunnel link CHANGES every run - re-run this
echo   file before each class. Close the tunnel window to stop.
echo ================================================================
echo.
echo [1/2] Starting local server (http://localhost:8080)...
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$root='%~dp0'; $l=New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:8080/'); try { $l.Start() } catch { Write-Host 'Start failed: port 8080 may be in use, or admin rights needed.'; pause; exit }; Write-Host 'Huixue site is running: http://localhost:8080  (close this window to stop)'; while($l.IsListening){ $ctx=$l.GetContext(); $req=$ctx.Request; $resp=$ctx.Response; $p=$req.Url.LocalPath; if($p -eq '/'){$p='/index.html'}; $f=Join-Path $root (($p.TrimStart('/')) -replace '/','\'); if(Test-Path $f -PathType Leaf){ $ext=[System.IO.Path]::GetExtension($f).ToLower(); $mime=@{'.html'='text/html';'.js'='application/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.svg'='image/svg+xml';'.json'='application/json';'.css'='text/css';'.mp3'='audio/mpeg';'.opus'='audio/ogg';'.m4a'='audio/mp4';'.wav'='audio/wav';'.txt'='text/plain; charset=utf-8'}[$ext]; if(-not $mime){$mime='application/octet-stream'}; $b=[System.IO.File]::ReadAllBytes($f); $resp.ContentType=$mime; $resp.ContentLength64=$b.Length; $resp.OutputStream.Write($b,0,$b.Length) } else { $resp.StatusCode=404 }; $resp.Close() }"
timeout /t 3 >nul
echo.
echo [2/2] Opening the public https tunnel...
echo       First run asks: "Are you sure you want to continue (yes/no)?"
echo       Type yes and press Enter. A https:// link will appear below.
echo.
echo ================================================================
where ssh >nul 2>nul
if errorlevel 1 (
  echo [ERROR] ssh not found on this PC.
  echo   Enable built-in OpenSSH first:
  echo   Settings - Apps - Optional features - Add "OpenSSH Client",
  echo   then run this file again.
  pause
  exit /b
)
ssh -p 443 -R0:localhost:8080 qr@free.pinggy.io
echo.
echo Tunnel closed. Double-click this file again to get a new link.
pause
