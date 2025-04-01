#include "trackerLogger.h"

#include <vector>



bool ShouldSave = false;
std::filesystem::path filePath;
std::vector<AppLogger> Logger;

void ProgSave()
{
    ShouldSave = true;
}

SYSTEMTIME GetTime()
{
    SYSTEMTIME st;
    GetLocalTime(&st);
    return st;
}

void ClearLogger() 
{
    Logger.clear();
}

void AddEntry(std::string executable, std::string title) 
{
    if (!Logger.empty()) {
        Logger.back().end = GetTime();
    }
    if (Logger.empty() || Logger.back().title != title) {
        if (!Logger.empty() && ShouldSave) {
#ifdef _DEBUG
            PrintToConsole();
#endif // _DEBUG
            PrintToFile();
        }
        Logger.push_back({GetTime(), GetTime(), executable, title});
    }
}


std::string GetLineStr(AppLogger log)
{
    std::stringstream ss;
    ss  << std::setfill('0') << std::setw(4) << log.start.wYear << "-" 
        << std::setfill('0') << std::setw(2) << log.start.wMonth << "-"
        << std::setfill('0') << std::setw(2) << log.start.wDay << " " 
        << std::setfill('0') << std::setw(2) << log.start.wHour << ":" 
        << std::setfill('0') << std::setw(2) << log.start.wMinute << ":" 
        << std::setfill('0') << std::setw(2) << log.start.wSecond << " ; "
        << std::setfill('0') << std::setw(4) << log.end.wYear << "-" 
        << std::setfill('0') << std::setw(2) << log.end.wMonth << "-"
        << std::setfill('0') << std::setw(2) << log.end.wDay << " " 
        << std::setfill('0') << std::setw(2) << log.end.wHour << ":" 
        << std::setfill('0') << std::setw(2) << log.end.wMinute << ":" 
        << std::setfill('0') << std::setw(2) << log.end.wSecond << " ; "
        << log.executable << " ; " 
        << log.title << '\n';
    return ss.str();
}

#ifdef _DEBUG
#include <iostream>
void PrintToConsole() 
{
    for (const auto& log : Logger) {
        std::cout << GetLineStr(log);
    }
}
#endif // _DEBUG

int CreateLogFile() 
{
    std::filesystem::path appDataPath(getenv("APPDATA"));
    filePath = (appDataPath / "ChronoSync" / "Cache" / 
#ifdef _DEBUG
        "testing.txt"
#else 
        "active_window.txt"
#endif
    );
    if (!std::filesystem::exists(filePath)) {
        if (!std::filesystem::create_directories(filePath.parent_path())) {
            return 1;
        }
        std::ofstream file(filePath);
        if (!file) {
            return 1;
        }
    }
    return 0;
}

void PrintToFile() 
{
    std::ofstream outFile(filePath, std::ios::app);
    if (!outFile) {
        return;
    }

    for (const auto& log : Logger) {
        outFile << GetLineStr(log);
    }
    outFile.close();

    Logger.clear();
    ShouldSave = false;
}