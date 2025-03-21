#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>
#include <winhttp.h>

// Structure to hold response data
struct ResponseData {
    char* data;
    size_t size;
    size_t capacity;
};

// Initialize response data
void init_response(struct ResponseData* resp) {
    resp->capacity = 1024;
    resp->data = malloc(resp->capacity);
    resp->size = 0;
    if (resp->data) {
        resp->data[0] = '\0';
    }
}

// Append data to response
void append_response(struct ResponseData* resp, const char* data, size_t len) {
    if (resp->size + len + 1 > resp->capacity) {
        size_t new_capacity = resp->capacity * 2;
        char* new_data = realloc(resp->data, new_capacity);
        if (new_data) {
            resp->data = new_data;
            resp->capacity = new_capacity;
        } else {
            return;
        }
    }
    memcpy(resp->data + resp->size, data, len);
    resp->size += len;
    resp->data[resp->size] = '\0';
}

// Convert wide string to UTF-8
char* wide_to_utf8(LPCWSTR wide_str) {
    int len = WideCharToMultiByte(CP_UTF8, 0, wide_str, -1, NULL, 0, NULL, NULL);
    char* utf8 = malloc(len);
    WideCharToMultiByte(CP_UTF8, 0, wide_str, -1, utf8, len, NULL, NULL);
    return utf8;
}

// Convert UTF-8 to wide string
LPWSTR utf8_to_wide(const char* utf8_str) {
    int len = MultiByteToWideChar(CP_UTF8, 0, utf8_str, -1, NULL, 0);
    LPWSTR wide = malloc(len * sizeof(WCHAR));
    MultiByteToWideChar(CP_UTF8, 0, utf8_str, -1, wide, len);
    return wide;
}

// Function to make HTTP requests
char* make_request(const char* url, const char* method, const char* data, const char* apikey) {
    LPWSTR wide_url = utf8_to_wide(url);
    URL_COMPONENTS url_comp = {0};
    url_comp.dwStructSize = sizeof(url_comp);
    url_comp.dwHostNameLength = (DWORD)-1;
    url_comp.dwUrlPathLength = (DWORD)-1;
    
    // Parse URL
    if (!WinHttpCrackUrl(wide_url, 0, 0, &url_comp)) {
        free(wide_url);
        return NULL;
    }

    // Get host name and path
    WCHAR host_name[256] = {0};
    WCHAR url_path[1024] = {0};
    wcsncpy(host_name, url_comp.lpszHostName, url_comp.dwHostNameLength);
    wcsncpy(url_path, url_comp.lpszUrlPath, url_comp.dwUrlPathLength);

    // Initialize WinHTTP
    HINTERNET session = WinHttpOpen(L"Supabase Client",
                                   WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                                   WINHTTP_NO_PROXY_NAME,
                                   WINHTTP_NO_PROXY_BYPASS,
                                   0);
    if (!session) {
        free(wide_url);
        return NULL;
    }

    // Connect to server
    HINTERNET connect = WinHttpConnect(session,
                                      host_name,
                                      url_comp.nPort,
                                      0);
    if (!connect) {
        WinHttpCloseHandle(session);
        free(wide_url);
        return NULL;
    }

    // Create request
    HINTERNET request = WinHttpOpenRequest(connect,
                                          method[0] == 'P' ? L"POST" : L"GET",
                                          url_path,
                                          NULL,
                                          WINHTTP_NO_REFERER,
                                          WINHTTP_DEFAULT_ACCEPT_TYPES,
                                          WINHTTP_FLAG_SECURE);
    if (!request) {
        WinHttpCloseHandle(connect);
        WinHttpCloseHandle(session);
        free(wide_url);
        return NULL;
    }

    // Add headers
    WCHAR headers[1024];
    swprintf(headers, 1024, 
        L"Content-Type: application/json\r\n"
        L"apikey: %hs\r\n"
        L"Authorization: Bearer %hs\r\n"
        L"Prefer: return=minimal\r\n"
        L"Accept: application/json\r\n",
        apikey, apikey);
    
    // Print headers for debugging
    char* debug_headers = wide_to_utf8(headers);
    printf("Debug - Headers:\n%s\n", debug_headers);
    free(debug_headers);
    
    WinHttpAddRequestHeaders(request, headers, -1L, WINHTTP_ADDREQ_FLAG_ADD | WINHTTP_ADDREQ_FLAG_REPLACE);

    // Send request
    BOOL result = WinHttpSendRequest(request,
                                    WINHTTP_NO_ADDITIONAL_HEADERS,
                                    0,
                                    data ? (LPVOID)data : WINHTTP_NO_REQUEST_DATA,
                                    data ? strlen(data) : 0,
                                    data ? strlen(data) : 0,
                                    0);
    if (!result) {
        WinHttpCloseHandle(request);
        WinHttpCloseHandle(connect);
        WinHttpCloseHandle(session);
        free(wide_url);
        return NULL;
    }

    // Receive response
    result = WinHttpReceiveResponse(request, NULL);
    if (!result) {
        WinHttpCloseHandle(request);
        WinHttpCloseHandle(connect);
        WinHttpCloseHandle(session);
        free(wide_url);
        return NULL;
    }

    // Get status code
    DWORD status_code = 0;
    DWORD size = sizeof(status_code);
    WinHttpQueryHeaders(request,
                       WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
                       WINHTTP_HEADER_NAME_BY_INDEX,
                       &status_code,
                       &size,
                       WINHTTP_NO_HEADER_INDEX);

    // Read response data
    struct ResponseData response;
    init_response(&response);

    DWORD bytes_available;
    DWORD bytes_read;
    char buffer[4096];
    
    do {
        bytes_available = 0;
        if (!WinHttpQueryDataAvailable(request, &bytes_available)) {
            break;
        }

        if (bytes_available == 0) {
            break;
        }

        if (bytes_available > sizeof(buffer)) {
            bytes_available = sizeof(buffer);
        }

        if (!WinHttpReadData(request, buffer, bytes_available, &bytes_read)) {
            break;
        }

        append_response(&response, buffer, bytes_read);
    } while (bytes_available > 0);

    // Check status code
    if (status_code >= 400) {
        printf("HTTP Error %lu: %s\n", status_code, response.data);
        free(response.data);
        response.data = NULL;
    }

    // Cleanup
    WinHttpCloseHandle(request);
    WinHttpCloseHandle(connect);
    WinHttpCloseHandle(session);
    free(wide_url);

    return response.data;
}

void test_select_all_applications(const char* base_url, const char* apikey) {
    printf("\nTesting select all applications:\n");
    char url[256];
    snprintf(url, sizeof(url), "%s/applications", base_url);
    
    char* result = make_request(url, "GET", NULL, apikey);
    if (result) {
        printf("Applications: %s\n", result);
        free(result);
    } else {
        printf("Failed to select applications\n");
    }
}

void test_insert_session(const char* base_url, const char* apikey) {
    printf("\nTesting insert session:\n");
    char url[256];
    snprintf(url, sizeof(url), "%s/app_usage_sessions", base_url);
    
    const char* data = "{"
        "\"user_id\": \"1692d26d-b6c7-47a6-b705-03db48ab0631\","
        "\"device_id\": 1,"
        "\"app_id\": 1,"
        "\"start_time\": \"2025-02-15T21:57:24+00:00\","
        "\"end_time\": \"2025-02-15T22:57:24+00:00\""
    "}";
    
    printf("Attempting to insert data: %s\n", data);
    char* result = make_request(url, "POST", data, apikey);
    if (result) {
        printf("✅ Insert successful:\n%s\n", result);
        free(result);
    } else {
        printf("❌ Insert failed\n");
    }
}

void test_select_filtered_sessions(const char* base_url, const char* apikey) {
    printf("\nTesting select filtered sessions:\n");
    char url[512];
    snprintf(url, sizeof(url), 
        "%s/app_usage_sessions?user_id=eq.1692d26d-b6c7-47a6-b705-03db48ab0631&order=start_time.asc&limit=5",
        base_url);
    
    char* result = make_request(url, "GET", NULL, apikey);
    if (result) {
        printf("Filtered sessions: %s\n", result);
        free(result);
    } else {
        printf("Failed to select filtered sessions\n");
    }
}

int main(void) {
    // Supabase credentials
    const char* supabase_url = "https://bmioebnzppfdbswzmuse.supabase.co/rest/v1";
    const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaW9lYm56cHBmZGJzd3ptdXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MjgyMTIsImV4cCI6MjA1NDUwNDIxMn0.eMskblWUvVf8YblHO_hQAa2Ijm0EDwyYS9HSL6RLSeg";
    
    printf("=== Supabase REST API Test ===\n\n");

    // Run tests
    test_select_all_applications(supabase_url, supabase_key);
    test_select_filtered_sessions(supabase_url, supabase_key);
    test_insert_session(supabase_url, supabase_key);
    
    printf("\nPress Enter to exit...");
    getchar();
    return 0;
} 