import { createServer } from './server';
const port = Number(process.env.PORT) || 3000;
const app = createServer();

app.listen(port, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`Server started on http://0.0.0.0:${port}`);
  console.log(`Health check: http://0.0.0.0:${port}/api/health`);
  console.log('='.repeat(50));
}); 