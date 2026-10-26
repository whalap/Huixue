@echo off
cd /d "%~dp0"
echo ============================================
echo   E听说练习 - 本地启动器 (Windows)
echo   将通过 http://localhost:8080 打开，麦克风可用
echo   关闭下方的 PowerShell 窗口即可停止服务
echo ============================================
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$root='%~dp0'; $l=New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:8080/'); try { $l.Start() } catch { Write-Host '启动失败：请以管理员身份运行，或修改端口'; pause; exit }; Write-Host 'EShuo local server started at http://localhost:8080  (close this window to stop)'; while($l.IsListening){ $ctx=$l.GetContext(); $req=$ctx.Request; $resp=$ctx.Response; $p=$req.Url.LocalPath; if($p -eq '/'){$p='/index.html'}; $f=Join-Path $root $p.TrimStart('/'); if(Test-Path $f -PathType Leaf){ $ext=[System.IO.Path]::GetExtension($f).ToLower(); $mime=@{'.html'='text/html';'.js'='application/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.svg'='image/svg+xml';'.json'='application/json';'.css'='text/css'}[$ext]; if(-not $mime){$mime='application/octet-stream'}; $b=[System.IO.File]::ReadAllBytes($f); $resp.ContentType=$mime; $resp.ContentLength64=$b.Length; $resp.OutputStream.Write($b,0,$b.Length) } else { $resp.StatusCode=404 }; $resp.Close() }"
timeout /t 2 >nul
start "" http://localhost:8080
