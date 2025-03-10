import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT) || 3000;

console.log('Starting server with configuration:');
console.log(`Port: ${port}`);
console.log(`Node ENV: ${process.env.NODE_ENV}`);
console.log(`Process ID: ${process.pid}`);

// Middleware
app.use(cors({
  origin: '*', // Temporarily allow all origins for testing
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

// Basic test route
apiRouter.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ 
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend is working!' });
});

// Mount API routes
app.use('/api', apiRouter);

// Root path redirect to API
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`API root available at: http://0.0.0.0:${port}/api`);
  console.log(`Health check available at: http://0.0.0.0:${port}/api/health`);
  console.log(`Test endpoint available at: http://0.0.0.0:${port}/api/test`);
}); 