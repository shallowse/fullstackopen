import express from 'express';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';

const app = express();
import cors from 'cors';

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
app.use((err: any, _req: any, res: any, next: any) => {
  if (err.name === 'SyntaxError') {
    // SyntaxError encountered e.g. while receiving malformed JSON data in POST
    return res.status(400).send(String(err.message));
  }
  next(err);
});
/* eslint-enable */

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
