import express from 'express';
const app = express();
import cors from 'cors';

const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cors());

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
