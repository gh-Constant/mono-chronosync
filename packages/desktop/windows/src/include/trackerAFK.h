#ifndef TRACKER_AFK_H
#define TRACKER_AFK_H

#define AFK_TIME 180000

#include <windows.h>
#include <psapi.h>

bool IsScreenOn();
bool isSleepPrevented();
void ResetAFKtime();
DWORD AFKtime();
bool IsAFK(DWORD time);

void BeginAFKMonitoring();
void EndAFKMonitoring();
bool IsAFKMonitoringActive();


#endif // TRACKER_AFK_H