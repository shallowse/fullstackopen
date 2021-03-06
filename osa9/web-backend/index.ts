import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
const port = 3002;

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (Object.keys(req.query).length !== 2) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (req.query.height === undefined || req.query.weight === undefined) {
    res.status(400).json({ error: 'parameter(s) missing' });
    return;
  }

  if (req.query.height === '' || req.query.weight === '') {
    res.status(400).json({ error: 'parameter(s) contained nothing' });
    return;
  }

  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  try {
    const bmi = calculateBmi(height, weight);
    console.log(height, weight, bmi);

    const retObj = {
      weight,
      height,
      bmi,
    };
    res.json(retObj);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

/*
  req.body = {
    "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
    "target": 2.5
  }
*/
app.post('/exercises', (req, res) => {
  //console.log(req.body);
  if (!req.body.daily_exercises || !req.body.target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  const target = Number(req.body.target);
  if (isNaN(target) || target < 0) {
    res.status(400).json({ error: 'malformatted parameter: target' });
    return;
  }

  const tmp: Array<string> = req.body.daily_exercises;
  const dailyHours: Array<number> = tmp.map(x => Number(x));
  for (let i = 0; i < dailyHours.length; i++) {
    if (isNaN(dailyHours[i]) || dailyHours[i] < 0) {
      res.status(400).json({ error: 'malformatted parameters - array value not a number or negative' });
      return;
    }
  }

  const retObj = calculateExercises(dailyHours, target);
  res.json(retObj);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
