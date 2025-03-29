#include "admin.h"



// Function to check if the program is running as Administrator
BOOL IsRunningAsAdmin() 
{
    BOOL isAdmin = FALSE;
    HANDLE hToken = NULL;

    // Open process token
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hToken)) {
        TOKEN_ELEVATION elevation;
        DWORD dwSize;
        
        // Get token elevation info
        if (GetTokenInformation(hToken, TokenElevation, &elevation, sizeof(elevation), &dwSize)) {
            isAdmin = elevation.TokenIsElevated;
        }
        CloseHandle(hToken);
    }
    return isAdmin;
}

void RestartAsAdmin() 
{
    if (IsRunningAsAdmin())
        return;
        
    wchar_t szPath[MAX_PATH];

    // Get the full path of the current executable (wide version)
    if (GetModuleFileNameW(NULL, szPath, ARRAYSIZE(szPath))) {
        SHELLEXECUTEINFOW sei;
        ZeroMemory(&sei, sizeof(sei));  // Clears the struct
        sei.cbSize = sizeof(sei);
        sei.lpVerb = L"runas";  // Request Admin privileges
        sei.lpFile = szPath;
        sei.nShow = SW_NORMAL;

        // Run the process as admin
        if (ShellExecuteExW(&sei)) {
            exit(0); // Close the current instance since the elevated one will start
        }
    }
}