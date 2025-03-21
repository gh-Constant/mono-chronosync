#include <comdef.h>
#include <taskschd.h>
#include <string>

#ifdef _DEBUG
#include <iostream>
#endif // _DEBUG

#include "admin.h"
#include "startup.h"

#include "ChronoSync.h"

// Check if the task already exists
bool TaskExists(std::string taskName) {
    UNREFERENCED_PARAMETER(taskName);
    return false;
}

// Create a task to launch ChronoSync with admin privileges
void CreateTask(std::string taskName) {
    UNREFERENCED_PARAMETER(taskName);
}

// Delete a task to launch ChronoSync with admin privileges
void DeleteTask(std::string taskName) {
    UNREFERENCED_PARAMETER(taskName);
}


// Launch a task to start ChronoSync
void LaunchTask(std::string taskName) {
    UNREFERENCED_PARAMETER(taskName);

#ifdef _RELEASE
    std::string appPath(getenv("APPDATA"));
    appPath += "\\ChronoSync\\ChronoSync.exe";
#else
    std::string appPath("C:\\Users\\timot\\Documents\\codage\\chronosync");
    appPath += "\\Build\\Debug\\ChronoSync.exe";
#endif // _RELEASE
    ShellExecuteA(NULL, "open", appPath.c_str(), NULL, NULL, SW_SHOWDEFAULT);
}

int main()
{
    if (!TaskExists("ChronoSync")) {
        RestartAsAdmin();
        
        std::string appPath(getenv("APPDATA"));
        appPath += "\\ChronoSync\\Launcher.exe";

        SetAutoStart(APP_NAME, appPath);

        CreateTask("ChronoSync");
    }
    LaunchTask("ChronoSync");

    return 0;
}
