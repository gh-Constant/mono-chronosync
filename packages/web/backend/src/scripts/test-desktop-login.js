#!/usr/bin/env node

/**
 * This script simulates a C++ desktop app opening the browser for login.
 * It will open the default browser with the desktop login URL.
 */

const { exec } = require('child_process');
const http = require('http');
const url = require('url');

// Configuration
const FRONTEND_URL = 'http://localhost:4173';
const REDIRECT_URI = 'web+chronosync://auth';
const PORT = 8765;

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌ ERROR' : type === 'success' ? '✅ SUCCESS' : 'ℹ️ INFO';
  console.log(`[${timestamp}] ${prefix}: ${message}`);
}

log('Chronosync Desktop App Login Test Starting');
log(`Frontend URL: ${FRONTEND_URL}`);
log(`Redirect URI: ${REDIRECT_URI}`);
log(`Local server port: ${PORT}`);

// Create a simple HTTP server to handle protocol registration and token reception
const server = http.createServer((req, res) => {
  log(`Received request: ${req.method} ${req.url}`);
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/') {
    // Serve the protocol handler registration page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chronosync Protocol Handler</title>
          <script>
            // Register the protocol handler when the page loads
            window.onload = function() {
              try {
                navigator.registerProtocolHandler(
                  'web+chronosync',
                  'http://localhost:${PORT}/?token=%s',
                  'Chronosync Auth Handler'
                );
                // Redirect to the login page after registration
                window.location.href = '${FRONTEND_URL}/desktop-login?redirect_uri=${encodeURIComponent(REDIRECT_URI)}';
              } catch (e) {
                console.error('Failed to register protocol handler:', e);
                document.body.innerHTML += '<p style="color: red;">Error: ' + e.message + '</p>';
              }
            }
          </script>
        </head>
        <body>
          <h1>Setting up Chronosync protocol handler...</h1>
          <p>You will be redirected to the login page shortly.</p>
          <p>Note: You may need to allow the protocol handler in your browser settings.</p>
        </body>
      </html>
    `);
  } else if (parsedUrl.pathname === '/auth') {
    log('Processing auth callback');
    const token = parsedUrl.query.token;
    
    if (token) {
      log('Token successfully received', 'success');
      log(`Token length: ${token.length} characters`);
      
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
      log('Starting server shutdown timer (5s)');
      setTimeout(() => {
        server.close(() => {
          log('Server successfully closed', 'success');
          log('Test completed successfully', 'success');
        });
        process.exit(0);
      }, 5000);
    } else {
      log('No token received in request', 'error');
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: No token received</h1>');
    }
  } else {
    log(`Invalid path requested: ${parsedUrl.pathname}`, 'error');
    res.writeHead(404);
    res.end();
  }
});

// Start the server
server.listen(PORT, () => {
  log(`Local server started successfully on port ${PORT}`, 'success');
  
  // Open the browser to our protocol handler registration page first
  const registrationUrl = `http://localhost:${PORT}/`;
  
  log(`Opening browser to: ${registrationUrl}`);
  
  // Open the browser using the appropriate command based on the platform
  const platform = process.platform;
  let command;
  
  switch (platform) {
    case 'darwin':  // macOS
      command = `open "${registrationUrl}"`;
      break;
    case 'win32':   // Windows
      command = `start "" "${registrationUrl}"`;
      break;
    default:        // Linux and others
      command = `xdg-open "${registrationUrl}"`;
      break;
  }

  log(`Using platform-specific command for ${platform}: ${command}`);

  exec(command, (error) => {
    if (error) {
      log(`Failed to open browser: ${error.message}`, 'error');
      server.close(() => {
        log('Server closed due to browser open error', 'error');
      });
      process.exit(1);
    } else {
      log('Browser opened successfully', 'success');
      log('Waiting for protocol handler registration...');
    }
  });
});

// Handle server errors
server.on('error', (err) => {
  log(`Server error: ${err.message}`, 'error');
  process.exit(1);
}); 