import diagnoseData from '../../data/diagnoses';
import { Diagnose } from '../types';

const getEntries = (): Diagnose[] => {
  const diagnoses: Diagnose[] = diagnoseData;
  return diagnoses;
};

export default {
  getEntries,
};
