/**
 * ChronoSync OAuth Test Program
 * 
 * This program tests the chronosync_client.dll OAuth functionality:
 * 1. When run normally: Registers protocol handler and starts OAuth flow
 * 2. When run with URI: Handles OAuth callback and displays the token
 * 
 * Usage:
 * 1. Build the DLL: 
 *    - cd packages/shared/client
 *    - cargo build --release
 * 2. Copy DLL next to this exe:
 *    - copy target\release\chronosync_client.dll test\
 * 3. Build and run this program
 */

#include <windows.h>
#include <string>
#include <fstream>
#include <shellapi.h>

// DLL function signatures
typedef bool (__cdecl *InitDesktopClientFunc)(const char*);
typedef bool (__cdecl *StartDesktopLoginFunc)(const char*);
typedef bool (__cdecl *ParseUriTokenFunc)(const char*, char*, int);

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Load DLL from same directory as exe
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    
    HMODULE hDll = LoadLibraryA("chronosync_client.dll");
    if (!hDll) return 1;

    // Get DLL functions
    auto init = (InitDesktopClientFunc)GetProcAddress(hDll, "init_desktop_client");
    auto login = (StartDesktopLoginFunc)GetProcAddress(hDll, "start_desktop_login");
    auto parse = (ParseUriTokenFunc)GetProcAddress(hDll, "parse_uri_token");
    if (!init || !login || !parse) {
        FreeLibrary(hDll);
        return 1;
    }

    // Check if we're being called with a URI (OAuth callback)
    int argc;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    if (argv && argc > 1) {
        // Handle OAuth callback
        char uri[1024], token[1024];
        WideCharToMultiByte(CP_UTF8, 0, argv[1], -1, uri, sizeof(uri), NULL, NULL);
        
        if (parse(uri, token, sizeof(token))) {
            std::ofstream("oauth_token.txt") << token;
            MessageBoxA(NULL, token, "Token Received", MB_OK);
        }
        LocalFree(argv);
        FreeLibrary(hDll);
        return 0;
    }
    LocalFree(argv);

    // Normal startup: initialize client and start login
    DeleteFileA("oauth_token.txt");
    if (!init(exePath) || !login("chronosync://callback")) {
        FreeLibrary(hDll);
        return 1;
    }

    // Wait for token file to appear
    while (true) {
        Sleep(1000);
        std::ifstream tokenFile("oauth_token.txt");
        if (tokenFile) {
            std::string token;
            std::getline(tokenFile, token);
            MessageBoxA(NULL, token.c_str(), "Token Received", MB_OK);
            break;
        }
    }

    FreeLibrary(hDll);
    return 0;
} 