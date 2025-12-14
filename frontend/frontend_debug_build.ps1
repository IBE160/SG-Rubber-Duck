Write-Host "Running aggressive frontend cleanup and explicit build..."

Write-Host "[1/4] Cleaning npm cache..."
npm cache clean --force

Write-Host "[2/4] Removing old build artifacts and dependencies..."
Remove-Item -Path node_modules, dist, .vite -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[3/4] Reinstalling frontend dependencies..."
npm install

Write-Host "[4/4] Running explicit Vite build..."
npm run build

Write-Host "Cleanup and explicit build complete. You can now run 'npm run dev' to start the development server."
