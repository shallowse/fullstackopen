import express from 'express';
import { calculateBmi } from '../bmi';

const app = express();
const port = 3002;

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (Object.keys(req.query).length !== 2) {
    res.status(400).json({ error: 'Too few parameters' });
    return;
  }

  if (req.query.height === undefined || req.query.weight === undefined) {
    res.status(400).json({ error: 'Parameter(s) missing' });
    return;
  }

  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const bmi: string = calculateBmi(height, weight);
  console.log(height, weight, bmi);

  const retObj = {
    weight,
    height,
    bmi,
  };
  res.json(retObj);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
