# Stop on any error
$ErrorActionPreference = "Stop"

Write-Host "=== Compiling Supabase REST API Test ==="

# Ensure we're in the correct directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Get temp directory path
$tempDir = [System.IO.Path]::GetTempPath()
$tempExe = Join-Path $tempDir "test_supabase.exe"

Write-Host "Compiling test_supabase.c to $tempExe..."

# Change to temp directory and compile
Push-Location $tempDir
& x86_64-w64-mingw32-gcc -Wall -Wextra -m64 -o "test_supabase.exe" (Resolve-Path "..\test_supabase.c") -Wl,--subsystem,windows -lwinhttp -lws2_32

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilation successful!"
    Write-Host "Executable location: $tempExe"
    Write-Host "You can run it with: & `"$tempExe`""
} else {
    Write-Host "Compilation failed!"
}

# Return to original directory
Pop-Location 