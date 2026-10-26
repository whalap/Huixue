@echo off
cd /d %~dp0
echo ================================================================
echo   Huixue Learning Site - One-click publish to GitHub Pages
echo   (free, permanent https link)
echo ================================================================
echo   Prerequisites (do these first on github.com):
echo   1) Register a free GitHub account
echo   2) Create an EMPTY repository (any name, e.g. huixue)
echo   3) Generate a Token:
echo      avatar menu - Settings - Developer settings -
echo      Personal access tokens - Tokens (classic) -
echo      Generate new token (classic) - check "repo" - Generate
echo      Copy the long string (starts with ghp_)
echo   Then run this file and paste the repo URL WITH token:
echo        https://YOUR_TOKEN@github.com/YOUR_NAME/YOUR_REPO.git
echo   (replace the parts, do NOT keep any angle brackets)
echo ================================================================
echo.
echo [1/3] Checking PWA icons...
if not exist "icon-192.png" (
  echo   icon-192.png not found. Running _copy_icons.bat first...
  call "_copy_icons.bat"
) else (
  echo   icon-192.png found. OK.
)
echo.
echo [2/3] Initializing git and committing all files...
rem --- auto-detect git: system PATH, then WorkBuddy portable git, then common installs ---
where git >nul 2>nul
if errorlevel 1 (
  if exist "%LOCALAPPDATA%\Programs\WorkBuddy\resources\vendor\PortableGit\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\WorkBuddy\resources\vendor\PortableGit\cmd;%PATH%"
    echo   Using WorkBuddy portable git.
  ) else if exist "C:\Program Files\Git\cmd\git.exe" (
    set "PATH=C:\Program Files\Git\cmd;%PATH%"
    echo   Using installed git.
  ) else if exist "D:\Users\whalap\AppData\Local\Programs\WorkBuddy\resources\vendor\PortableGit\cmd\git.exe" (
    set "PATH=D:\Users\whalap\AppData\Local\Programs\WorkBuddy\resources\vendor\PortableGit\cmd;%PATH%"
    echo   Using WorkBuddy portable git.
  ) else (
    echo   ERROR: git not found. Please install Git for Windows:
    echo   https://git-scm.com/download/win
    pause
    exit /b 1
  )
)
git --version
if not exist ".git" ( git init )
rem --- set a repo-local identity so commit works (does NOT touch global config) ---
git config user.name "Huixue Publisher"
git config user.email "huixue-publisher@users.noreply.github.com"
git add -A
git commit -m "publish Huixue learning site PWA" --allow-empty
if errorlevel 1 (
  echo   ERROR: commit failed. See message above.
  pause
  exit /b 1
)
echo.
echo [3/3] Paste the repo URL WITH token, then press Enter:
set /p REPO_URL=URL^>
if "%REPO_URL%"=="" (
  echo   ERROR: empty URL. Aborted.
  pause
  exit /b 1
)
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%
git branch -M main
rem --- network stability settings: big push buffer + HTTP/1.1 (more resistant to connection resets) ---
git config http.postBuffer 524288000
git config http.version HTTP/1.1
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 60
rem --- full log so a crash leaves a trace instead of a vanished window ---
set LOGFILE=push_log.txt
echo [%DATE% %TIME%] Starting push attempts > %LOGFILE%
echo [3/3] Pushing (auto-retry up to 5 times if the connection drops)...
echo         Full log is being written to: push_log.txt
set TRY=0
:PUSH_RETRY
set /a TRY+=1
echo [%DATE% %TIME%] Attempt %TRY% starting... >> %LOGFILE%
git push -u origin main >> %LOGFILE% 2>&1
set PE=%errorlevel%
echo [%DATE% %TIME%] git exit code: %PE% >> %LOGFILE%
if %PE%==0 goto PUSH_OK
if %TRY% LSS 5 (
  echo   Attempt %TRY% failed (code %PE%). Waiting 10s before retry...
  ping -n 11 127.0.0.1 >nul
  goto PUSH_RETRY
)
echo.
echo   PUSH FAILED after 5 attempts. See push_log.txt for the full error.
echo   Last 25 lines of the log:
powershell -NoProfile -Command "Get-Content push_log.txt -Tail 25"
echo.
echo   Most likely cause: unstable network to GitHub on a ~150MB push,
echo   or a corrupted local object from earlier interrupted pushes.
echo   - Re-run this file (paste same URL). Uploaded data is cached.
echo   - ALSO check the repo page on github.com: if files are already
echo     there, the push actually succeeded - just enable Pages (no re-push).
goto PUSH_END
:PUSH_OK
echo [%DATE% %TIME%] PUSH SUCCESS >> %LOGFILE%
echo.
echo ================================================================
echo   PUSH SUCCESS! One last step on the GitHub website:
echo   Your repo - Settings - Pages - Branch: select "main" - Save
echo   After about 1 minute, visit:
echo     https://YOUR_NAME.github.io/YOUR_REPO/
echo ================================================================
:PUSH_END
echo.
echo   (Log saved to push_log.txt. Press any key to close.)
pause
exit /b 0
echo.
echo ================================================================
echo   PUSH SUCCESS! One last step on the GitHub website:
echo   Your repo - Settings - Pages - Branch: select "main" - Save
echo   After about 1 minute, visit:
echo     https://YOUR_NAME.github.io/YOUR_REPO/
echo   iPad: open that link in Safari - Share - Add to Home Screen.
echo ================================================================
echo   If you update the site later, just double-click this file
echo   again and paste the same URL. It will commit and push changes.
echo ================================================================
pause
