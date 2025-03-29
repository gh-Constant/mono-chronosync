#ifndef TRACKER_WINDOW_H
#define TRACKER_WINDOW_H

#include <windows.h>
#include <psapi.h>


char* GetWindowTitle(HWND hwnd);
char* GetActiveWindowTitle();

char* GetWindowExecutable(HWND hwnd);
char* GetActiveWindowExecutable();
char* GetWindowExecutableName(HWND hwnd);
char* GetActiveWindowExecutableName();


#endif // TRACKER_WINDOW_H