#ifndef ADMIN_H
#define ADMIN_H

#include <windows.h>

// Function to check if the program is running as Administrator
BOOL IsRunningAsAdmin();
void RestartAsAdmin();

#endif // ADMIN_H