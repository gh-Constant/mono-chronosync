#include "app.h"

#define TIME_BETWEEN_SAVE 180000


bool _is_running = true;
bool _is_caffeine = false;
bool _is_afk = false;
bool _is_locked = true;

void StopAfk()
{
    for (int i = 0; i < 4; i++) {
        ResetAFKtime();
        Sleep(500);
    }
}


void TrackerLoop() {
    while (IsRunning()) 
    {
        std::string exec = GetActiveWindowExecutableName();
        std::string title = GetActiveWindowTitle();
        if ( exec == "LockApp.exe" ) {
            _is_locked = true;
            AddEntry("AFK", "Lock");
        } else if (!_is_locked && !IsCaffeine() && IsAFK(AFK_TIME))  {
            _is_afk = true;
            AddEntry("AFK", "AFK");
        } else {
            if (_is_afk || _is_locked) {
                StopAfk();
                _is_afk = false;
                _is_locked = false;
            } else {
                AddEntry(exec, title);
            }
        }
        Sleep((_is_afk || _is_locked) ? 10000 : 1000);
    }
}

void SaveToFileLoop() 
{
    while (IsRunning())
    {
        Sleep(TIME_BETWEEN_SAVE);
        ProgSave();
    }
}

#ifdef _DEBUG
void MessageLoop() 
{
    while (IsRunning())
    {
        if (!IsCaffeine() && IsAFK(AFK_TIME)) {
            std::cout << "AFK\n";
        }
        if (!IsScreenOn()) {
            std::cout << "Screen OFF\n";
        }
        if (isSleepPrevented()) {
            std::cout << "Sleep Prevented\n";
        }
        Sleep(5000);
    }
}
#endif // _DEBUG


void CaffeineLoop()
{
    while (IsRunning() && IsCaffeine()) {
        ResetAFKtime();
        Sleep(30000);
    }
}

void Caffeine()
{
    _is_caffeine = !_is_caffeine;
}

bool IsCaffeine()
{
    return _is_caffeine;
}


void Stop()
{
    _is_running = false;
}
bool IsRunning()
{
    return _is_running;
}