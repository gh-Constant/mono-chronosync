#include "trackerDevice.h"


std::string _GetComputerName() {
    char computerName[MAX_COMPUTERNAME_LENGTH + 1];
    DWORD size = sizeof(computerName) / sizeof(computerName[0]);
    if (GetComputerNameA(computerName, &size) && size <= MAX_COMPUTERNAME_LENGTH + 1) {
#ifdef _DEBUG
        std::cout << computerName << '\n';
#endif // _DEBUG
        return std::string(computerName);
    }
#ifdef _DEBUG
    std::cout << "None" << '\n';
#endif // _DEBUG
    return "None";
}

std::string GetOS() {
    return GetOS(false);
}

std::string GetOS(bool detail) {
    std::string os;
    std::ostringstream ds;
    int ret = 0;
    
    // Define the function pointer type.
    typedef NTSTATUS(WINAPI *RtlGetVersionFunc)(LPOSVERSIONINFOEXW);
    // Directly cast the result of GetProcAddress.
    HMODULE hMod = GetModuleHandleA("ntdll");
    RtlGetVersionFunc RtlGetVersion = nullptr;

    if (hMod) {
        RtlGetVersion = reinterpret_cast<RtlGetVersionFunc>(
            reinterpret_cast<void*>(GetProcAddress(hMod, "RtlGetVersion"))
        );
    }
    OSVERSIONINFOEXW osInfo;
    if (RtlGetVersion) {
        osInfo.dwOSVersionInfoSize = sizeof(osInfo);
        RtlGetVersion(&osInfo);
        ret = osInfo.dwMajorVersion;
    }

    int mw = osInfo.dwMinorVersion;
    if (ret == 5) {
        switch (mw) {
            case 0:
                // 5.0 = Windows 2000
                os = "Windows 2000";
                break;
            case 1:
                // 5.1 = Windows XP
                os = "Windows XP";
                break;
            case 2:
                os = "Windows XP Professional";
                break;
            default:
                ds.str("");
                ds.clear();
                ds << "Windows " << mw;
                os = ds.str();
                break;
        }
    } else if (ret == 6) {
        switch (mw) {
            case 0:
                os = "Windows Vista";
                break;
            case 1:
                os = "Windows 7";
                break;
            case 2:
                os = "Windows 8";
                break;
            case 3:
                os = "Windows 8.1";
                break;
            default:
                ds.str("");
                ds.clear();
                ds << "Windows " << mw;
                os = ds.str();
                break;
        }
    } else if (ret == 10) {
        ds.str("");
        ds.clear();
        if (osInfo.dwBuildNumber >= 22000) {
            ds << "Windows 11";
        } else {
            ds << "Windows 10";
        }
        if (osInfo.wProductType == VER_NT_WORKSTATION) {
            ds << " Pro";
        } else {
            ds << " Family";
        }
        os = ds.str();
    } else {
        ds.str("");
        ds.clear();
        ds << "Windows " << mw;
        os = ds.str();
    }

    if (detail) {
        ds.str("");
        ds.clear();
        ds << os << " (" << osInfo.dwMajorVersion << "." << osInfo.dwMinorVersion << "." << osInfo.dwBuildNumber << ")";
        os = ds.str();
    }

#ifdef _DEBUG
    std::cout << os << '\n';
#endif
    return os;
}