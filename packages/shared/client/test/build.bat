@echo off
setlocal

echo Building OAuth Test...

:: Set compiler and linker flags
set CFLAGS=-mwindows
set LIBS=-ladvapi32 -luser32 -static-libgcc -static-libstdc++

:: Compile for 64-bit
g++ -o oauth_test.exe oauth_test.cpp %CFLAGS% %LIBS% -Wall

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    exit /b 1
)

echo Build successful! Created oauth_test.exe

:: Copy DLL to same directory as executable
if exist "chronosync_client.dll" (
    echo Copying DLL...
    copy /Y chronosync_client.dll .
)

echo.
echo To run the program:
echo oauth_test.exe

pause 