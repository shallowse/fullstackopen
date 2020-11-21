interface BmiValues {
  height: number;
  mass: number;
}

function parseArguments(args: Array<string>): BmiValues {
  if (args.length !== 4) {
    throw new Error('Usage: npm run calculateBmi <height> <weight>');
  }

  // Here type inference is utilized
  const height = Number(args[2]);
  const mass = Number(args[3]);

  if (isNaN(height) || isNaN(mass)) {
    throw new Error('Provided values for height or weight were not numbers!');
  }

  return {
    height,
    mass,
  };
};

// https://en.wikipedia.org/wiki/Body_mass_index
export function calculateBmi(height: number, mass: number): string {
  if (height <= 0 || mass <= 0) {
    throw new Error('Provided values were negative or zero');
  }

  const h: number = height / 100;
  const bmi: number = mass / (h * h);

  let retMsg: string;
  if (bmi <= 15) {
    retMsg = 'Very severely underweight';
  } else if (bmi > 15 && bmi <= 16) {
    retMsg = 'Severely underweight';
  } else if (bmi > 16 && bmi <= 18.5) {
    retMsg = 'Underweight';
  } else if (bmi > 18.5 && bmi <= 25) {
    retMsg = 'Normal (healthy weight)';
  } else if (bmi > 25 && bmi <= 30) {
    retMsg = 'Overweight';
  } else if (bmi > 30 && bmi <= 35) {
    retMsg = 'Obese Class I (Moderately obese)';
  } else if (bmi > 35 && bmi <= 40) {
    retMsg = 'Obese Class II (Severely obese)';
  } else if (bmi > 40) {
    retMsg = 'Obese Class III (Very severely obese)';
  } else {
    retMsg = 'Error: something unexpected happened';
  }
  return retMsg;
}

try {
  const { height, mass } = parseArguments(process.argv);
  console.log(calculateBmi(height, mass));
} catch (error) {
  console.log('Error, something went wrong, message: ', error.message);
}
