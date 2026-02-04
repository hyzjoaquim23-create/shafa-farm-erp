@echo off
REM Shafa Farm Mobile App - Build Script for Windows

echo.
echo ================================
echo   Shafa Farm Mobile App Builder
echo ================================
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo ERROR: Please run this script from the mobile folder
    echo.
    echo Usage: Copy this file to the mobile folder and run it
    pause
    exit /b 1
)

REM Display options
echo Choose build option:
echo.
echo 1 - Build APK for Android (recommended)
echo 2 - Build both Android and iOS
echo 3 - View build status
echo 4 - Download previous build
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Building Android APK...
    echo This may take 10-15 minutes
    echo.
    eas build --platform android
    
) else if "%choice%"=="2" (
    echo.
    echo Building for both Android and iOS...
    echo This may take 20-30 minutes
    echo.
    eas build
    
) else if "%choice%"=="3" (
    echo.
    echo Checking build status...
    echo.
    eas build:list
    
) else if "%choice%"=="4" (
    echo.
    echo Downloading previous build...
    echo.
    eas build:download
    
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo Build process completed!
echo.
pause
