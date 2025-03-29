#ifndef TRACKER_LOGGER_H
#define TRACKER_LOGGER_H

#include <windows.h>
#include <string>
#include <fstream>
#include <filesystem>

typedef struct {
    SYSTEMTIME start;
    SYSTEMTIME end;
    std::string executable;
    std::string title;
} AppLogger;

void ProgSave();
SYSTEMTIME GetTime();

void ClearLogger();
void AddEntry(std::string executable, std::string title);

#ifdef _DEBUG
void PrintToConsole();
#endif // _DEBUG

int CreateLogFile();
void PrintToFile();

#endif // TRACKER_LOGGER_H