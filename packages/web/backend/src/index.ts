import { createServer } from './server';

const port = Number(process.env.PORT) || 3005;

async function startServer() {
  try {
    const app = await createServer();
    
    app.listen(port, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`Server started on http://0.0.0.0:${port}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 