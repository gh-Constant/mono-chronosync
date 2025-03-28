#include <windows.h>
#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <shellapi.h>

// Function prototypes from the DLL
typedef bool (__cdecl *StartDesktopLoginFunc)(const char*);
typedef bool (__cdecl *ParseUriTokenFunc)(const char*, char*, int);

// Global DLL handle and function pointers
HMODULE hDll = NULL;
StartDesktopLoginFunc start_desktop_login = NULL;
ParseUriTokenFunc parse_uri_token = NULL;

// Helper function to log messages silently
void log_message(const std::string& message, const std::string& logFile) {
    std::ofstream log(logFile, std::ios::app);
    time_t now = time(0);
    std::string timestamp = ctime(&now);
    timestamp = timestamp.substr(0, timestamp.length() - 1);
    log << timestamp << " - " << message << std::endl;
}

// Helper function to register protocol handler
bool register_protocol_handler(const std::string& protocolName, const std::string& exePath) {
    std::string cmdLine = "\"" + exePath + "\" \"%1\"";  // Added quotes around %1
    
    HKEY hKey;
    std::string keyPath = "Software\\Classes\\" + protocolName;
    
    if (RegCreateKeyExA(HKEY_CURRENT_USER, keyPath.c_str(), 0, NULL, 0, 
                        KEY_WRITE, NULL, &hKey, NULL) != ERROR_SUCCESS) {
        return false;
    }
    
    std::string protocolDesc = "URL:" + protocolName + " Protocol";
    RegSetValueExA(hKey, NULL, 0, REG_SZ, 
                   (BYTE*)protocolDesc.c_str(), protocolDesc.length() + 1);
    RegSetValueExA(hKey, "URL Protocol", 0, REG_SZ, (BYTE*)"", 1);
    
    HKEY hKeyCommand;
    if (RegCreateKeyExA(hKey, "shell\\open\\command", 0, NULL, 0,
                        KEY_WRITE, NULL, &hKeyCommand, NULL) != ERROR_SUCCESS) {
        RegCloseKey(hKey);
        return false;
    }
    
    RegSetValueExA(hKeyCommand, NULL, 0, REG_SZ,
                   (BYTE*)cmdLine.c_str(), cmdLine.length() + 1);
    
    RegCloseKey(hKeyCommand);
    RegCloseKey(hKey);
    return true;
}

// Helper function to check if file exists
bool file_exists(const std::string& filename) {
    std::ifstream file(filename);
    return file.good();
}

// Helper function to load DLL and get function pointers
bool load_dll_functions() {
    const std::string dllName = "chronosync_client.dll";
    
    hDll = LoadLibraryA(dllName.c_str());
    if (!hDll) {
        return false;
    }
    
    start_desktop_login = (StartDesktopLoginFunc)GetProcAddress(hDll, "start_desktop_login");
    parse_uri_token = (ParseUriTokenFunc)GetProcAddress(hDll, "parse_uri_token");
    
    if (!start_desktop_login || !parse_uri_token) {
        FreeLibrary(hDll);
        return false;
    }
    
    return true;
}

// Entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    const std::string logFile = "oauth_log.txt";
    const std::string tokenFile = "oauth_token.txt";

    // Get the full path of the executable
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);

    // Parse command line properly
    int argc;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    if (argv != NULL) {
        // If we have arguments and it starts with our protocol
        if (argc > 1) {
            // Convert wide string to narrow string
            int size_needed = WideCharToMultiByte(CP_UTF8, 0, argv[1], -1, NULL, 0, NULL, NULL);
            std::string uri(size_needed, 0);
            WideCharToMultiByte(CP_UTF8, 0, argv[1], -1, &uri[0], size_needed, NULL, NULL);

            log_message("Received callback URI: " + uri, logFile);
            
            // Load DLL for parsing token
            if (!load_dll_functions()) {
                LocalFree(argv);
                return 1;
            }
            
            char buffer[1024];
            if (parse_uri_token(uri.c_str(), buffer, sizeof(buffer))) {
                std::string token = buffer;
                log_message("Successfully extracted token", logFile);
                
                std::ofstream tokenOut(tokenFile);
                tokenOut << token;
                tokenOut.close();
                
                // Show token in a message box
                MessageBoxA(NULL, token.c_str(), "Authentication Successful", MB_OK | MB_ICONINFORMATION);
            }
            
            if (hDll) {
                FreeLibrary(hDll);
            }
            LocalFree(argv);
            return 0;
        }
        LocalFree(argv);
    }

    // Delete any existing token file before starting
    DeleteFileA(tokenFile.c_str());

    // Silent initialization
    if (!load_dll_functions()) {
        return 1;
    }

    // Register protocol handler with the full executable path
    if (!register_protocol_handler("chronosync", exePath)) {
        FreeLibrary(hDll);
        return 1;
    }

    // Start OAuth process
    if (!start_desktop_login("chronosync://callback")) {
        FreeLibrary(hDll);
        return 1;
    }

    // Wait for token file (up to 2 minutes)
    const int maxWaitSeconds = 120;
    int waited = 0;
    
    while (waited < maxWaitSeconds) {
        if (file_exists(tokenFile)) {
            // Read and display the token
            std::ifstream tokenIn(tokenFile);
            std::string token;
            std::getline(tokenIn, token);
            tokenIn.close();
            MessageBoxA(NULL, token.c_str(), "Authentication Successful", MB_OK | MB_ICONINFORMATION);
            break;
        }
        Sleep(1000); // Check every second
        waited++;
    }

    if (hDll) {
        FreeLibrary(hDll);
    }

    return 0;
} 