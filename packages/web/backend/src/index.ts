import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT) || 3000;

console.log('Starting server with configuration:');
console.log(`Port: ${port}`);
console.log(`Node ENV: ${process.env.NODE_ENV}`);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Root endpoint working!' });
});

app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend is working!' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test endpoint available at: http://0.0.0.0:${port}/api/test`);
  console.log(`Health check available at: http://0.0.0.0:${port}/health`);
}); 