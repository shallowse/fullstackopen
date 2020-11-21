/*
  Note: to pass negative numbers as arguments one needs to use '--' so that they are not discarded

  (1) '--' not used --> negative values are discarded
  $ npm run calculateExercises 0 1 0 2 -4.5 0 3 1 2 -1 0 10 -22
  > ts-node exerciseCalculator.ts "0" "1" "0" "2" "0" "3" "1" "2" "0" "10"

  (2) '--' is used --> negative values are included in the argument list
  $ npm run calculateExercises -- 0 1 0 2 -4.5 0 3 1 2 -1 0 10 -22
  > ts-node exerciseCalculator.ts "0" "1" "0" "2" "-4.5" "0" "3" "1" "2" "-1" "0" "10" "-22"
*/
type Rating = 1 | 2 | 3;

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseArgs {
  dailyHours: Array<number>;
  targetDailyAmount: number;
}

function parseArguments(args: Array<string>): ExerciseArgs {
  //console.log('args', args);
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  // Simplify the array by removing the first two arguments
  const vals = args.slice().splice(2);

  // Type inference
  const targetDailyAmount = Number(vals[0]);
  if (isNaN(targetDailyAmount) || targetDailyAmount < 0) {
    throw new Error('Target daily exercise amount value was not a number or contained a negative value');
  }

  const tmp = vals.slice().splice(1, vals.length);
  const dailyHours = tmp.map(x => Number(x));
  dailyHours.forEach(x => {
    if (isNaN(x)) {
      throw new Error('Daily hour value was not a number');
    }
    if (x < 0) {
      throw new Error('Daily hour value contained a negative value');
    }
  });

  //console.log('dailyHours', dailyHours);
  //console.log('targetDailyAmout', targetDailyAmount);

  return {
    dailyHours,
    targetDailyAmount,
  };
}

/*
  dailyHours: [ x: number | x is number of hours exercised per day ]
  targetDailyAmount: target amount of daily exercise hours
*/
function calculateExercises(dailyHours: Array<number>, targetDailyAmount: number): Result {
  const periodLength: number = dailyHours.length;
  const trainingDays: number = dailyHours.filter(x => x !== 0).length;

  const trainingHours: number = dailyHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const averageHours: number = trainingHours / periodLength;
  const success: boolean = averageHours >= targetDailyAmount;

  let rating: Rating;
  let ratingDescription: string = '';
  if (averageHours < targetDailyAmount) {
    rating = 1;
    ratingDescription = 'target not reached';
  } else if (averageHours === targetDailyAmount) {
    rating = 2;
    ratingDescription = 'target was reached';
  } else if (averageHours > targetDailyAmount) {
    rating = 3;
    ratingDescription = 'target exceeded';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: targetDailyAmount,
    average: averageHours,
  };
}

try {
  const { dailyHours, targetDailyAmount } = parseArguments(process.argv);
  console.log(calculateExercises(dailyHours, targetDailyAmount));
} catch (error) {
  console.log('ERROR: ', error.message);
}
