#include "trackerAFK.h"
#include "admin.h"

#include <fstream>
#include <string>
#include <sstream>

#ifdef _DEBUG
#include <iostream>
#endif // _DEBUG


bool _afk_monitoring = true;

bool isSleepPrevented() 
{
    if (!IsRunningAsAdmin()) {
        return false;
    }
    

    HANDLE hReadPipe, hWritePipe;
    SECURITY_ATTRIBUTES sa = {sizeof(SECURITY_ATTRIBUTES), NULL, TRUE};

    // Create a pipe for the child process
    if (!CreatePipe(&hReadPipe, &hWritePipe, &sa, 0)) {
#ifdef _DEBUG
        std::cerr << "Error: Unable to create pipe." << std::endl;
#endif // _DEBUG
        return false;
    }

    STARTUPINFOA si = {};
    PROCESS_INFORMATION pi = {};
    si.cb = sizeof(STARTUPINFOA);
    si.hStdOutput = hWritePipe;
    si.hStdError = hWritePipe;
    si.dwFlags |= STARTF_USESTDHANDLES;

    // Command to execute
    char cmd[] = "cmd /c powercfg /requests";

    // Create the process
    if (!CreateProcessA(NULL, cmd, NULL, NULL, TRUE, CREATE_NO_WINDOW, NULL, NULL, &si, &pi)) {
#ifdef _DEBUG
        std::cerr << "Error: Unable to run powercfg command." << std::endl;
#endif // _DEBUG
        CloseHandle(hReadPipe);
        CloseHandle(hWritePipe);
        return false;
    }

    // Close write end of the pipe
    CloseHandle(hWritePipe);

    // Read output from pipe
    std::stringstream output;
    char buffer[1024];
    DWORD bytesRead;
    while (ReadFile(hReadPipe, buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead > 0) {
        buffer[bytesRead] = '\0';
        output << buffer;
    }

    CloseHandle(hReadPipe);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    // Process output
    std::string line;
    bool foundRequest = false;
    while (std::getline(output, line)) {
        line.pop_back();
#ifdef _DEBUG
        std::cout << line << '\n';
#endif
        if (
            line.find(':') != std::string::npos || line.empty() ||
            line == "None." || line == "Aucune."
        ) {
            continue;
        } 

        foundRequest = true;
        ResetAFKtime();
#ifdef _RELEASE
        break;
#endif
    }

    return foundRequest;
}

bool IsScreenOn() 
{
    return true;
}

void ResetAFKtime() 
{
    // Reset AFK time by simulating a mouse movement
    INPUT input = {};
    input.type = INPUT_MOUSE;
    input.mi.dwFlags = MOUSEEVENTF_MOVE;
    input.mi.dx = 0;
    input.mi.dy = 0;
    SendInput(1, &input, sizeof(INPUT));
}

DWORD AFKtime() 
{
    // Get the last input time
    LASTINPUTINFO lastInputInfo;
    lastInputInfo.cbSize = sizeof(LASTINPUTINFO);
    GetLastInputInfo(&lastInputInfo);

    // Return the time the user has been AFK in milliseconds
    return GetTickCount() - lastInputInfo.dwTime;
}

bool IsAFK(DWORD time) 
{
    return (IsAFKMonitoringActive() && AFKtime() > time && !isSleepPrevented());
}


void BeginAFKMonitoring() {
    _afk_monitoring = true;
}
void EndAFKMonitoring() {
    _afk_monitoring = false;
}
bool IsAFKMonitoringActive() {
    return _afk_monitoring;
}