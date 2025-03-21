#ifndef APP_H
#define APP_H

#ifdef _DEBUG
#include <iostream>
#endif // _DEBUG

#include "tracker.h"

void TrackerLoop();
void SaveToFileLoop();

#ifdef _DEBUG
void MessageLoop();
#endif // _DEBUG

void CaffeineLoop();
void Caffeine();
bool IsCaffeine();

void Stop();
bool IsRunning();

#endif // APP_H