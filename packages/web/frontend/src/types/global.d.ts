// Define global runtime configuration interface
interface RUNTIME_CONFIG {
  API_URL: string;
  ENV: string;
  TIMESTAMP: string;
}

// Add RUNTIME_CONFIG to the Window interface
interface Window {
  RUNTIME_CONFIG?: RUNTIME_CONFIG;
} 