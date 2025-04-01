# ChronoSync OAuth Flow Test
# This script tests the complete OAuth flow with Google login

$logFile = Join-Path $PSScriptRoot "oauth_log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$dllName = "chronosync_client.dll"
$dllPath = Join-Path $PSScriptRoot $dllName

# Initialize log
Add-Content -Path $logFile -Value "$timestamp - OAuth test script started"

# Record command line arguments
$cmdArgs = $args -join ", "
Add-Content -Path $logFile -Value "$timestamp - Arguments received: $cmdArgs"

# Check if DLL exists
if (-not (Test-Path -Path $dllPath)) {
    $message = "$timestamp - ERROR: DLL not found: $dllPath"
    Add-Content -Path $logFile -Value $message
    Write-Host "ERROR: DLL not found in the current directory!" -ForegroundColor Red
    Write-Host "Please copy '$dllName' to the same directory as this script." -ForegroundColor Yellow
    exit 1
}

# If run with arguments, this script is being called as the protocol handler
if ($args.Length -gt 0) {
    $uri = $args[0]
    Add-Content -Path $logFile -Value "$timestamp - Received callback URI: $uri"
    
    try {
        # Load the DLL and process the token
        $escapedDllPath = $dllPath.Replace("\", "\\")
        
        # Define P/Invoke signature for parse_uri_token
        $code = @"
using System;
using System.Runtime.InteropServices;

public static class ChronosyncClient {
    [DllImport("$escapedDllPath", CallingConvention = CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool parse_uri_token(
        [MarshalAs(UnmanagedType.LPStr)] string uri,
        [MarshalAs(UnmanagedType.LPStr)] System.Text.StringBuilder buffer,
        int buffer_size);
}
"@

        # Add the type definition
        Add-Type -TypeDefinition $code
        
        # Extract the token
        $buffer = New-Object System.Text.StringBuilder 1024
        Add-Content -Path $logFile -Value "$timestamp - Parsing token from URI: $uri"
        $parseResult = [ChronosyncClient]::parse_uri_token($uri, $buffer, 1024)
        
        if ($parseResult) {
            $token = $buffer.ToString()
            Add-Content -Path $logFile -Value "$timestamp - Successfully extracted token"
            
            # Display the token
            Write-Host "ChronoSync OAuth Handler" -ForegroundColor Cyan
            Write-Host "======================" -ForegroundColor Cyan
            Write-Host "`nReceived URI: $uri" -ForegroundColor Green
            Write-Host "`nExtracted token: $token" -ForegroundColor Green
            
            # Save the token to a file
            $tokenFile = Join-Path $PSScriptRoot "oauth_token.txt"
            $token | Out-File -FilePath $tokenFile -Force
            Write-Host "`nToken saved to: $tokenFile" -ForegroundColor Yellow
        } else {
            Add-Content -Path $logFile -Value "$timestamp - Failed to extract token from URI"
            Write-Host "ChronoSync OAuth Handler" -ForegroundColor Cyan
            Write-Host "======================" -ForegroundColor Cyan
            Write-Host "`nReceived URI: $uri" -ForegroundColor Yellow
            Write-Host "`nFailed to extract token from the URI" -ForegroundColor Red
        }
    } catch {
        Add-Content -Path $logFile -Value "$timestamp - Error processing URI: $_"
        Write-Host "Error: $_" -ForegroundColor Red
    }
    
    Write-Host "`nOAuth log:" -ForegroundColor Cyan
    Get-Content -Path $logFile -Tail 10
    
    Write-Host "`nPress Enter to close..." -ForegroundColor DarkGray
    Read-Host | Out-Null
    exit 0
}

# Main OAuth flow test
Write-Host "ChronoSync OAuth Flow Test" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "`nThis script will test the complete OAuth flow with the Google login service."

# First, register the protocol handler
try {
    $protocolName = "chronosync"
    $scriptPath = $MyInvocation.MyCommand.Path
    
    # Create a handler command that will call this script with the URI
    $handlerCommand = "cmd.exe /c start powershell.exe -NoExit -ExecutionPolicy Bypass -File `"$scriptPath`" %1"
    
    Add-Content -Path $logFile -Value "$timestamp - Registering protocol: $protocolName"
    Add-Content -Path $logFile -Value "$timestamp - Handler command: $handlerCommand"
    
    # Register in the registry directly
    $registryPath = "HKCU:\Software\Classes\$protocolName"
    
    # Create protocol key
    if (-not (Test-Path $registryPath)) {
        New-Item -Path $registryPath -Force | Out-Null
    }
    
    # Set default value
    Set-ItemProperty -Path $registryPath -Name "(Default)" -Value "URL:Chronosync Protocol"
    
    # Add URL Protocol marker
    Set-ItemProperty -Path $registryPath -Name "URL Protocol" -Value ""
    
    # Create shell\open\command key
    $commandPath = "$registryPath\shell\open\command"
    if (-not (Test-Path $commandPath)) {
        New-Item -Path $commandPath -Force | Out-Null
    }
    
    # Set command value
    Set-ItemProperty -Path $commandPath -Name "(Default)" -Value $handlerCommand
    
    Add-Content -Path $logFile -Value "$timestamp - Protocol registered successfully"
    Write-Host "`nProtocol handler registered successfully" -ForegroundColor Green
} catch {
    Add-Content -Path $logFile -Value "$timestamp - Error registering protocol: $_"
    Write-Host "`nError registering protocol handler: $_" -ForegroundColor Red
    exit 1
}

# Now use the DLL to initiate the OAuth flow
try {
    $escapedDllPath = $dllPath.Replace("\", "\\")
    
    # Define P/Invoke signature for start_desktop_login
    $code = @"
using System;
using System.Runtime.InteropServices;

public static class ChronosyncClient {
    [DllImport("$escapedDllPath", CallingConvention = CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool start_desktop_login(
        [MarshalAs(UnmanagedType.LPStr)] string redirect_uri);
}
"@

    # Add the type definition
    Add-Type -TypeDefinition $code
    
    # Start the OAuth flow
    $callbackUri = "chronosync://callback"
    Add-Content -Path $logFile -Value "$timestamp - Starting OAuth flow with callback: $callbackUri"
    Write-Host "`nStep 1: Opening browser for Google login..." -ForegroundColor Yellow
    
    $result = [ChronosyncClient]::start_desktop_login($callbackUri)
    
    if ($result) {
        Add-Content -Path $logFile -Value "$timestamp - Browser opened successfully"
        Write-Host "Browser opened successfully" -ForegroundColor Green
        
        Write-Host "`nStep 2: Please complete the login in your browser" -ForegroundColor Yellow
        Write-Host "After login, you should be redirected back to this application." -ForegroundColor Cyan
        Write-Host "A new PowerShell window will open automatically to process the callback." -ForegroundColor Cyan
        
        # Monitor for the token file
        $tokenFile = Join-Path $PSScriptRoot "oauth_token.txt"
        if (Test-Path $tokenFile) {
            Remove-Item $tokenFile -Force
        }
        
        Write-Host "`nChecking for token every 5 seconds..." -ForegroundColor Yellow
        
        # Wait for up to 2 minutes
        $maxWaitSeconds = 120
        $waited = 0
        $tokenReceived = $false
        
        while ($waited -lt $maxWaitSeconds) {
            if (Test-Path $tokenFile) {
                $tokenReceived = $true
                break
            }
            
            Write-Host "." -NoNewline -ForegroundColor DarkGray
            Start-Sleep -Seconds 5
            $waited += 5
        }
        
        Write-Host ""
        
        if ($tokenReceived) {
            $token = Get-Content $tokenFile -Raw
            Write-Host "`nStep 3: Authentication successful!" -ForegroundColor Green
            Write-Host "Token: $token" -ForegroundColor Green
            
            # Validate token format (optional)
            if ($token -match "^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$") {
                Write-Host "Token appears to be in valid JWT format" -ForegroundColor Green
            }
            
            Write-Host "`nOAuth flow completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "`nTimeout waiting for token" -ForegroundColor Red
            Write-Host "Check if the callback was processed correctly" -ForegroundColor Yellow
            Write-Host "You can check the log file for more details: $logFile" -ForegroundColor Yellow
        }
    } else {
        Add-Content -Path $logFile -Value "$timestamp - Failed to open browser"
        Write-Host "Failed to open browser" -ForegroundColor Red
    }
} catch {
    Add-Content -Path $logFile -Value "$timestamp - Error during OAuth flow: $_"
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`nPress Enter to exit..." -ForegroundColor DarkGray
Read-Host | Out-Null 