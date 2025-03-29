#ifndef TRAY_ICON_H
#define TRAY_ICON_H

#define IDI_ICON1 100 // Replace with a unique ID for your icon. The ID should be higher than 32000 to avoid conflicts with system IDs.
#define WM_USER_TRAYICON WM_USER + 1 // Replace with a unique message ID

#include <windows.h>
#include <psapi.h>
#include <vector>

struct TrayMenu {
    UINT flag;
    UINT_PTR id;
    const char* name;
    std::vector<TrayMenu> SubMenu;
    bool show = true;
};


void CreateTrayIcon(HWND hwnd);
void CreateTrayIcon(HWND hwnd, const char* name);
void CreateTrayIcon(HWND hwnd, const char* name, const char* icon);
void RemoveTrayIcon(HWND hwnd);

void SetTrayCommandCallback(int (*callback)(HWND, WPARAM));
void SetTrayUserCallback(int (*callback)(HWND, LPARAM));
HWND CreateTrayWindow(HINSTANCE hInstance, const char* name);

void CreateTrayMenu(HWND hwnd);
void AddMenuItem(TrayMenu item);
void InitTrayMenu(std::vector<TrayMenu> vMenu);

#endif // TRAY_ICON_H