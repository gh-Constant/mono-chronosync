import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}); 