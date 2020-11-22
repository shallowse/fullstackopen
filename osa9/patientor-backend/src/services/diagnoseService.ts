import diagnoseData from '../../data/diagnoses.json';
import { DiagnoseEntry } from '../types';

const getEntries = (): Array<DiagnoseEntry> => {
  const diagnoses: Array<DiagnoseEntry> = diagnoseData;
  return diagnoses;
};

export default {
  getEntries,
};
