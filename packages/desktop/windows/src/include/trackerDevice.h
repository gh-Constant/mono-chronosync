#ifndef TRACKER_DEVICE_H
#define TRACKER_DEVICE_H

#include <windows.h>
#include <string>
#include <sstream>
#ifdef _DEBUG
#include <iostream>
#endif // _DEBUG

std::string _GetComputerName();
std::string GetOS();
std::string GetOS(bool detail);


#endif // TRACKER_DEVICE_H