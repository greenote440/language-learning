# Test script for pnpm setup validation
# Run this after pnpm is available in your PATH

Write-Host "Testing pnpm setup..." -ForegroundColor Cyan

# Check pnpm version
Write-Host ""
Write-Host "1. Checking pnpm version:" -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "   [OK] pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] pnpm not found. Please install pnpm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "2. Installing dependencies:" -ForegroundColor Yellow
try {
    pnpm install
    Write-Host "   [OK] Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Type check
Write-Host ""
Write-Host "3. Running TypeScript type check:" -ForegroundColor Yellow
try {
    pnpm type-check
    Write-Host "   [OK] Type checking passed" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] Type checking failed" -ForegroundColor Red
}

# Lint
Write-Host ""
Write-Host "4. Running ESLint:" -ForegroundColor Yellow
try {
    pnpm lint
    Write-Host "   [OK] Linting passed" -ForegroundColor Green
} catch {
    Write-Host "   [WARN] Linting issues found (may be expected for initial setup)" -ForegroundColor Yellow
}

# Build
Write-Host ""
Write-Host "5. Building packages:" -ForegroundColor Yellow
try {
    pnpm build
    Write-Host "   [OK] Build successful" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] Build failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup validation complete!" -ForegroundColor Cyan
