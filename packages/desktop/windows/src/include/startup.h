#ifndef STARTUP_H
#define STARTUP_H

#include <windows.h>
#include <string>


bool IsAutoStart(const char* name);
void SetAutoStart(const char* name, std::string appPath);
void DisableAutoStart(const char* name);

#endif // STARTUP_H