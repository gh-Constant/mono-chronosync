#include "startup.h"


bool IsAutoStart(const char* name)
{
    HKEY hKey;
    LONG lnRes = RegOpenKeyExA(  HKEY_CURRENT_USER,
                                "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
                                0 , KEY_QUERY_VALUE,
                                &hKey);
    if( ERROR_SUCCESS == lnRes )
    {
        char czBuffer[512];
        DWORD dwBufSize = sizeof( czBuffer );
        lnRes = RegQueryValueExA( hKey, name, 0, NULL, (LPBYTE)czBuffer, &dwBufSize );
        RegCloseKey(hKey);
        if( ERROR_SUCCESS == lnRes )
        {
            return true;
        }
    }
    return false;
}

void SetAutoStart(const char* name, std::string appPath)
{
    if (IsAutoStart(name))
        return;
    
    HKEY hKey;
    const char* czStartName = name;
    const char* czExePath   = appPath.c_str();

    LONG lnRes = RegOpenKeyExA(  HKEY_CURRENT_USER,
                                "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
                                0 , KEY_WRITE,
                                &hKey);
    if( ERROR_SUCCESS == lnRes )
    {
        lnRes = RegSetValueExA(  hKey,
                                czStartName,
                                0,
                                REG_SZ,
                                (unsigned char*)czExePath,
                                strlen(czExePath) );
    }

    RegCloseKey(hKey);

}
void DisableAutoStart(const char* name)
{
    HKEY hKey;
    LONG lnRes = RegOpenKeyExA(  HKEY_CURRENT_USER,
                                "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
                                0 , KEY_WRITE,
                                &hKey);
    if( ERROR_SUCCESS == lnRes )
    {
        lnRes = RegDeleteValueA(  hKey, name);
    }

    RegCloseKey(hKey);
}