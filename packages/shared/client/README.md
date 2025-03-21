# ChronoSync Desktop Client Library

This library provides functionality to integrate desktop applications with the ChronoSync web application through custom URI protocol handling and authentication.

## Features

- Register/unregister custom URI protocol handlers in Windows Registry
- Handle incoming URIs to extract JWT tokens
- Redirect users to the web login page
- Simple C API for integration with any language

## Building

### Prerequisites

- Rust toolchain (install from [rustup.rs](https://rustup.rs/))
- Cargo (comes with Rust)

### Build Commands

```powershell
# Build the library in debug mode
cargo build

# Build the library in release mode (recommended for production)
cargo build --release
```

This will produce:
- A dynamic library (DLL) in `target/release/chronosync_client.dll`
- A static library in `target/release/chronosync_client.lib`
- An executable in `target/release/chronosync-client-app.exe`

## Integration Flow

1. **Register Protocol**: During application installation or first launch, register the `chronosync://` protocol
2. **Start Desktop Login**: When the user needs to login, call `start_desktop_login("chronosync://callback")` to open the web login page
3. **Handle Callback**: After authentication, the backend redirects to `chronosync://callback?token=JWT_TOKEN`
4. **Extract Token**: Windows launches your application with the URI, and you extract the JWT token
5. **Use Token**: Store the token and use it for API authentication

## Usage Examples

### Using the Command Line Tool

```powershell
# Register the chronosync:// protocol handler
chronosync-client-app.exe --register

# Start the login process
chronosync-client-app.exe --login
```

### From Rust

```rust
use chronosync_client::{register_uri_protocol, ChronosyncConfig, open_login_page, parse_token_from_uri};

// Create a configuration
let config = ChronosyncConfig {
    protocol_name: "chronosync".to_string(),
    app_path: "C:\\Program Files\\ChronoSync\\ChronoSync.exe".to_string(),
    display_name: "ChronoSync Desktop App".to_string(),
    icon_path: Some("C:\\Program Files\\ChronoSync\\icon.ico".to_string()),
};

// Register the protocol
register_uri_protocol(&config).expect("Failed to register protocol");

// Open the login page in browser (specify the callback URI)
open_login_page("chronosync://callback").expect("Failed to open login page");

// Later, parse a token from a URI
let uri = "chronosync://callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
if let Some(token) = parse_token_from_uri(uri) {
    println!("JWT Token: {}", token);
}
```

### From C/C++

```c
#include "chronosync_client.h"
#include <stdio.h>

int main() {
    // Register the protocol
    bool success = register_protocol(
        "chronosync",
        "C:\\Program Files\\ChronoSync\\ChronoSync.exe",
        "ChronoSync Desktop App",
        "C:\\Program Files\\ChronoSync\\icon.ico"
    );
    
    if (success) {
        printf("Protocol registered successfully\n");
    } else {
        printf("Failed to register protocol\n");
        return 1;
    }
    
    // Open the login page with the callback URI
    start_desktop_login("chronosync://callback");
    
    // Later, parse a token from a URI
    const char* uri = "chronosync://callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    char token_buffer[1024];
    
    if (parse_uri_token(uri, token_buffer, sizeof(token_buffer))) {
        printf("JWT Token: %s\n", token_buffer);
    } else {
        printf("Failed to parse token\n");
    }
    
    return 0;
}
```

## Authentication Flow Details

This client library integrates with ChronoSync's desktop authentication system:

1. The desktop app registers the `chronosync://` protocol with Windows
2. When authentication is needed, the app opens the browser to `https://chronosync.constantsuchet.fr/desktop-login?redirect_uri=chronosync://callback`
3. The user logs in through the web interface
4. After successful authentication, the backend validates the redirect URI and redirects to `chronosync://callback?token=JWT_TOKEN`
5. Windows launches the registered application with this URI
6. The application extracts and stores the JWT token for API authentication

## License

MIT