import diagnoseData from '../../data/diagnoses';
import { Diagnose } from '../types';

const getEntries = (): Array<Diagnose> => {
  const diagnoses: Array<Diagnose> = diagnoseData;
  return diagnoses;
};

export default {
  getEntries,
};
