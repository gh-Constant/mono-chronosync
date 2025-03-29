#ifdef _DEBUG
#include <iostream>
#endif // _DEBUG

#include <windows.h>
#include <string>
#include <unordered_map>

#include "tray.h"
#include "app.h"
#include "admin.h"
#include "startup.h"

#include "ChronoSync.h"

#define _DEBUG_MESSAGE 1

std::unordered_map<std::string, HANDLE> Threads;


#pragma region TRAY_CALLBACK

#define ID_DEBUG 99
#define ID_ABOUT 101
#define ID_AUTOSTART 102
#define ID_EXIT 103
#define ID_CAFFEINE 104
#define ID_INFO 105
#define ID_AFK_MONITORING 106


void CreateTrayMenu() 
{
    std::vector<TrayMenu> menu =
    {
        {MF_STRING, ID_ABOUT, "About", {}},
        {MF_STRING, ID_INFO, "Info", {}},
        {MF_SEPARATOR, 0, "", {}},
        {MF_STRING | (IsCaffeine() ? MF_CHECKED : 0U), ID_CAFFEINE, "Caffeine", {}},
        {MF_STRING | (IsAFKMonitoringActive() ? MF_CHECKED : 0U), ID_AFK_MONITORING, "Monitoring AFK", {}, !IsRunningAsAdmin()},
        {MF_STRING | (IsAutoStart(APP_NAME) ? MF_CHECKED : 0U), ID_AUTOSTART, "AutoStart", {}},
#ifdef _DEBUG
        {MF_SEPARATOR, 0, "", {}},
        {MF_STRING | MF_POPUP, ID_DEBUG, "DEBUG", 
        {
            {MF_STRING, 1000, "Show", {}},
            {MF_STRING, 1001, "Save", {}},
            {MF_STRING, 1002, "Send", {}}
        }},
#endif // _DEBUG
        {MF_SEPARATOR, 0, "", {}},
        {MF_STRING, ID_EXIT, "Exit", {}}
    };
    InitTrayMenu(menu);
}

int TrayCommandCallback(HWND hwnd, WPARAM wParam) {
    switch (LOWORD(wParam)) {
        case ID_EXIT:
            PostMessage(hwnd, WM_CLOSE, 0, 0);
            Stop();
            break;
        case ID_ABOUT:
            MessageBoxA(hwnd, "ChronoSync 0.1.0\nCopyright (c) 2022 ChronoSync. All rights reserved.", "About", MB_OK);
            break;
        case ID_AUTOSTART:
            if (!IsAutoStart(APP_NAME)) {
                std::string appPath(getenv("APPDATA"));
                appPath += "\\ChronoSync\\Launcher.exe";
                SetAutoStart(APP_NAME, appPath);
            } else {
                DisableAutoStart(APP_NAME);
            }
            CreateTrayMenu();
            break;
        case ID_INFO:
            MessageBoxA(hwnd, 
                ("Computer Name: " + _GetComputerName() + "\nOS: " + GetOS(true)).c_str(), 
                "System Info", MB_OK);
            break;
        case ID_CAFFEINE:
            Caffeine();
            if (IsCaffeine()) {
                Threads["Caffeine"] = CreateThread( NULL, 0,
                    (LPTHREAD_START_ROUTINE)(void*)CaffeineLoop,
                    NULL, 0, NULL
                );
                if (Threads["Caffeine"] == NULL) {
                    Caffeine();
                    MessageBoxA(hwnd, "Fail to launch Caffeine mode.", "Caffeine", MB_OK);
                    return -1;
                }
                MessageBoxA(hwnd, "Caffeine mode is now active.", "Caffeine", MB_OK);
            } else {
                if (Threads.find("Caffeine") != Threads.end()) {
                    CloseHandle(Threads["Caffeine"]);
                    Threads.erase("Caffeine");
                }
            }
            CreateTrayMenu();
            break;
        case ID_AFK_MONITORING:
            if (IsAFKMonitoringActive()) {
                EndAFKMonitoring();
            } else {
                BeginAFKMonitoring();
            }
            CreateTrayMenu();
            break;

#ifdef _DEBUG
        case ID_DEBUG:
            MessageBoxA(hwnd, "Debug mode active. This version is not intended for distribution.", "Debug", MB_OK);
            break;
        case 1000:
            PrintToConsole();
            PrintToFile();
            break;
        case 1001:
            PrintToFile();
            break;
        case 1002:
            // TODO: Send data online
            break;
#endif // _DEBUG
        default:
            return -1;
    }
    return 0;
}

int TrayUserCallback(HWND hwnd, LPARAM lParam) {
    if (LOWORD(lParam) == WM_RBUTTONDOWN) { // Right-click detected
        CreateTrayMenu(hwnd);
    }
    if (LOWORD(lParam) == WM_LBUTTONDOWN) {
        MessageBoxA(hwnd, "L'interface utilisateur sera bientôt disponible.", "Prochainement", MB_OK);
    }
    return 0;
}
#pragma endregion TRAY_CALLBACK


int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
#ifdef _RELEASE
    FreeConsole();
#endif // _RELEASE

    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);
    UNREFERENCED_PARAMETER(nCmdShow);

#pragma region TRAY_ICON
    SetTrayCommandCallback(TrayCommandCallback);
    SetTrayUserCallback(TrayUserCallback);
    HWND hwnd = CreateTrayWindow(hInstance, APP_NAME);
    if (hwnd == NULL) {
        return -1;
    }

    CreateTrayMenu();
    CreateTrayIcon(hwnd, APP_NAME);
#pragma endregion TRAY_ICON

    CreateLogFile();

#pragma region CREATE_THREAD
    Threads["Tracker"] = CreateThread( NULL, 0,
        (LPTHREAD_START_ROUTINE)(void*)TrackerLoop,
        NULL, 0, NULL
    );
    if (Threads["Tracker"] == NULL) {
        return 0;
    }

    Threads["SaveToFile"] = CreateThread( NULL, 0,
        (LPTHREAD_START_ROUTINE)(void*)SaveToFileLoop,
        NULL, 0, NULL
    );
    if (Threads["SaveToFile"] == NULL) {
        return 0;
    }


#if defined(_DEBUG) && (_DEBUG_MESSAGE == 1)
    Threads["DebugMessage"] = CreateThread( NULL, 0,
        (LPTHREAD_START_ROUTINE)(void*)MessageLoop,
        NULL, 0, NULL
    );
    if (Threads["DebugMessage"] == NULL) {
        return 0;
    }
#endif // _DEBUG && _DEBUG_MESSAGE
#pragma endregion CREATE_THREAD

    MSG msg;
    while (IsRunning() && GetMessage(&msg, hwnd, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    CloseHandle(Threads["Tracker"]);
    CloseHandle(Threads["SaveToFile"]);
#ifdef _DEBUG
    CloseHandle(Threads["DebugMessage"]);
    PrintToConsole();
#endif // _DEBUG
    PrintToFile();

    for (auto it = Threads.begin(); it != Threads.end(); ++it) {
        if (it->second != NULL) {
            CloseHandle(it->second);
        }
    }
    Threads.clear();

    RemoveTrayIcon(hwnd);
    return 0;
}