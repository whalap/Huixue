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
git push -u origin main
if errorlevel 1 (
  echo.
  echo   PUSH FAILED. Common causes:
  echo   - Wrong token (expired / did not check "repo")
  echo   - Wrong username or repo name in the URL
  echo   - The repo is not empty: delete it on GitHub and re-create empty
  echo.
  pause
  exit /b 1
)
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
