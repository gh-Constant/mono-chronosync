import { createServer } from './server';

const port = process.env.PORT || 3005;
const app = createServer();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 