@echo off
echo === Compiling Supabase REST API Test ===

REM Compile the test
x86_64-w64-mingw32-gcc -Wall -Wextra -m64 -o test_supabase.exe test_supabase.c -lwinhttp -lws2_32

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    echo.
    echo === Running Test ===
    echo.
    test_supabase.exe
) else (
    echo Compilation failed!
)

echo.
echo Press any key to exit...
pause > nul 