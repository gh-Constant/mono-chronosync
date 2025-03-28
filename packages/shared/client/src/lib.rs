use std::env;
use std::ffi::{c_char, CStr, CString};
use std::error::Error;
use winreg::enums::*;
use winreg::RegKey;
use url::Url;

/// Represents the configuration for the ChronoSync URI protocol handler
pub struct ChronosyncConfig {
    pub protocol_name: String,
    pub app_path: String,
    pub display_name: String,
    pub icon_path: Option<String>,
}

impl Default for ChronosyncConfig {
    fn default() -> Self {
        ChronosyncConfig {
            protocol_name: "chronosync".to_string(),
            app_path: env::current_exe().unwrap_or_default().to_string_lossy().to_string(),
            display_name: "ChronoSync Desktop App".to_string(),
            icon_path: None,
        }
    }
}

/// Function to register the ChronoSync URI protocol in Windows Registry
pub fn register_uri_protocol(config: &ChronosyncConfig) -> Result<(), Box<dyn Error>> {
    // Open HKEY_CURRENT_USER
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    
    // Create the base protocol key
    let protocol_key_path = format!("Software\\Classes\\{}", config.protocol_name);
    let (protocol_key, _) = hkcu.create_subkey(&protocol_key_path)?;
    
    // Set default value to display name
    protocol_key.set_value("", &config.display_name)?;
    protocol_key.set_value("URL Protocol", &String::new())?;
    
    // Set icon if provided
    if let Some(icon_path) = &config.icon_path {
        let (icon_key, _) = protocol_key.create_subkey("DefaultIcon")?;
        icon_key.set_value("", icon_path)?;
    }
    
    // Set up command
    let (command_key, _) = protocol_key.create_subkey("shell\\open\\command")?;
    let command_value = format!("\"{}\" \"%1\"", config.app_path);
    command_key.set_value("", &command_value)?;
    
    Ok(())
}

/// Function to unregister the ChronoSync URI protocol
pub fn unregister_uri_protocol(protocol_name: &str) -> Result<(), Box<dyn Error>> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let protocol_key_path = format!("Software\\Classes\\{}", protocol_name);
    
    // Attempt to delete the key recursively
    hkcu.delete_subkey_all(protocol_key_path)?;
    
    Ok(())
}

/// Opens the desktop login page in the default browser
pub fn open_login_page(redirect_uri: &str) -> Result<(), Box<dyn Error>> {
    // Use the exact URL from the frontend code
    let login_url = format!("https://chronosync.constantsuchet.fr/desktop-login?redirect_uri={}", 
                           url::form_urlencoded::byte_serialize(redirect_uri.as_bytes()).collect::<String>());
    
    // Open the URL in the default browser
    opener::open(&login_url)?;
    
    Ok(())
}

/// Parses and extracts the JWT token from a ChronoSync URI
pub fn parse_token_from_uri(uri: &str) -> Option<String> {
    match Url::parse(uri) {
        Ok(parsed_url) => {
            // Check if this is a ChronoSync URI
            if parsed_url.scheme() == "chronosync" {
                // Extract the token parameter
                for (key, value) in parsed_url.query_pairs() {
                    if key == "token" {
                        return Some(value.to_string());
                    }
                }
            }
            None
        },
        Err(_) => None,
    }
}

// DLL exports for C/C++ interoperability

/// Register the ChronoSync URI protocol
#[no_mangle]
pub extern "C" fn register_protocol(
    protocol_name: *const c_char,
    app_path: *const c_char,
    display_name: *const c_char,
    icon_path: *const c_char
) -> bool {
    // Convert C strings to Rust strings
    let protocol = unsafe { 
        if protocol_name.is_null() { return false; }
        CStr::from_ptr(protocol_name).to_string_lossy().to_string()
    };
    
    let app = unsafe { 
        if app_path.is_null() { return false; }
        CStr::from_ptr(app_path).to_string_lossy().to_string()
    };
    
    let display = unsafe { 
        if display_name.is_null() { return false; }
        CStr::from_ptr(display_name).to_string_lossy().to_string()
    };
    
    let icon = unsafe { 
        if icon_path.is_null() {
            None
        } else {
            Some(CStr::from_ptr(icon_path).to_string_lossy().to_string())
        }
    };
    
    let config = ChronosyncConfig {
        protocol_name: protocol,
        app_path: app,
        display_name: display,
        icon_path: icon,
    };
    
    match register_uri_protocol(&config) {
        Ok(_) => true,
        Err(_) => false,
    }
}

/// Unregister the ChronoSync URI protocol
#[no_mangle]
pub extern "C" fn unregister_protocol(protocol_name: *const c_char) -> bool {
    let protocol = unsafe { 
        if protocol_name.is_null() { return false; }
        CStr::from_ptr(protocol_name).to_string_lossy().to_string()
    };
    
    match unregister_uri_protocol(&protocol) {
        Ok(_) => true,
        Err(_) => false,
    }
}

/// Opens the desktop login page in the default browser
#[no_mangle]
pub extern "C" fn start_desktop_login(redirect_uri: *const c_char) -> bool {
    let uri = unsafe { 
        if redirect_uri.is_null() { return false; }
        match CStr::from_ptr(redirect_uri).to_str() {
            Ok(s) => s,
            Err(_) => return false,
        }
    };
    
    // Construct the login URL
    let login_url = format!(
        "https://chronosync.constantsuchet.fr/desktop-login?redirect_uri={}",
        url::form_urlencoded::byte_serialize(uri.as_bytes()).collect::<String>()
    );

    // Try to open the URL and handle any errors
    match opener::open(&login_url) {
        Ok(_) => true,
        Err(e) => {
            eprintln!("Failed to open browser: {}", e);
            false
        }
    }
}

/// Parse a token from a ChronoSync URI
#[no_mangle]
pub extern "C" fn parse_uri_token(uri: *const c_char, buffer: *mut c_char, buffer_size: usize) -> bool {
    let uri_str = unsafe { 
        if uri.is_null() { return false; }
        CStr::from_ptr(uri).to_string_lossy().to_string()
    };
    
    if let Some(token) = parse_token_from_uri(&uri_str) {
        unsafe {
            if buffer.is_null() { return false; }
            
            let c_token = match CString::new(token) {
                Ok(s) => s,
                Err(_) => return false,
            };
            
            let token_bytes = c_token.as_bytes_with_nul();
            if token_bytes.len() > buffer_size {
                return false; // Buffer too small
            }
            
            std::ptr::copy_nonoverlapping(
                token_bytes.as_ptr() as *const c_char,
                buffer,
                token_bytes.len()
            );
            
            return true;
        }
    }
    
    false
}

/// Initialize the desktop client with protocol registration
#[no_mangle]
pub extern "C" fn init_desktop_client(exe_path: *const c_char) -> bool {
    let path = unsafe { 
        if exe_path.is_null() { return false; }
        CStr::from_ptr(exe_path).to_string_lossy().to_string()
    };
    
    let config = ChronosyncConfig {
        protocol_name: "chronosync".to_string(),
        app_path: path,
        display_name: "ChronoSync Desktop App".to_string(),
        icon_path: None,
    };
    
    match register_uri_protocol(&config) {
        Ok(_) => true,
        Err(_) => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_parse_token() {
        let uri = "chronosync://callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        let token = parse_token_from_uri(uri);
        assert_eq!(token, Some("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9".to_string()));
    }
}