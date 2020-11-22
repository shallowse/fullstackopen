import diagnoseData from '../../data/diagnoses';
import { DiagnoseEntry } from '../types';

const getEntries = (): Array<DiagnoseEntry> => {
  const diagnoses: Array<DiagnoseEntry> = diagnoseData;
  return diagnoses;
};

export default {
  getEntries,
};
