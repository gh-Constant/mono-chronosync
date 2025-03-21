use std::env;
use std::path::Path;
use chronosync_client::{parse_token_from_uri, ChronosyncConfig, register_uri_protocol};

fn main() {
    // Get command line arguments
    let args: Vec<String> = env::args().collect();
    
    // Define protocol URI for this application
    let protocol_uri = "chronosync://callback";
    
    // If the first argument is "--register", register the URI protocol
    if args.len() > 1 && args[1] == "--register" {
        println!("Registering ChronoSync URI protocol...");
        
        let exe_path = env::current_exe().unwrap_or_default();
        let config = ChronosyncConfig {
            protocol_name: "chronosync".to_string(),
            app_path: exe_path.to_string_lossy().to_string(),
            display_name: "ChronoSync Desktop App".to_string(),
            icon_path: None,
        };
        
        match register_uri_protocol(&config) {
            Ok(_) => println!("Protocol registered successfully!"),
            Err(e) => eprintln!("Failed to register protocol: {}", e),
        }
        
        println!("You can now use '{}' to launch this application.", protocol_uri);
        return;
    }
    
    // If launched with "--login", start the login process
    if args.len() > 1 && args[1] == "--login" {
        println!("Starting desktop login process...");
        println!("Opening browser to desktop login page...");
        
        // Open the login page with our protocol as the redirect URI
        if let Err(e) = chronosync_client::open_login_page(protocol_uri) {
            eprintln!("Failed to open login page: {}", e);
            return;
        }
        
        println!("Login page opened in browser.");
        println!("After logging in, you will be redirected back to this application.");
        return;
    }
    
    // If the application was launched with a URI, handle it
    if args.len() > 1 && args[1].starts_with("chronosync://") {
        let uri = &args[1];
        println!("Received URI: {}", uri);
        
        // Parse the URI to extract the JWT token
        if let Some(token) = parse_token_from_uri(uri) {
            println!("Successfully received JWT token");
            
            // Create the token directory if it doesn't exist
            let app_data_dir = if let Some(app_data) = env::var_os("APPDATA") {
                Path::new(&app_data).join("ChronoSync")
            } else {
                env::temp_dir().join("ChronoSync")
            };
            
            if !app_data_dir.exists() {
                if let Err(e) = std::fs::create_dir_all(&app_data_dir) {
                    eprintln!("Failed to create token directory: {}", e);
                }
            }
            
            // Save the token to a file that the main app can access
            let token_file = app_data_dir.join("auth_token.txt");
            if let Err(e) = std::fs::write(&token_file, &token) {
                eprintln!("Failed to save token: {}", e);
            } else {
                println!("Token saved to: {}", token_file.display());
            }
            
            // Here you would typically notify the main application
            // that a new token has been received, or launch the main app
            println!("Authentication successful! You can now close this window.");
        } else {
            eprintln!("No token found in URI");
        }
    } else {
        println!("ChronoSync Desktop Client");
        println!("This program handles the ChronoSync custom URI protocol for desktop authentication.");
        println!("");
        println!("Usage:");
        println!("  --register    Register the ChronoSync URI protocol");
        println!("  --login       Start the desktop login process");
        println!("");
        println!("After registration, URLs like 'chronosync://callback?token=JWT_TOKEN'");
        println!("will be automatically handled by this application.");
    }
}