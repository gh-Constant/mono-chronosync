#include "tray.h"



std::vector<TrayMenu> Menu;
NOTIFYICONDATAA nid;
int (*TrayCommandCallback)(HWND, WPARAM) = nullptr;
int (*TrayUserCallback)(HWND, LPARAM) = nullptr;


void CreateTrayIcon(HWND hwnd) 
{
    CreateTrayIcon(hwnd, "TrayIcon");
}

void CreateTrayIcon(HWND hwnd, const char* name) 
{
    CreateTrayIcon(hwnd, name, "icon.ico");
}

void CreateTrayIcon(HWND hwnd, const char* name, const char* icon) 
{
    nid.cbSize = sizeof(nid);
    nid.hWnd = hwnd;
    nid.uID = IDI_ICON1;
    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    nid.uCallbackMessage = WM_USER_TRAYICON; // Important for handling clicks
    nid.hIcon = (HICON)LoadImageA(GetModuleHandle(NULL), icon, IMAGE_ICON, 0, 0, LR_LOADFROMFILE | LR_DEFAULTSIZE);
    strncpy_s(nid.szTip, sizeof(nid.szTip) - 1, name, _TRUNCATE);
    
    if (!Shell_NotifyIconA(NIM_ADD, &nid)) {
        MessageBoxA(NULL, "Failed to create tray icon", "Error", MB_ICONERROR);
    }
}

void RemoveTrayIcon(HWND hwnd) 
{
    nid.hWnd = hwnd;
    Shell_NotifyIconA(NIM_DELETE, &nid);
}

void SetTrayCommandCallback(int (*callback)(HWND, WPARAM)) {
    if (callback == nullptr) {
        return;
    }
    TrayCommandCallback = callback;
}

void SetTrayUserCallback(int (*callback)(HWND, LPARAM)) {
    if (callback == nullptr) {
        return;
    }
    TrayUserCallback = callback;
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    // Handle window messages
    switch (uMsg) {
        case WM_DESTROY:
            PostQuitMessage(0);
            return 0;
        case WM_USER_TRAYICON:
            if (TrayUserCallback != nullptr) {
                return TrayUserCallback(hwnd, lParam);
            }
            break;
        case WM_COMMAND:
            if (TrayCommandCallback != nullptr) {
                return TrayCommandCallback(hwnd, wParam);
            }
            break;
        
        default:
            return DefWindowProc(hwnd, uMsg, wParam, lParam);
    }
    return 0;
}

HWND CreateTrayWindow(HINSTANCE hInstance, const char* name)
{
    WNDCLASSEXA wc = {};
    wc.style = 0;
    wc.cbSize = sizeof(wc);
    wc.lpfnWndProc = WindowProc;
    wc.cbClsExtra = 0;
    wc.cbWndExtra = 0;
    wc.hInstance = hInstance;
    wc.hIcon = NULL;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.lpszMenuName = NULL;
    wc.lpszClassName = name;
    wc.hIconSm = NULL;
    RegisterClassExA(&wc);

    HWND hwnd = CreateWindowExA(
        0,
        name,
        NULL,
        WS_POPUP,
        0, 0, 0, 0,
        NULL,
        NULL,
        hInstance,
        NULL
    );
    if (hwnd == NULL) {
        return NULL;
    }

    ShowWindow(hwnd, SW_HIDE);
    return hwnd;
}

void _CreateMenu(HMENU hMenu, std::vector<TrayMenu> vMenu)
{
    for (TrayMenu Item : vMenu) {
        if (!Item.show) {
            continue;
        }
        if (Item.SubMenu.empty()) {
            AppendMenuA(hMenu, Item.flag, Item.id, Item.name);
        } else {
            HMENU hSubMenu = CreatePopupMenu();
            _CreateMenu(hSubMenu, Item.SubMenu);
            AppendMenuA(hMenu, Item.flag, (UINT_PTR)hSubMenu, Item.name);

        }
    }
}

void CreateTrayMenu(HWND hwnd) 
{
    POINT pt;
    GetCursorPos(&pt); // Get the cursor position
    
    HMENU hMenu = CreatePopupMenu();
    _CreateMenu(hMenu, Menu);

    SetForegroundWindow(hwnd); // Required for menu to work correctly

    TrackPopupMenu(hMenu, TPM_RIGHTBUTTON | TPM_BOTTOMALIGN | TPM_LEFTALIGN, 
                    pt.x, pt.y, 0, hwnd, NULL);
    DestroyMenu(hMenu);
}



void AddMenuItem(TrayMenu item) 
{
    Menu.push_back(item);
}

void InitTrayMenu(std::vector<TrayMenu> vMenu)
{
    Menu = vMenu;
}