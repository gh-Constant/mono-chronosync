use serde::{Deserialize, Serialize};
use std::ffi::CString;
use std::os::raw::c_char;
use supabase_rs::SupabaseClient;
use std::sync::Arc;
use tokio::runtime::Runtime;
use serde_json::Value;
//use supabase::SupabaseClient; // If using supabase-community crate.

// Structure to represent data fetched from Supabase (adjust to your table schema)
#[derive(Deserialize, Serialize, Debug)]
struct MyData {
    id: i32,
    name: String,
    description: Option<String>,
}

// Error handling enum
#[derive(Debug)]
pub enum Error {
    SupabaseError(String),
    JsonError(String),
    Utf8Error(std::str::Utf8Error),
    NulError(std::ffi::NulError),
    RuntimeError(String),
}

// Convert errors to C-compatible strings
impl From<Error> for CString {
    fn from(err: Error) -> Self {
        let error_message = match err {
            Error::SupabaseError(msg) => format!("Supabase error: {}", msg),
            Error::JsonError(msg) => format!("JSON error: {}", msg),
            Error::Utf8Error(e) => format!("UTF-8 error: {}", e),
            Error::NulError(e) => format!("Null error: {}", e),
            Error::RuntimeError(e) => format!("Runtime error: {}", e),
        };
        CString::new(error_message).unwrap_or_else(|_| CString::new("Unknown error").unwrap())
    }
}

// Helper function to convert a Rust string to a C-compatible string
fn to_c_string(s: Option<String>) -> Result<*mut c_char, Error> {
     match s {
        Some(s) => {
            let c_string = CString::new(s).map_err(Error::NulError)?;
            Ok(c_string.into_raw())
        },
        None => Ok(std::ptr::null_mut())

    }
}

pub struct SupabaseClientWrapper {
    client: Arc<SupabaseClient>,
    runtime: Runtime,
}

impl SupabaseClientWrapper {
    pub fn new(supabase_url: String, supabase_key: String) -> Result<Self, Error> {
        let runtime = Runtime::new()
            .map_err(|e| Error::RuntimeError(e.to_string()))?;

        let client = SupabaseClient::new(supabase_url, supabase_key);
        
        Ok(Self {
            client: Arc::new(client),
            runtime,
        })
    }

    pub fn select_all(&self, table_name: String) -> Result<String, Error> {
        let client_ref = Arc::clone(&self.client);
        
        self.runtime.block_on(async move {
            let result = client_ref
                .select(&table_name)
                .execute()
                .await
                .map_err(|e| Error::SupabaseError(e.to_string()))?;

            serde_json::to_string(&result)
                .map_err(|e| Error::JsonError(e.to_string()))
        })
    }

    pub fn insert_data(&self, table_name: String, data: String) -> Result<String, Error> {
        let client_ref = Arc::clone(&self.client);
        
        self.runtime.block_on(async move {
            let my_data: Value = serde_json::from_str(&data)
                .map_err(|e| Error::JsonError(e.to_string()))?;

            let result = client_ref
                .insert(&table_name, my_data)
                .await
                .map_err(|e| Error::SupabaseError(e.to_string()))?;

            Ok(result)
        })
    }
}

// Initialize Supabase client (call this once from your C code)
#[no_mangle]
pub extern "C" fn create_supabase_client(
    supabase_url: *const c_char,
    supabase_key: *const c_char,
) -> *mut SupabaseClientWrapper {
    let supabase_url = unsafe {
        std::ffi::CStr::from_ptr(supabase_url)
            .to_string_lossy()
            .into_owned()
    };
    
    let supabase_key = unsafe {
        std::ffi::CStr::from_ptr(supabase_key)
            .to_string_lossy()
            .into_owned()
    };

    match SupabaseClientWrapper::new(supabase_url, supabase_key) {
        Ok(client) => Box::into_raw(Box::new(client)),
        Err(_) => std::ptr::null_mut(),
    }
}

// Fetch data from Supabase (example function)
#[no_mangle]
pub extern "C" fn select_all(
    client: *mut SupabaseClientWrapper,
    table_name: *const c_char,
) -> *mut c_char {
    let client = unsafe {
        assert!(!client.is_null());
        &*client
    };

    let table_name = unsafe {
        std::ffi::CStr::from_ptr(table_name)
            .to_string_lossy()
            .into_owned()
    };

    match client.select_all(table_name) {
        Ok(result) => {
            let c_str = CString::new(result).unwrap();
            c_str.into_raw()
        }
        Err(_) => std::ptr::null_mut(),
    }
}

// Example function to insert data.
#[no_mangle]
pub extern "C" fn insert_data(
    client: *mut SupabaseClientWrapper,
    table_name: *const c_char,
    data: *const c_char,
) -> *mut c_char {
    let client = unsafe {
        assert!(!client.is_null());
        &*client
    };

    let table_name = unsafe {
        std::ffi::CStr::from_ptr(table_name)
            .to_string_lossy()
            .into_owned()
    };

    let data = unsafe {
        std::ffi::CStr::from_ptr(data)
            .to_string_lossy()
            .into_owned()
    };

    match client.insert_data(table_name, data) {
        Ok(result) => {
            let c_str = CString::new(result).unwrap();
            c_str.into_raw()
        }
        Err(_) => std::ptr::null_mut(),
    }
}

// Free the result string allocated by fetch_data
#[no_mangle]
pub extern "C" fn free_string(ptr: *mut c_char) {
    unsafe {
        if !ptr.is_null() {
            let _ = CString::from_raw(ptr);
        }
    }
}

// Free the Supabase client
#[no_mangle]
pub extern "C" fn free_client(ptr: *mut SupabaseClientWrapper) {
    unsafe {
        if !ptr.is_null() {
            let _ = Box::from_raw(ptr);
        }
    }
}