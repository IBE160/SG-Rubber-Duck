@echo off
echo Running aggressive frontend cleanup and explicit build...

echo [1/4] Cleaning npm cache...
npm cache clean --force

echo [2/4] Removing old build artifacts and dependencies...
REM For Windows PowerShell: Remove-Item -Path node_modules, dist, .vite -Recurse -Force
REM For Windows Command Prompt: rmdir /s /q node_modules dist .vite

rem Using powershell command as that seems to be the users preferred shell
powershell -Command "Remove-Item -Path node_modules, dist, .vite -Recurse -Force -ErrorAction SilentlyContinue"


echo [3/4] Reinstalling frontend dependencies...
npm install

echo [4/4] Running explicit Vite build...
npm run build

echo Cleanup and explicit build complete. You can now run 'npm run dev' to start the development server.
