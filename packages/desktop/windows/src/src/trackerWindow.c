#include "trackerWindow.h"



char* GetWindowTitle(HWND hwnd)
{
    static char wnd_title[MAX_PATH];
    GetWindowTextA(hwnd, wnd_title, sizeof(wnd_title));
    return wnd_title;
}

char* GetActiveWindowTitle()
{
    HWND hwnd = GetForegroundWindow();  // get handle of currently active window
    return GetWindowTitle(hwnd);
}

char* GetWindowExecutable(HWND hwnd)
{
    static char exePath[MAX_PATH];
    DWORD pid;
    GetWindowThreadProcessId(hwnd, &pid);
    HANDLE process = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, pid);
    if (process != NULL) {
        if (GetModuleFileNameExA(process, NULL, exePath, MAX_PATH) > 0) {
            CloseHandle(process);
            return exePath;
        }
        CloseHandle(process);
    }
    static char empty[] = "";
    return empty;
}

char* GetActiveWindowExecutable()
{
    HWND hwnd = GetForegroundWindow();
    return GetWindowExecutable(hwnd);
}

char* GetWindowExecutableName(HWND hwnd)
{
    char* fullPath = GetWindowExecutable(hwnd);
    char* pos = strrchr(fullPath, '\\');
    return (pos != NULL) ? pos + 1 : fullPath;
}

char* GetActiveWindowExecutableName()
{
    HWND hwnd = GetForegroundWindow();
    return GetWindowExecutableName(hwnd);
}