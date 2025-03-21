#ifndef CHRONOSYNC_CLIENT_H
#define CHRONOSYNC_CLIENT_H

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Register a custom URI protocol handler for ChronoSync
 * 
 * @param protocol_name The protocol name (e.g. "chronosync")
 * @param app_path The full path to the application executable
 * @param display_name A user-friendly display name
 * @param icon_path Path to an icon file (optional, can be NULL)
 * @return true on success, false on failure
 */
bool register_protocol(
    const char* protocol_name,
    const char* app_path,
    const char* display_name,
    const char* icon_path
);

/**
 * Unregister a custom URI protocol handler
 * 
 * @param protocol_name The protocol name (e.g. "chronosync")
 * @return true on success, false on failure
 */
bool unregister_protocol(const char* protocol_name);

/**
 * Open the desktop login page in the default browser
 * 
 * @param redirect_uri The URI to redirect to after successful login (e.g. "chronosync://callback")
 * @return true on success, false on failure
 */
bool start_desktop_login(const char* redirect_uri);

/**
 * Parse a JWT token from a ChronoSync URI
 * 
 * @param uri The URI string (e.g. "chronosync://callback?token=xyz")
 * @param buffer A buffer to store the token
 * @param buffer_size The size of the buffer
 * @return true if token was found and stored, false otherwise
 */
bool parse_uri_token(const char* uri, char* buffer, size_t buffer_size);

#ifdef __cplusplus
}
#endif

#endif /* CHRONOSYNC_CLIENT_H */ 