#!/usr/bin/env node

/**
 * This script simulates a C++ desktop app opening the browser for login.
 * It will open the default browser with the desktop login URL.
 */

const { exec } = require('child_process');
const http = require('http');
const url = require('url');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const REDIRECT_URI = 'chronosync://auth';
const PORT = 8765;

console.log('Chronosync Desktop App Login Test');
console.log('--------------------------------');

// Create a simple HTTP server to simulate the desktop app receiving the token
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/') {
    const token = parsedUrl.query.token;
    
    if (token) {
      console.log('\n✅ Successfully received token from web app!');
      console.log(`Token: ${token}`);
      
      // Send a success response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Chronosync Desktop Login</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 50px; }
              .success { color: #10B981; font-size: 48px; margin-bottom: 20px; }
              h1 { color: #4F46E5; }
              p { color: #6B7280; }
              .token { background: #F3F4F6; padding: 10px; border-radius: 5px; word-break: break-all; }
            </style>
          </head>
          <body>
            <div class="success">✓</div>
            <h1>Login Successful!</h1>
            <p>You can now close this window and return to the desktop app.</p>
            <p>The token has been received by the desktop application.</p>
            <div class="token">${token}</div>
          </body>
        </html>
      `);
      
      // Close the server after a delay
      setTimeout(() => {
        server.close();
        console.log('\nTest completed. Exiting...');
        process.exit(0);
      }, 5000);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: No token received</h1>');
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  
  // Construct the login URL
  const loginUrl = `${FRONTEND_URL}/desktop-login?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  
  console.log(`\nOpening browser to: ${loginUrl}`);
  console.log('\nWaiting for authentication...');
  
  // Open the browser using the exec function
  const command = process.platform === 'darwin' 
    ? `open "${loginUrl}"` 
    : process.platform === 'win32' 
      ? `start "${loginUrl}"` 
      : `xdg-open "${loginUrl}"`;
  
  exec(command, (error) => {
    if (error) {
      console.error('Failed to open browser:', error);
    }
  });
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
}); 