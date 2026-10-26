@echo off
cd /d %~dp0
echo ================================================
echo   Huixue Learning Site - Local Server (no install)
echo   After it starts, open:  http://localhost:8080
echo   Close this black window = stop the server
echo ================================================
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$root='%~dp0'; $l=New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:8080/'); try { $l.Start() } catch { Write-Host 'Start failed: port 8080 may be in use, or admin rights needed.'; pause; exit }; Write-Host 'Huixue site is running: http://localhost:8080  (close this window to stop)'; while($l.IsListening){ $ctx=$l.GetContext(); $req=$ctx.Request; $resp=$ctx.Response; $p=$req.Url.LocalPath; if($p -eq '/'){$p='/index.html'}; $f=Join-Path $root (($p.TrimStart('/')) -replace '/','\'); if(Test-Path $f -PathType Leaf){ $ext=[System.IO.Path]::GetExtension($f).ToLower(); $mime=@{'.html'='text/html';'.js'='application/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.svg'='image/svg+xml';'.json'='application/json';'.css'='text/css';'.mp3'='audio/mpeg';'.opus'='audio/ogg';'.m4a'='audio/mp4';'.wav'='audio/wav';'.txt'='text/plain; charset=utf-8'}[$ext]; if(-not $mime){$mime='application/octet-stream'}; $b=[System.IO.File]::ReadAllBytes($f); $resp.ContentType=$mime; $resp.ContentLength64=$b.Length; $resp.OutputStream.Write($b,0,$b.Length) } else { $resp.StatusCode=404 }; $resp.Close() }"
timeout /t 1 >nul
start "" http://localhost:8080
