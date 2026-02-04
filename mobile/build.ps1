#!/usr/bin/env pwsh

# Shafa Farm Mobile App - Build Script for PowerShell

Write-Host "`n================================" -ForegroundColor Green
Write-Host "   Shafa Farm Mobile App Builder" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Please run this script from the mobile folder" -ForegroundColor Red
    Write-Host "`nUsage: Copy this file to the mobile folder and run it" -ForegroundColor Yellow
    exit 1
}

# Display options
Write-Host "Choose build option:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1 - Build APK for Android (recommended)" -ForegroundColor White
Write-Host "2 - Build both Android and iOS" -ForegroundColor White
Write-Host "3 - View build status" -ForegroundColor White
Write-Host "4 - Download previous build" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`nBuilding Android APK..." -ForegroundColor Cyan
        Write-Host "This may take 10-15 minutes`n" -ForegroundColor Yellow
        eas build --platform android
    }
    "2" {
        Write-Host "`nBuilding for both Android and iOS..." -ForegroundColor Cyan
        Write-Host "This may take 20-30 minutes`n" -ForegroundColor Yellow
        eas build
    }
    "3" {
        Write-Host "`nChecking build status...`n" -ForegroundColor Cyan
        eas build:list
    }
    "4" {
        Write-Host "`nDownloading previous build...`n" -ForegroundColor Cyan
        eas build:download
    }
    default {
        Write-Host "`nInvalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nBuild process completed!" -ForegroundColor Green
Write-Host ""
