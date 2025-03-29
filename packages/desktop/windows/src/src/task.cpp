#include "ChronoSync.h"
#include <string>


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