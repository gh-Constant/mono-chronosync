# ChronoSync Client DLL

A Rust-based DLL that handles OAuth authentication and protocol registration for the ChronoSync desktop application.

## Overview

The ChronoSync Client DLL provides a bridge between the desktop application and the ChronoSync web authentication system. It handles:
- Custom protocol registration (`chronosync://`) for OAuth callbacks
- Browser-based authentication flow
- Token parsing and management
- Cross-platform support (currently Windows-only implementation)

## API Reference

### Functions

#### `init_desktop_client`
Initializes the desktop client and registers the protocol handler.

```c
bool init_desktop_client(const char* exe_path);
```
- **Parameters:**
  - `exe_path`: Full path to the executable that will handle the protocol
- **Returns:** `true` if initialization successful, `false` otherwise
- **Example:**
```cpp
char exePath[MAX_PATH];
GetModuleFileNameA(NULL, exePath, MAX_PATH);
bool success = init_desktop_client(exePath);
```

#### `start_desktop_login`
Initiates the OAuth login process by opening the default browser.

```c
bool start_desktop_login(const char* redirect_uri);
```
- **Parameters:**
  - `redirect_uri`: The URI to redirect to after authentication (e.g., "chronosync://callback")
- **Returns:** `true` if browser opened successfully, `false` otherwise
- **Example:**
```cpp
bool success = start_desktop_login("chronosync://callback");
```

#### `parse_uri_token`
Parses a token from a ChronoSync callback URI.

```c
bool parse_uri_token(const char* uri, char* buffer, int buffer_size);
```
- **Parameters:**
  - `uri`: The callback URI containing the token
  - `buffer`: Buffer to store the extracted token
  - `buffer_size`: Size of the buffer
- **Returns:** `true` if token was successfully parsed, `false` otherwise
- **Example:**
```cpp
char token[1024];
bool success = parse_uri_token("chronosync://callback?token=xyz", token, sizeof(token));
```

#### `register_protocol`
Manually registers the ChronoSync URI protocol (advanced usage).

```c
bool register_protocol(const char* protocol_name, const char* app_path, 
                      const char* display_name, const char* icon_path);
```
- **Parameters:**
  - `protocol_name`: Name of the protocol (e.g., "chronosync")
  - `app_path`: Path to the executable that handles the protocol
  - `display_name`: Display name for the protocol handler
  - `icon_path`: Optional path to an icon file (can be NULL)
- **Returns:** `true` if registration successful, `false` otherwise

#### `unregister_protocol`
Removes the protocol registration (advanced usage).

```c
bool unregister_protocol(const char* protocol_name);
```
- **Parameters:**
  - `protocol_name`: Name of the protocol to unregister
- **Returns:** `true` if unregistration successful, `false` otherwise

## Integration Example

Here's a minimal example of using the DLL in a C++ application:

```cpp
#include <windows.h>
#include <string>
#include <fstream>

// Function prototypes
typedef bool (__cdecl *InitDesktopClientFunc)(const char*);
typedef bool (__cdecl *StartDesktopLoginFunc)(const char*);
typedef bool (__cdecl *ParseUriTokenFunc)(const char*, char*, int);

int main() {
    // Load the DLL
    HMODULE hDll = LoadLibraryA("chronosync_client.dll");
    if (!hDll) return 1;

    // Get function pointers
    auto init_client = (InitDesktopClientFunc)GetProcAddress(hDll, "init_desktop_client");
    auto start_login = (StartDesktopLoginFunc)GetProcAddress(hDll, "start_desktop_login");
    auto parse_token = (ParseUriTokenFunc)GetProcAddress(hDll, "parse_uri_token");
    
    if (!init_client || !start_login || !parse_token) {
        FreeLibrary(hDll);
        return 1;
    }
    
    // Initialize and start login
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    
    if (init_client(exePath)) {
        start_login("chronosync://callback");
    }

    FreeLibrary(hDll);
    return 0;
}
```

## Building from Source

### Prerequisites
- Rust toolchain (rustc, cargo)
- Windows: Visual Studio or MinGW-w64
- Required Rust crates:
  - `winreg` for Windows Registry operations
  - `url` for URI parsing
  - `opener` for browser interaction

### Build Commands
```bash
# Debug build
cargo build

# Release build
cargo build --release
```

The DLL will be generated in `target/debug` or `target/release` depending on the build type.

## Platform Support

Currently implemented for:
- Windows: Full support with Registry-based protocol handling

Planned support for:
- macOS: Using Launch Services for protocol registration
- Linux: Using XDG for protocol registration

## Security Considerations

- The DLL uses HKEY_CURRENT_USER for protocol registration, avoiding the need for admin privileges
- Token parsing is done securely with proper buffer size checks
- No sensitive data is stored in the Registry
- All file operations use safe APIs with proper error handling

## Error Handling

All functions return `bool` to indicate success/failure. In case of failure:
- Check if the DLL is properly loaded
- Ensure the executable path is correct
- Verify write permissions for protocol registration
- Check if a browser is available for the login process

## License

[Your License Here]